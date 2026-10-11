import Link from "next/link";
import {
  getCategories,
  getDepartments,
  getHomePage,
  getRelatedProducts,
  searchProducts,
} from "../queries";
import { starRow } from "../format";
import { ProductCard, ProductPhoto } from "./product-card";
import { ProductControls } from "./product-controls";
import type { Product, ProductDetail } from "../types";
export function Breadcrumb({
  department,
  current,
}: {
  department?: string;
  current: string;
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      {department ? (
        <>
          <Link href={`/category?department=${encodeURIComponent(department)}`}>
            {department}
          </Link>
          <span>/</span>
        </>
      ) : (
        <>
          <Link href="/category">All products</Link>
          <span>/</span>
        </>
      )}
      <span>{current}</span>
    </nav>
  );
}
export async function HomePage() {
  const { categories, trending, shelf } = await getHomePage();
  return (
    <>
      <section className="category-section">
        <h1>Shop by category</h1>
        <div className="category-strip">
          {categories.map((c) => (
            <Link
              key={c.slug}
              className="category-item"
              href={`/category?category=${encodeURIComponent(c.slug)}`}
            >
              <div className="category-circle" style={{ borderColor: c.ink }}>
                <ProductPhoto image={c.image} alt={c.name} />
              </div>
              <strong>{c.name}</strong>
              <small>
                {c.count} {c.count === 1 ? "item" : "items"}
              </small>
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-title">
          <h2>Top trends this week</h2>
          <p>Ranked by orders in the last 7 days · from our TikTok</p>
        </div>
        <div className="product-grid trends">
          {trending.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <section className="section shelf">
        <div className="section-title">
          <h2>All products</h2>
          <p>Ships from Peshawar</p>
        </div>
        <div className="product-grid">
          {shelf.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className="center">
          <Link href="/category" className="button primary">
            Browse all products
          </Link>
        </div>
      </section>
    </>
  );
}
export async function CategoryPage({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : "";
  const query = value("q");
  const category = value("category");
  const department = value("department");
  const sort = value("sort");
  const min = Number(value("min")) || undefined;
  const max = Number(value("max")) || undefined;
  const sale = !!value("sale");

  const [products, categories, departments] = await Promise.all([
    searchProducts({ q: query, category, department, sort, min, max, sale }),
    getCategories(),
    getDepartments(),
  ]);
  const active = categories.find((c) => c.slug === category);
  const heading = query
    ? `Search: ${query}`
    : active
      ? `${active.department} — ${active.name}`
      : department || "All products";
  return (
    <>
      <Breadcrumb
        department={active?.department || department || undefined}
        current={active?.name || (query ? `Search: ${query}` : "All products")}
      />
      <div className="catalog-layout">
        <aside>
          <form action="/category" className="filters">
            <h2>Department</h2>
            <div className="filter-links">
              {departments.map((d) => (
                <Link
                  key={d.name}
                  href={`/category?department=${encodeURIComponent(d.name)}`}
                  className={d.name === department ? "active" : ""}
                >
                  {d.name}
                  <span>
                    {categories
                      .filter((c) => c.department === d.name)
                      .reduce((sum, c) => sum + c.count, 0)}
                  </span>
                </Link>
              ))}
            </div>
            <h2>Category</h2>
            <div className="filter-links">
              {categories
                .filter((c) => !department || c.department === department)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category?category=${encodeURIComponent(c.slug)}`}
                    className={c.slug === category ? "active" : ""}
                  >
                    {c.name}
                    <span>{c.count}</span>
                  </Link>
                ))}
            </div>
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            {query && <input type="hidden" name="q" value={query} />}
            {department && (
              <input type="hidden" name="department" value={department} />
            )}
            <h2>Price</h2>
            <div className="two-columns">
              <label>
                Minimum
                <input
                  name="min"
                  type="number"
                  min="0"
                  placeholder="Rs 300"
                  defaultValue={value("min")}
                />
              </label>
              <label>
                Maximum
                <input
                  name="max"
                  type="number"
                  min="0"
                  placeholder="Rs 2,500"
                  defaultValue={value("max")}
                />
              </label>
            </div>
            <h2>Availability</h2>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              In stock today
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="sale"
                value="1"
                defaultChecked={sale}
              />
              On sale
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              Cash on delivery only
            </label>
            <h2>Sort products</h2>
            <label>
              Sort by
              <select name="sort" defaultValue={sort}>
                <option value="popular">Most ordered</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
            <button className="button primary full">Apply filters</button>
            <Link className="text-link" href="/category">
              Clear filters
            </Link>
          </form>
          <div className="note">
            <strong>Not sure which one?</strong>
            <p>Call the shop and we’ll tell you if it’s in stock right now.</p>
            <a href="tel:0911110303">091 111 0303</a>
          </div>
        </aside>
        <section>
          <div className="section-title">
            <div>
              <h1>{heading}</h1>
              <p>
                {products.length} items · ships from Shop 41, Karkhano Market
              </p>
            </div>
          </div>
          {products.length ? (
            <div className="product-grid category-grid">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No products found</h2>
              <p>Try a different search or clear your filters.</p>
              <Link className="button primary" href="/category">
                View all products
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
export async function ProductPage({
  detail,
}: {
  detail: ProductDetail;
}) {
  const { product, specs, variants, reviews } = detail;
  let related: Product[] = [];
  try {
    related = await getRelatedProducts(product);
  } catch (error) {
    console.error("Failed to load related products", error);
  }
  return (
    <>
      <Breadcrumb department={product.dept} current={product.title} />
      <section className="product-layout">
        <div className="gallery">
          <div className="gallery-thumbs">
            {["Main photo", "Angle 2", "In use", "Box contents"].map(
              (label) => (
                <div key={label}>
                  <ProductPhoto
                    image={product.image}
                    alt={`${product.title} — ${label}`}
                  />
                </div>
              ),
            )}
          </div>
          <ProductPhoto
            image={product.image}
            alt={product.title}
            className="main-photo"
          />
        </div>
        <div className="product-detail">
          <span className="department">
            <i style={{ background: product.ink }} />
            {product.dept} · {product.category}
          </span>
          <h1>{product.title}</h1>
          {product.rating !== null && (
            <p>
              <span className="stars">
                {starRow(Math.round(product.rating))}
              </span>{" "}
              <small>
                {product.rating}
                {product.orderCount
                  ? ` · ${product.orderCount} orders this month`
                  : ""}
              </small>
            </p>
          )}
          <div className="price-row">
            <strong className="detail-price">{product.price}</strong>
            {product.was && <s>{product.was}</s>}
          </div>
          <small>Price includes GST. Delivery charged separately.</small>
          <ProductControls
            slug={product.slug}
            stock={product.stockCount}
            variants={variants}
          />
        </div>
      </section>
      <section className="section two-columns details-section">
        <div>
          <h2 className="ruled">What you’re getting</h2>
          <p>{product.description ?? product.spec}</p>
          <dl>
            {specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
            <div>
              <dt>Availability</dt>
              <dd>{product.stock}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="ruled">What buyers say</h2>
          {reviews.length ? (
            reviews.map((r) => (
              <article className="review" key={r.id}>
                <span className="stars">{starRow(r.stars)}</span>{" "}
                <strong>
                  {r.author}, {r.location}
                </strong>
                <p>{r.body}</p>
              </article>
            ))
          ) : (
            <p>No reviews yet for this item.</p>
          )}
        </div>
      </section>
      <section className="section">
        <h2 className="ruled">You might also need</h2>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
