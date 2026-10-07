import { createPublicClient } from "@/lib/supabase/public";
import { LOW_STOCK_AT, money, stockLabel } from "./format";
import type {
  CartProduct,
  Category,
  DeliveryZone,
  Department,
  PaymentMethod,
  Product,
  ProductDetail,
} from "./types";

const PRODUCT_COLUMNS =
  "slug, title, spec, description, image_slug, image_url, amount, was_amount, stock_count, trend_rank, rating, order_count, departments!inner(name, ink), categories!inner(name, slug)";

type ProductRow = {
  slug: string;
  title: string;
  spec: string;
  description: string | null;
  image_slug: string;
  image_url: string | null;
  amount: number;
  was_amount: number | null;
  stock_count: number;
  trend_rank: number | null;
  rating: number | null;
  order_count: number | null;
  departments: { name: string; ink: string };
  categories: { name: string; slug: string };
};

function toProduct(row: ProductRow): Product {
  const saving = row.was_amount ? row.was_amount - row.amount : 0;
  return {
    slug: row.slug,
    title: row.title,
    spec: row.spec,
    description: row.description,
    dept: row.departments.name,
    ink: row.departments.ink,
    category: row.categories.name,
    categorySlug: row.categories.slug,
    image: row.image_url || row.image_slug,
    amount: row.amount,
    stockCount: row.stock_count,
    trendRank: row.trend_rank,
    rating: row.rating,
    orderCount: row.order_count,
    price: money(row.amount),
    was: row.was_amount ? money(row.was_amount) : null,
    saveLabel: saving > 0 ? `Save ${money(saving)}` : null,
    stock: stockLabel(row.stock_count),
    lowStock: row.stock_count <= LOW_STOCK_AT,
  };
}

/** Products in the shape the client-side basket needs, for every page. */
export async function getCartCatalog(): Promise<CartProduct[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug, title, spec, image_slug, image_url, amount, stock_count, product_variants(colour, is_available)",
    )
    .eq("is_active", true)
    .order("title");
  if (error) throw error;
  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    spec: row.spec,
    image: row.image_url || row.image_slug,
    amount: row.amount,
    price: money(row.amount),
    stockCount: row.stock_count,
    colours: row.product_variants
      .filter((v) => v.is_available)
      .map((v) => v.colour),
  }));
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("category_product_counts")
    .select("name, slug, image_slug, ink, department, product_count")
    .order("position");
  if (error) throw error;
  return data.map((row) => ({
    name: row.name ?? "",
    slug: row.slug ?? "",
    image: row.image_slug ?? "",
    ink: row.ink ?? "#3D3AD8",
    department: row.department ?? "",
    count: row.product_count ?? 0,
  }));
}

export async function getDepartments(): Promise<Department[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("departments")
    .select("name, ink")
    .order("position");
  if (error) throw error;
  return data;
}

export async function getHomePage() {
  const supabase = createPublicClient();
  const [categories, products] = await Promise.all([
    getCategories(),
    supabase
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_active", true)
      .order("trend_rank", { ascending: true, nullsFirst: false })
      .order("order_count", { ascending: false }),
  ]);
  if (products.error) throw products.error;
  const all = products.data.map(toProduct);
  return {
    categories,
    trending: all.filter((p) => p.trendRank !== null),
    shelf: all.filter((p) => p.trendRank === null).slice(0, 12),
  };
}

export type CatalogFilters = {
  q?: string;
  category?: string;
  department?: string;
  sort?: string;
  min?: number;
  max?: number;
  sale?: boolean;
};

export async function searchProducts(
  filters: CatalogFilters,
): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_active", true);

  if (filters.category) query = query.eq("categories.slug", filters.category);
  if (filters.department)
    query = query.eq("departments.name", filters.department);
  if (filters.q) {
    // Commas and parens would be read as PostgREST filter syntax.
    const term = filters.q.replace(/[,()*%\\]/g, " ").trim();
    if (term) query = query.or(`title.ilike.%${term}%,spec.ilike.%${term}%`);
  }
  if (filters.min) query = query.gte("amount", filters.min);
  if (filters.max) query = query.lte("amount", filters.max);
  if (filters.sale) query = query.not("was_amount", "is", null);

  if (filters.sort === "price-asc") query = query.order("amount");
  else if (filters.sort === "price-desc")
    query = query.order("amount", { ascending: false });
  else
    query = query
      .order("trend_rank", { ascending: true, nullsFirst: false })
      .order("order_count", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);
  if (error) throw error;
  return data.map((row) => row.slug);
}

export async function getProductDetail(
  slug: string,
): Promise<ProductDetail | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `${PRODUCT_COLUMNS}, product_specs(label, value, position), product_variants(colour, is_available, position), reviews(id, author_name, location, stars, body, created_at)`,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    product: toProduct(data),
    specs: [...data.product_specs]
      .sort((a, b) => a.position - b.position)
      .map((s) => ({ label: s.label, value: s.value })),
    variants: [...data.product_variants]
      .sort((a, b) => a.position - b.position)
      .map((v) => ({ colour: v.colour, available: v.is_available })),
    reviews: [...data.reviews]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((r) => ({
        id: r.id,
        author: r.author_name,
        location: r.location,
        stars: r.stars,
        body: r.body,
      })),
  };
}

/** Same category first, then anything else, so the shelf is never empty. */
export async function getRelatedProducts(
  product: Product,
  limit = 5,
): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_active", true)
    .neq("slug", product.slug)
    .order("order_count", { ascending: false })
    .limit(24);
  if (error) throw error;
  const all = data.map(toProduct);
  const sameCategory = all.filter(
    (p) => p.categorySlug === product.categorySlug,
  );
  const others = all.filter((p) => p.categorySlug !== product.categorySlug);
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getCheckoutOptions(): Promise<{
  zones: DeliveryZone[];
  methods: PaymentMethod[];
}> {
  const supabase = createPublicClient();
  const [zones, methods] = await Promise.all([
    supabase
      .from("delivery_zones")
      .select("city, urdu_label, fee, eta")
      .order("position"),
    supabase
      .from("payment_methods")
      .select("code, label, urdu_label, blurb, urdu_blurb, delivery_discount")
      .order("position"),
  ]);
  if (zones.error) throw zones.error;
  if (methods.error) throw methods.error;
  return {
    zones: zones.data.map((z) => ({
      city: z.city,
      urduLabel: z.urdu_label,
      fee: z.fee,
      eta: z.eta,
    })),
    methods: methods.data.map((m) => ({
      code: m.code,
      label: m.label,
      urduLabel: m.urdu_label,
      blurb: m.blurb,
      urduBlurb: m.urdu_blurb,
      discount: m.delivery_discount,
    })),
  };
}
