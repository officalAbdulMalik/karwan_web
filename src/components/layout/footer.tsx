import Link from "next/link";
export function Footer() {
  return (
    <footer>
      <div>
        <Link href="/" className="brand">
          Karvaan
        </Link>
        <p>
          Shop 41, Karkhano Market, Peshawar, Khyber Pakhtunkhwa. Ships
          nationwide by TCS and Leopards.
        </p>
        <a href="tel:0911110303">
          <strong>091 111 0303</strong>
        </a>
        <p className="urdu" lang="ur" dir="rtl">
          پارسل کھول کر دیکھیں، پھر رائیڈر کو پیسے دیں
        </p>
      </div>
      <div>
        <h2>Delivery</h2>
        <Link href="/help#delivery">Delivery charges by city</Link>
        <Link href="/help#payment">How cash on delivery works</Link>
        <Link href="/help#tracking">Track my order</Link>
      </div>
      <div>
        <h2>Policies</h2>
        <Link href="/help#returns">Returns and replacement</Link>
        <Link href="/help#returns">Refused parcel policy</Link>
        <Link href="/help#returns">Warranty terms</Link>
      </div>
      <div>
        <h2>Shop</h2>
        {["Electronics", "Electrical", "Stationery"].map((dept) => (
          <Link key={dept} href={`/category?department=${dept}`}>
            {dept}
          </Link>
        ))}
        <Link href="/category?max=1000">Under Rs 1,000</Link>
      </div>
    </footer>
  );
}
