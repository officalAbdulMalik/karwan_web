"use server";
import { createPublicClient } from "@/lib/supabase/public";

export type PlaceOrderInput = {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  payment: string;
  items: { slug: string; colour: string; quantity: number }[];
};
export type PlaceOrderResult =
  | { ok: true; token: string; orderNumber: string }
  | { ok: false; error: string };

/**
 * Hands the order to place_order, which recomputes every price from the
 * catalogue. Nothing the client sends here is trusted as money.
 */
export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const items = (Array.isArray(input?.items) ? input.items : [])
    .filter((line) => line && typeof line.slug === "string")
    .map((line) => ({
      slug: String(line.slug),
      colour: String(line.colour),
      quantity: Math.trunc(Number(line.quantity)) || 0,
    }));

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_name: String(input?.name ?? ""),
    p_phone: String(input?.phone ?? ""),
    p_address: String(input?.address ?? ""),
    p_landmark: String(input?.landmark ?? ""),
    p_city: String(input?.city ?? ""),
    p_payment: String(input?.payment ?? ""),
    p_items: items,
  });

  if (error) {
    // 22023 is raised by place_order itself, so its message is meant for the
    // shopper. Anything else stays in the server log.
    if (error.code === "22023") return { ok: false, error: error.message };
    console.error("place_order failed", error);
    return {
      ok: false,
      error: "We could not place your order just now. Please try again.",
    };
  }

  const result = data as { order_number?: string; access_token?: string } | null;
  if (!result?.access_token || !result?.order_number) {
    return {
      ok: false,
      error: "We could not place your order just now. Please try again.",
    };
  }
  return {
    ok: true,
    token: result.access_token,
    orderNumber: result.order_number,
  };
}
