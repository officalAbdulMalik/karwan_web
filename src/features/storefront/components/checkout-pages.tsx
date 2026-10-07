"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCart, type CartLine } from "./cart-state";
import { money } from "../format";
import { placeOrder } from "../actions";
import type { DeliveryZone, PaymentMethod } from "../types";
import { ProductPhoto } from "./product-card";
import { Quantity, AddToCart } from "./product-controls";
function Bilingual({ english, urdu }: { english: string; urdu: string }) {
  return (
    <span className="checkout-bilingual">
      <span>{english}</span>
      <span lang="ur" dir="rtl">
        {urdu}
      </span>
    </span>
  );
}
function useBasket(buyNow?: CartLine) {
  const cart = useCart();
  // Buy now checks out a single product without touching the saved cart.
  const lines = buyNow ? [buyNow] : cart.lines;
  const items = lines.flatMap((line) => {
    const product = cart.find(line.slug);
    return product ? [{ ...line, product }] : [];
  });
  return {
    ...cart,
    items,
    subtotal: items.reduce(
      (sum, item) => sum + item.product.amount * item.quantity,
      0,
    ),
  };
}
function EmptyBasket() {
  return (
    <div className="empty">
      <h1>Your cart is empty</h1>
      <p>Find something useful for your day.</p>
      <Link className="button primary" href="/category">
        Browse products
      </Link>
    </div>
  );
}
function Summary({
  subtotal,
  delivery,
  prepaid = false,
}: {
  subtotal: number;
  delivery: number;
  prepaid?: boolean;
}) {
  return (
    <>
      <div className="summary-row">
        <Bilingual english="Subtotal" urdu="اشیاء کی قیمت" />
        <strong>{money(subtotal)}</strong>
      </div>
      <div className="summary-row">
        <Bilingual english="Delivery" urdu="ڈیلیوری کا خرچ" />
        <strong>{money(delivery)}</strong>
      </div>
      <div className="summary-total">
        <div>
          <strong>
            <Bilingual
              english={prepaid ? "Total to transfer" : "Pay the rider"}
              urdu={prepaid ? "کل قابلِ ادائیگی رقم" : "رائیڈر کو ادا کریں"}
            />
          </strong>
          <small>
            {prepaid ? "Bank transfer or Easypaisa" : "Cash, on delivery"}
          </small>
        </div>
        <strong>{money(subtotal + delivery)}</strong>
      </div>
    </>
  );
}
export function CartPage({
  zones,
  addOnSlugs,
}: {
  zones: DeliveryZone[];
  addOnSlugs: string[];
}) {
  const { items, subtotal, update, ready, find } = useBasket();
  const [city, setCity] = useState(zones[0]?.city ?? "");
  const delivery = zones.find((z) => z.city === city)?.fee ?? 0;
  const addOns = addOnSlugs.flatMap((slug) => find(slug) ?? []);
  if (!ready)
    return (
      <div className="empty" role="status">
        Loading your basket…
      </div>
    );
  if (!items.length) return <EmptyBasket />;
  return (
    <section className="section">
      <div className="section-title">
        <div>
          <h1>Your cart</h1>
          <p>
            {items.reduce((sum, i) => sum + i.quantity, 0)} items · nothing
            charged yet
          </p>
        </div>
        <Link className="back-shop" href="/">
          <ArrowLeft size={16} />
          Keep shopping
        </Link>
      </div>
      <div className="checkout-layout">
        <div>
          <div className="cart-table">
            <div className="cart-table-heading">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {items.map((item) => (
              <article className="cart-item" key={item.slug + item.colour}>
                <Link href={`/product/${item.slug}`} className="cart-product">
                  <ProductPhoto
                    image={item.product.image}
                    alt={item.product.title}
                  />
                  <div>
                    <h2>{item.product.title}</h2>
                    <p>{item.product.spec}</p>
                    <small>Colour: {item.colour}</small>
                    <p className="stock">In stock · ready to dispatch</p>
                  </div>
                </Link>
                <Quantity
                  value={item.quantity}
                  max={item.product.stockCount}
                  onChange={(value) => update(item.slug, item.colour, value)}
                />
                <div className="cart-line-total">
                  <strong>{money(item.quantity * item.product.amount)}</strong>
                  <button
                    className="remove"
                    aria-label={`Remove ${item.product.title}, ${item.colour}`}
                    onClick={() => update(item.slug, item.colour, 0)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="note">
            <ShieldCheck size={22} />
            <div>
              <strong>Check your parcel before you pay</strong>
              <p>
                Cash on delivery across Pakistan. 7-day replacement on faulty
                items.
              </p>
            </div>
          </div>
          <h2 className="ruled spaced">Add something useful</h2>
          <div className="add-ons">
            {addOns.map((p) => (
              <article key={p.slug}>
                <ProductPhoto image={p.image} alt={p.title} />
                <h3>{p.title}</h3>
                <strong>{p.price}</strong>
                <AddToCart slug={p.slug} />
              </article>
            ))}
          </div>
        </div>
        <aside className="panel order-summary">
          <h2 className="ruled">Order summary</h2>
          <label>
            Delivery city
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {zones.map((zone) => (
                <option key={zone.city} value={zone.city}>
                  {zone.city}
                </option>
              ))}
            </select>
          </label>
          <Summary subtotal={subtotal} delivery={delivery} />
          <Link
            className="button primary full"
            href={`/checkout?city=${encodeURIComponent(city)}`}
          >
            Proceed to checkout
          </Link>
          <p className="muted">
            No account needed. Pay cash when your parcel arrives.
          </p>
        </aside>
      </div>
    </section>
  );
}
export function CheckoutPage({
  initialCity,
  buyNow,
  zones,
  methods,
}: {
  initialCity?: string;
  buyNow?: CartLine;
  zones: DeliveryZone[];
  methods: PaymentMethod[];
}) {
  const { items, subtotal, ready, clear } = useBasket(buyNow);
  const router = useRouter();
  const [city, setCity] = useState(initialCity ?? zones[0]?.city ?? "");
  const [payment, setPayment] = useState(methods[0]?.code ?? "cod");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const zone = zones.find((z) => z.city === city);
  const method = methods.find((m) => m.code === payment);
  const prepaid = (method?.discount ?? 0) > 0;
  // Mirrors place_order; the figure charged is the one the database computes.
  const delivery = Math.max((zone?.fee ?? 0) - (method?.discount ?? 0), 0);
  // Distinct delivery tiers, so the panel follows the delivery_zones table.
  const tiers = [...new Map(zones.map((z) => [z.fee, z])).values()];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await placeOrder({
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      landmark: String(form.get("landmark") ?? ""),
      city,
      payment,
      items: items.map((item) => ({
        slug: item.slug,
        colour: item.colour,
        quantity: item.quantity,
      })),
    });
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    // The saved basket has been ordered, so it should not survive the trip.
    if (!buyNow) clear();
    router.push(`/order-confirmation?ref=${result.token}`);
  }
  if (!ready)
    return (
      <div className="empty" role="status">
        <Bilingual english="Loading checkout…" urdu="آرڈر فارم کھل رہا ہے۔۔۔" />
      </div>
    );
  if (!items.length) return <EmptyBasket />;
  return (
    <form className="section checkout-surface" onSubmit={submit}>
      <div className="checkout-layout">
        <div className="stack">
          <section className="panel">
            <h1>
              <Bilingual
                english="Where should we send it?"
                urdu="آپ کا پارسل کہاں بھیجیں؟"
              />
            </h1>
            <p className="muted">
              <Bilingual
                english="No account needed. Fill in your delivery details below."
                urdu="اکاؤنٹ بنانے کی ضرورت نہیں۔ نیچے اپنی تفصیلات درج کریں۔"
              />
            </p>
            <div className="form-grid">
              <label>
                <Bilingual english="Full name" urdu="پورا نام" />
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="مثلاً عمران خٹک / Imran Khattak"
                  dir="auto"
                  required
                  maxLength={100}
                />
              </label>
              <label>
                <Bilingual english="WhatsApp number" urdu="واٹس ایپ نمبر" />
                <input
                  name="phone"
                  type="tel"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0312 4567890"
                  pattern="[+0-9 ()-]{10,18}"
                  required
                  aria-describedby="phone-hint"
                />
                <small id="phone-hint">
                  <Bilingual
                    english="Use a Pakistani mobile number, e.g. 0312 4567890."
                    urdu="اپنا پاکستانی موبائل نمبر لکھیں۔ اسی نمبر پر آرڈر کی تصدیق ہوگی۔"
                  />
                </small>
              </label>
              <label>
                <Bilingual english="City" urdu="شہر" />
                <select
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {zones.map((zone) => (
                    <option key={zone.city} value={zone.city}>
                      {zone.city} — {zone.urduLabel}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <Bilingual
                  english="Nearest landmark (optional)"
                  urdu="قریبی مشہور جگہ (اختیاری)"
                />
                <input
                  name="landmark"
                  placeholder="مثلاً گل حاجی پلازہ کے سامنے"
                  dir="auto"
                  maxLength={200}
                />
              </label>
              <label className="span-all">
                <Bilingual english="Full address" urdu="مکمل پتہ" />
                <textarea
                  name="address"
                  autoComplete="street-address"
                  placeholder="مکان نمبر، گلی، علاقہ اور شہر / House, street, area and city"
                  dir="auto"
                  required
                  minLength={10}
                  maxLength={500}
                />
              </label>
            </div>
          </section>
          <section className="panel">
            <h2>
              <Bilingual
                english="How do you want to pay?"
                urdu="آپ ادائیگی کیسے کریں گے؟"
              />
            </h2>
            {methods.map((option) => (
              <label
                key={option.code}
                className={`payment-option ${payment === option.code ? "chosen" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={option.code}
                  checked={payment === option.code}
                  onChange={() => setPayment(option.code)}
                />
                <span>
                  <strong>
                    <Bilingual
                      english={option.label}
                      urdu={option.urduLabel}
                    />
                  </strong>
                  {option.urduBlurb ? (
                    <>
                      <small>{option.blurb}</small>
                      <span className="urdu" lang="ur" dir="rtl">
                        {option.urduBlurb}
                      </span>
                    </>
                  ) : (
                    <small>{option.blurb}</small>
                  )}
                </span>
                {option.discount > 0 && (
                  <strong className="stock">
                    Save {money(option.discount)}
                  </strong>
                )}
              </label>
            ))}
          </section>
          <section className="panel">
            <h2>
              <Bilingual english="Delivery" urdu="پارسل کی ترسیل" />
            </h2>
            <div className="two-columns spaced">
              {tiers.map((tier) => (
                <div key={tier.fee}>
                  <strong>{money(tier.fee)} delivery</strong>
                  <p>{tier.eta}</p>
                  <small>
                    {zones
                      .filter((z) => z.fee === tier.fee)
                      .map((z) => z.city)
                      .join(" · ")}
                  </small>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="panel order-summary">
            <h2 className="ruled">
              <Bilingual english="Your order" urdu="آپ کا آرڈر" />
            </h2>
            {items.map((item) => (
              <div className="mini-item" key={item.slug + item.colour}>
                <ProductPhoto
                  image={item.product.image}
                  alt={item.product.title}
                />
                <div>
                  <strong>{item.product.title}</strong>
                  <small>
                    {item.colour} · Qty {item.quantity}
                  </small>
                </div>
                <strong>{money(item.product.amount * item.quantity)}</strong>
              </div>
            ))}
            <Summary
              subtotal={subtotal}
              delivery={delivery}
              prepaid={prepaid}
            />
            <button className="button primary full" disabled={pending}>
              <Bilingual
                english={pending ? "Placing your order…" : "Place order"}
                urdu={pending ? "آرڈر بھیجا جا رہا ہے۔۔۔" : "آرڈر دیں"}
              />
            </button>
            <p className="muted">
              <Bilingual
                english="Your order is saved and confirmed on WhatsApp. No payment is taken on this page."
                urdu="آپ کا آرڈر محفوظ ہو جائے گا اور واٹس ایپ پر تصدیق ہوگی۔ اس صفحے پر ادائیگی نہیں لی جاتی۔"
              />
            </p>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
          </section>
          <div className="note">
            <strong>
              <Bilingual
                english="7-day replacement on faulty items"
                urdu="خراب چیز ۷ دن کے اندر تبدیل کروائیں"
              />
            </strong>
            <p>
              Refuse the parcel at the door and you pay nothing. Repeated
              refusals may block COD on future orders.
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
