import { CategoryPage } from "@/features/storefront/server";
export const metadata = { title: "Shop products | Karvaan" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CategoryPage params={await searchParams} />;
}
