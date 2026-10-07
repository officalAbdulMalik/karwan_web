"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Home, Grid2X2, Package, ArrowLeft } from "lucide-react";
import { useCart } from "@/features/storefront";
export function Header() {
  const pathname = usePathname();
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const checkout = ["/checkout", "/order-confirmation"].includes(pathname);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header>
        <div className="contact-bar">
          <a href="tel:0911110303">
            {checkout ? "Stuck? " : ""}Call 091 111 0303
          </a>
          <span>
            {checkout
              ? "We never ask for your card or CNIC"
              : "Cash on delivery all over Pakistan"}
          </span>
          <span lang="ur" dir="rtl">
            کیش آن ڈیلیوری دستیاب ہے
          </span>
        </div>
        {checkout ? (
          <div className="checkout-header">
            <Link className="brand" href="/">
              Karvaan
            </Link>
            <div className="steps">
              <span className="step">
                {pathname === "/checkout" ? "1" : "✓"}
              </span>
              Your details <span className="step-line" />
              <span className="step">2</span>Confirmation
            </div>
            <Link href="/" className="back-shop">
              <ArrowLeft size={16} /> Back to shop
            </Link>
          </div>
        ) : (
          <div className="masthead">
            <Link className="brand" href="/">
              Karvaan
            </Link>
            <form action="/category" className="search">
              <label className="sr-only" htmlFor="search">
                Search products
              </label>
              <input
                id="search"
                name="q"
                type="search"
                placeholder="Search neck fan, 12W bulb, earbuds"
              />
              <button type="submit">Search</button>
            </form>
            <Link className="track-link" href="/help#tracking">
              Track my order
            </Link>
            <Link
              className="cart-link"
              href="/cart"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingCart size={34} />
              <span key={count} className="cart-count cart-count-pop">
                {count}
              </span>
            </Link>
          </div>
        )}
      </header>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[
          { href: "/", text: "Home", icon: Home },
          { href: "/category", text: "Categories", icon: Grid2X2 },
          { href: "/cart", text: `Cart (${count})`, icon: ShoppingCart },
          { href: "/help", text: "Help", icon: Package },
        ].map(({ href, text, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={21} />
            {text}
          </Link>
        ))}
      </nav>
    </>
  );
}
