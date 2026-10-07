// Client-safe entry point. Anything that touches the server Supabase client
// (and so `next/headers`) belongs in ./server, never here — a client component
// importing this barrel would otherwise pull it into the browser bundle.
export { CartProvider, useCart, type CartLine } from "./components/cart-state";
export { LOW_STOCK_AT, money, starRow, stockLabel } from "./format";
export type * from "./types";
