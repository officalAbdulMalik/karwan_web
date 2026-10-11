import { notFound } from "next/navigation";
import { cache } from "react";
import {
  ProductPage,
  getProductDetail,
} from "@/features/storefront/server";

const getCachedProductDetail = cache(getProductDetail);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getCachedProductDetail(slug);
  return { title: `${detail?.product.title ?? "Product not found"} | Karvaan` };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getCachedProductDetail(slug);
  if (!detail) notFound();
  return <ProductPage detail={detail} />;
}
