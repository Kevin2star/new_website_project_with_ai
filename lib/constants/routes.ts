// 라우트 상수

export const routes = {
  home: "/",
  login: "/login",
  products: "/products",
  newProduct: "/products/new",
  product: (id: string) => `/products/${encodeURIComponent(id)}`,
  inquiry: (productId: string) => `/inquiry?product=${encodeURIComponent(productId)}`,
  myPage: "/my-page",
} as const;
