import { CartPage, getCheckoutOptions } from "@/features/storefront/server";
export const metadata = { title: "Your cart | Karvaan" };
/** Cheap extras offered under the basket. */
const addOnSlugs = ["geometry-set", "wall-switch", "registers"];
export default async function Page() {
  const { zones } = await getCheckoutOptions();
  return <CartPage zones={zones} addOnSlugs={addOnSlugs} />;
}
