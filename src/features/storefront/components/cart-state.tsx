"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartProduct } from "../types";
export type CartLine = { slug: string; quantity: number; colour: string };
type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  catalog: CartProduct[];
  find: (slug: string) => CartProduct | undefined;
  add: (slug: string, quantity?: number, colour?: string) => void;
  update: (slug: string, colour: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const sampleSlugs = ["neck-fan", "earbuds"];
export function CartProvider({
  catalog,
  children,
}: {
  catalog: CartProduct[];
  children: ReactNode;
}) {
  const bySlug = useMemo(
    () => new Map(catalog.map((product) => [product.slug, product])),
    [catalog],
  );
  // A sample basket so the cart demo has something in it on a first visit.
  const initialLines = useMemo(
    () =>
      sampleSlugs.flatMap((slug) => {
        const product = bySlug.get(slug);
        return product?.colours.length
          ? [{ slug, quantity: 1, colour: product.colours[0] }]
          : [];
      }),
    [bySlug],
  );
  const [lines, setLines] = useState<CartLine[]>(initialLines);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("karvaan-cart") ?? "null",
      );
      // Restore the browser-only basket, dropping anything the catalogue no
      // longer sells in that colour.
      if (Array.isArray(saved))
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLines(
          saved.filter((line): line is CartLine => {
            if (!line || typeof line !== "object" || !("slug" in line))
              return false;
            const product = bySlug.get(line.slug);
            return (
              !!product &&
              Number.isInteger(line.quantity) &&
              line.quantity > 0 &&
              line.quantity <= product.stockCount &&
              product.colours.includes(line.colour)
            );
          }),
        );
    } catch {
      /* Keep the sample basket if storage is unavailable. */
    }
    setReady(true);
  }, [bySlug]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("karvaan-cart", JSON.stringify(lines));
      } catch {
        /* Basket still works in memory. */
      }
    }
  }, [lines, ready]);
  function add(slug: string, quantity = 1, colour?: string) {
    const product = bySlug.get(slug);
    if (!product) return;
    const chosen = colour ?? product.colours[0];
    if (!product.colours.includes(chosen)) return;
    const limit = product.stockCount;
    setLines((current) =>
      current.some((l) => l.slug === slug && l.colour === chosen)
        ? current.map((l) =>
            l.slug === slug && l.colour === chosen
              ? { ...l, quantity: Math.min(limit, l.quantity + quantity) }
              : l,
          )
        : [
            ...current,
            { slug, colour: chosen, quantity: Math.min(limit, quantity) },
          ],
    );
  }
  function update(slug: string, colour: string, quantity: number) {
    const limit = bySlug.get(slug)?.stockCount ?? 1;
    setLines((current) =>
      current
        .map((l) =>
          l.slug === slug && l.colour === colour
            ? { ...l, quantity: Math.min(limit, quantity) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }
  return (
    <CartContext.Provider
      value={{
        lines,
        ready,
        catalog,
        find: (slug) => bySlug.get(slug),
        add,
        update,
        clear: () => setLines([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("CartProvider is required");
  return cart;
}
