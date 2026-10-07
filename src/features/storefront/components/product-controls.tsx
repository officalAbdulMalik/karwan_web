"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Check } from "lucide-react";
import { useCart } from "./cart-state";
import type { Variant } from "../types";
export function Quantity({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite">
        <span key={value} className="quantity-change">
          {value}
        </span>
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
export function AddToCart({ slug }: { slug: string }) {
  const { add, ready } = useCart();
  const [addCount, setAddCount] = useState(0);
  const added = addCount > 0;
  return (
    <button
      className={`button outline full ${added ? "cart-added" : ""}`}
      disabled={!ready}
      onClick={() => {
        add(slug);
        setAddCount((count) => count + 1);
      }}
    >
      <span aria-live="polite">
        {added ? (
          <>
            <Check key={addCount} className="added-check" size={15} /> Added to
            cart
          </>
        ) : (
          "Add to cart"
        )}
      </span>
    </button>
  );
}
export function ProductControls({
  slug,
  stock,
  variants,
}: {
  slug: string;
  stock: number;
  variants: Variant[];
}) {
  const { add, ready } = useCart();
  const router = useRouter();
  const available = variants.filter((v) => v.available);
  const [colour, setColour] = useState(available[0]?.colour ?? "");
  const [quantity, setQuantity] = useState(1);
  const [addCount, setAddCount] = useState(0);
  const added = addCount > 0;
  const soldOut = stock < 1 || !available.length;
  return (
    <div className="product-controls">
      <fieldset>
        <legend>Colour</legend>
        <div className="row">
          {variants.map((variant) =>
            variant.available ? (
              <button
                key={variant.colour}
                className={`button ${colour === variant.colour ? "selected" : ""}`}
                aria-pressed={colour === variant.colour}
                onClick={() => setColour(variant.colour)}
              >
                {variant.colour}
              </button>
            ) : (
              <button key={variant.colour} className="button" disabled>
                <s>{variant.colour} — out</s>
              </button>
            ),
          )}
        </div>
      </fieldset>
      <div className="purchase-row">
        <Quantity
          value={quantity}
          max={Math.max(stock, 1)}
          onChange={setQuantity}
        />
        <button
          className={`button primary ${added ? "cart-added" : ""}`}
          disabled={!ready || soldOut}
          onClick={() => {
            add(slug, quantity, colour);
            setAddCount((count) => count + 1);
          }}
        >
          <span aria-live="polite">
            {added ? (
              <>
                <Check key={addCount} className="added-check" size={18} /> Added
                to cart
              </>
            ) : (
              "Add to cart"
            )}
          </span>
        </button>
        <button
          className="button outline full buy-now"
          disabled={soldOut}
          onClick={() =>
            router.push(
              `/checkout?${new URLSearchParams({ buy: slug, qty: String(quantity), colour })}`,
            )
          }
        >
          Buy now
        </button>
      </div>
      <p aria-live="polite">
        {added ? "Your basket is ready. View cart to continue." : ""}
      </p>
    </div>
  );
}
