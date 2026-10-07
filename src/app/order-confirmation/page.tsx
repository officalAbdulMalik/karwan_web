import {
  ConfirmationPage,
  MissingOrder,
  getOrderByToken,
} from "@/features/storefront/server";
export const metadata = { title: "Order confirmed | Karvaan" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const order = ref ? await getOrderByToken(ref) : null;
  return order ? <ConfirmationPage order={order} /> : <MissingOrder />;
}
