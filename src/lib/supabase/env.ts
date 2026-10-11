function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. See .env.example.`);
  }
  return value;
}
export const supabaseUrl = () => required("SUPABASE_URL");
export const supabaseKey = () =>
  required("SUPABASE_PUBLISHABLE_KEY");
