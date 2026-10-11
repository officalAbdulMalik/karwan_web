function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. See .env.example.`);
  }
  return value;
}
export const supabaseUrl = () => {
  const value = required("SUPABASE_URL");
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return value;
  } catch {
    // Fall through to a value-free error so configuration mistakes are clear
    // without exposing environment values in logs.
  }
  throw new Error(
    "Invalid environment variable SUPABASE_URL. Set it to the Supabase project URL (for example https://<project-ref>.supabase.co), not an API key.",
  );
};
export const supabaseKey = () =>
  required("SUPABASE_PUBLISHABLE_KEY");
