// Server-only entry point: data access and the server-rendered page bodies.
export {
  getCartCatalog,
  getCategories,
  getCheckoutOptions,
  getDepartments,
  getHomePage,
  getProductDetail,
  getProductSlugs,
  getRelatedProducts,
  searchProducts,
  type CatalogFilters,
} from "./queries";
export { getOrderByToken } from "./orders";
export {
  HomePage,
  CategoryPage,
  ProductPage,
} from "./components/catalog-pages";
export { CartPage, CheckoutPage } from "./components/checkout-pages";
export { ConfirmationPage, MissingOrder } from "./components/confirmation-page";
