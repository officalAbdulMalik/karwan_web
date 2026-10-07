# Karvaan storefront

Responsive Next.js App Router and TypeScript UI converted from the supplied Karvaan Storefront HTML. The latest home, category, product, cart, checkout, and order confirmation designs are implemented, with responsive mobile navigation.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Pages

- `/`: home and product categories
- `/category`: catalog; search, category, department, price, sale and sort filters use query parameters
- `/product/neck-fan`: product detail (all fixture products have detail routes)
- `/cart`: quantities, removal, delivery estimate, and add-ons
- `/checkout`: delivery form and payment selection
- `/order-confirmation`: confirmation of the latest demo checkout
- `/help`: delivery, replacement and contact information

## Frontend data

`src/features/storefront/catalog.ts` contains the source design's fixture products. Sample product photographs are stored locally in `public/images/products`; their source URLs are recorded in `sources.json`. These illustrative demo photos do not represent exact inventory. Product grids show five compact cards per row on desktop and adapt to three or two columns on smaller screens. The accent is the source editor's default orange; typography uses Archivo and Noto Nastaliq Urdu through next/font.

The cart begins with the source's two sample items and persists in localStorage. Demo checkout saves the preview in sessionStorage. No backend requests, real orders, payments, or messages are sent. Clear site storage to reset the demo. Product and catalog pages are server-rendered; interactive cart and checkout components are client components.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm run build
```
