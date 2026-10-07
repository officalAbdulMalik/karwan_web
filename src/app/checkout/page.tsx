import {
  CheckoutPage,
  getCartCatalog,
  getCheckoutOptions,
} from "@/features/storefront/server";
export const metadata = { title: "Checkout | Karvaan" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    buy?: string;
    qty?: string;
    colour?: string;
  }>;
}) {
  const [{ city, buy, qty, colour }, { zones, methods }, catalog] =
    await Promise.all([searchParams, getCheckoutOptions(), getCartCatalog()]);

  // Buy now: one product straight to checkout, bypassing the saved basket.
  const product = catalog.find((p) => p.slug === buy);
  const quantity = Number(qty);
  const buyNow =
    product && product.colours.length
      ? {
          slug: product.slug,
          quantity: Number.isInteger(quantity)
            ? Math.min(Math.max(quantity, 1), product.stockCount)
            : 1,
          colour:
            colour && product.colours.includes(colour)
              ? colour
              : product.colours[0],
        }
      : undefined;

  const initialCity = zones.some((zone) => zone.city === city)
    ? city
    : zones[0]?.city;

  return (
    <CheckoutPage
      initialCity={initialCity}
      buyNow={buyNow}
      zones={zones}
      methods={methods}
    />
  );
}
