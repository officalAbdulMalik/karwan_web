/** Stock at or below this reads as "N left" rather than "N in stock". */
export const LOW_STOCK_AT = 10;
export const money = (amount: number) => `Rs ${amount.toLocaleString("en-PK")}`;
export const stockLabel = (count: number) =>
  count <= LOW_STOCK_AT ? `${count} left` : `${count} in stock`;
export const starRow = (stars: number) =>
  "★".repeat(stars) + "☆".repeat(5 - stars);
