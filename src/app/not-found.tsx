import Link from "next/link";
export default function NotFound() {
  return (
    <section className="empty">
      <h1>We couldn’t find that page</h1>
      <p>Explore the current Karvaan collection.</p>
      <Link className="button primary" href="/category">
        Browse products
      </Link>
    </section>
  );
}
