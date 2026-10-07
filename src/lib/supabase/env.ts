function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. See .env.example.`);
  }
  return value;
}
export const supabaseUrl = () => required("NEXT_PUBLIC_SUPABASE_URL");
export const supabaseKey = () =>
  required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
