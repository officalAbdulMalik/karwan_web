import { notFound } from "next/navigation";
import {
  ProductPage,
  getProductDetail,
  getProductSlugs,
} from "@/features/storefront/server";

export const dynamicParams = true;

export async function generateStaticParams() {
  // The deployment may not have Supabase build variables. With no params,
  // Next.js serves this dynamic route on demand (dynamicParams is true).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return [];
  }

  return (await getProductSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);
  return { title: `${detail?.product.title ?? "Product not found"} | Karvaan` };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await getProductDetail(slug))) notFound();
  return <ProductPage slug={slug} />;
}
