import { notFound } from "next/navigation";
import {
  ProductPage,
  getProductDetail,
  getProductSlugs,
} from "@/features/storefront/server";
export async function generateStaticParams() {
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
