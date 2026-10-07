export type Product = {
  slug: string;
  title: string;
  spec: string;
  description: string | null;
  dept: string;
  ink: string;
  category: string;
  categorySlug: string;
  image: string;
  amount: number;
  stockCount: number;
  trendRank: number | null;
  rating: number | null;
  orderCount: number | null;
  /** Presentation strings derived once, server side. */
  price: string;
  was: string | null;
  saveLabel: string | null;
  stock: string;
  lowStock: boolean;
};
/** The slice of a product the client-side basket needs. */
export type CartProduct = {
  slug: string;
  title: string;
  spec: string;
  image: string;
  amount: number;
  price: string;
  stockCount: number;
  colours: string[];
};
export type Category = {
  name: string;
  slug: string;
  image: string;
  ink: string;
  department: string;
  count: number;
};
export type Department = { name: string; ink: string };
export type Spec = { label: string; value: string };
export type Variant = { colour: string; available: boolean };
export type Review = {
  id: number;
  author: string;
  location: string;
  stars: number;
  body: string;
};
export type ProductDetail = {
  product: Product;
  specs: Spec[];
  variants: Variant[];
  reviews: Review[];
};
export type DeliveryZone = {
  city: string;
  urduLabel: string;
  fee: number;
  eta: string;
};
export type PaymentMethod = {
  code: string;
  label: string;
  urduLabel: string;
  blurb: string;
  urduBlurb: string | null;
  discount: number;
};
export type OrderItem = {
  slug: string;
  title: string;
  image: string;
  colour: string;
  unitAmount: number;
  quantity: number;
};
export type Order = {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  landmark: string | null;
  city: string;
  paymentMethod: string;
  paymentLabel: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  createdAt: string;
  eta: string;
  items: OrderItem[];
};
