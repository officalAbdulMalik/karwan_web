export const metadata = { title: "Delivery and help | Karvaan" };
export default function Page() {
  return (
    <section className="section help-page">
      <h1>Delivery & help</h1>
      <section id="delivery">
        <h2>Delivery charges by city</h2>
        <p>
          Peshawar city: Rs 150, arriving in 1–2 days with our own rider. Rest
          of Pakistan: Rs 250, arriving in 2–4 days by TCS or Leopards.
        </p>
      </section>
      <section id="payment">
        <h2>Cash on delivery</h2>
        <p>
          Check the parcel in front of the rider, then hand over the cash. Bank
          transfer or Easypaisa saves Rs 100 on delivery.
        </p>
      </section>
      <section id="returns">
        <h2>Returns and replacement</h2>
        <p>
          7-day replacement on faulty items. Refuse the parcel at the door and
          you pay nothing. Repeated refusals may block COD on future orders.
        </p>
      </section>
      <section id="tracking">
        <h2>Track my order</h2>
        <p>
          Order tracking will be available when the backend is connected. Demo
          orders do not create shipments.
        </p>
      </section>
      <section>
        <h2>Visit the shop</h2>
        <p>
          Shop 41, Karkhano Market, Peshawar · 10am to 9pm, Monday to Saturday.
        </p>
        <a className="text-link" href="tel:0911110303">
          Call 091 111 0303
        </a>
      </section>
    </section>
  );
}
