import Link from "next/link";
import Image from "next/image";
import type { Product } from "../types";
import { AddToCart } from "./product-controls";
export function ProductPhoto({
  image,
  alt,
  className = "",
}: {
  image: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`product-photo ${className}`}>
      <Image
        src={
          image.startsWith("http") ? image : `/images/products/${image}.webp`
        }
        alt={alt}
        fill
        sizes={
          className.includes("main-photo")
            ? "(max-width: 600px) 100vw, 50vw"
            : "(max-width: 600px) 45vw, (max-width: 1150px) 30vw, 20vw"
        }
      />
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        className="product-image"
        href={`/product/${product.slug}`}
        aria-label={`View ${product.title}`}
      >
        <ProductPhoto image={product.image} alt={product.title} />
      </Link>
      <div className="product-body">
        <span className="department">
          <i style={{ background: product.ink }} />
          {product.dept}
        </span>
        <Link className="product-title" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <p className="spec-line">{product.spec}</p>
        <div className="price-row">
          <strong className="price">{product.price}</strong>
          {product.was && <s>{product.was}</s>}
        </div>
        <p className="stock">Cash on delivery · {product.stock}</p>
        <AddToCart slug={product.slug} />
      </div>
    </article>
  );
}
