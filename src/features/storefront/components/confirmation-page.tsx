import Link from "next/link";
import { money } from "../format";
import type { Order } from "../types";
import { ProductPhoto } from "./product-card";
export function MissingOrder() {
  return (
    <div className="empty">
      <h1>No order to show</h1>
      <p>
        This confirmation link is missing or has expired. Your cart is still
        saved in this browser.
      </p>
      <Link href="/cart" className="button primary">
        View your cart
      </Link>
    </div>
  );
}
export function ConfirmationPage({ order }: { order: Order }) {
  const placed = new Date(order.createdAt).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const prepaid = order.paymentMethod !== "cod";
  return (
    <>
      <section className="confirmation-banner">
        <div>
          <span className="eyebrow">ORDER {order.orderNumber}</span>
          <h1>Order placed.</h1>
          <p className="urdu" lang="ur" dir="rtl">
            آپ کا آرڈر موصول ہو گیا ہے
          </p>
          <p>
            Thank you <strong>{order.customerName}</strong>. We will confirm on{" "}
            {order.phone}.
          </p>
          <p>
            Placed {placed} · {order.eta}
          </p>
        </div>
        <div className="panel">
          <small>
            {prepaid ? "Total to transfer" : "Keep ready for the rider"}
          </small>
          <strong className="detail-price">{money(order.total)}</strong>
          <small>{order.paymentLabel}</small>
        </div>
      </section>
      <section className="section checkout-layout">
        <div>
          <h2 className="ruled">What happens next</h2>
          <div className="timeline">
            {[
              {
                when: "Now",
                title: "We message you",
                text: "A real person confirms the item and address on WhatsApp.",
              },
              {
                when: "Today",
                title: "We pack it",
                text: "Your items are checked and packed at Shop 41.",
              },
              {
                when: "On the way",
                title: "Track your parcel",
                text: "Your tracking number arrives on WhatsApp.",
              },
              {
                when: "At your door",
                title: prepaid ? "Check your parcel" : "Check, then pay",
                text: prepaid
                  ? "Open the parcel in front of the rider."
                  : "Open the parcel in front of the rider, then pay cash.",
              },
            ].map((step) => (
              <div key={step.when}>
                <small>{step.when}</small>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="panel spaced">
            <h2>Delivery address</h2>
            <p>
              <strong>{order.customerName}</strong>
              <br />
              {order.address}
              <br />
              {order.landmark && (
                <>
                  Near {order.landmark}
                  <br />
                </>
              )}
              {order.city}
              <br />
              {order.phone}
            </p>
            <p className="muted">
              Something wrong? Call the shop on{" "}
              <a href="tel:0911110303">091 111 0303</a> and quote{" "}
              {order.orderNumber}.
            </p>
          </div>
          <Link className="button primary spaced" href="/">
            Keep shopping
          </Link>
        </div>
        <aside className="panel order-summary">
          <h2 className="ruled">Your order</h2>
          {order.items.map((item) => (
            <div className="mini-item" key={item.slug + item.colour}>
              <ProductPhoto image={item.image} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <small>
                  Qty {item.quantity} · {item.colour}
                </small>
              </div>
              <strong>{money(item.unitAmount * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{money(order.subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>{money(order.deliveryFee)}</strong>
          </div>
          <div className="summary-total">
            <strong>Total</strong>
            <strong>{money(order.total)}</strong>
          </div>
        </aside>
      </section>
    </>
  );
}
