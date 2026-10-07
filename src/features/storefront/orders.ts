import { createPublicClient } from "@/lib/supabase/public";
import type { Order, OrderItem } from "./types";

const text = (value: unknown) => (typeof value === "string" ? value : "");
const count = (value: unknown) => (typeof value === "number" ? value : 0);

function toItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    return [
      {
        slug: text(item.slug),
        title: text(item.title),
        image: text(item.image_slug),
        colour: text(item.colour),
        unitAmount: count(item.unit_amount),
        quantity: count(item.quantity),
      },
    ];
  });
}

/**
 * Reads one order back by the token handed out at checkout. The orders table
 * denies every direct read, so this goes through the get_order function.
 */
export async function getOrderByToken(token: string): Promise<Order | null> {
  if (!/^[0-9a-f]{32}$/.test(token)) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_order", { p_token: token });
  if (error) throw error;
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const row = data as Record<string, unknown>;
  if (!text(row.order_number)) return null;
  return {
    orderNumber: text(row.order_number),
    customerName: text(row.customer_name),
    phone: text(row.phone),
    address: text(row.address),
    landmark: typeof row.landmark === "string" ? row.landmark : null,
    city: text(row.city),
    paymentMethod: text(row.payment_method),
    paymentLabel: text(row.payment_label),
    subtotal: count(row.subtotal),
    deliveryFee: count(row.delivery_fee),
    total: count(row.total),
    status: text(row.status),
    createdAt: text(row.created_at),
    eta: text(row.eta),
    items: toItems(row.items),
  };
}
