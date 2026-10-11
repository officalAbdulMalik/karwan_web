import type { Metadata } from "next";
import { connection } from "next/server";
import { Archivo, Noto_Nastaliq_Urdu } from "next/font/google";
import { CartProvider } from "@/features/storefront";
import { getCartCatalog } from "@/features/storefront/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MotionSurface } from "@/components/ui/motion-surface";
import "./globals.css";
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const urdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: "400",
});
// Prices and stock come from Supabase and are baked into the prerendered
// pages, so re-render them at most once a minute rather than only at build.
export const revalidate = 60;
export const metadata: Metadata = {
  title: "Karvaan | Everyday essentials, delivered",
  description:
    "Shop electronics, electrical essentials and stationery from Karvaan, Karkhano Market, Peshawar.",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Supabase credentials may only be available at runtime on the host.
  // Keep this request-time query out of the build prerender pass.
  await connection();

  // The basket lives in the browser but needs titles, prices, stock and
  // colours from the catalogue, so they are handed to it from the server.
  const catalog = await getCartCatalog();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${urdu.variable}`}
    >
      <body>
        <CartProvider catalog={catalog}>
          <div className="site-shell">
            <Header />
            <main id="main">
              <MotionSurface>{children}</MotionSurface>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
