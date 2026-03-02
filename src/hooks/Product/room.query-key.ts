import type { ParamSearch } from "./useProductList";

export const productsQueryKeys = {
  all: ["products"] as const,

  list: (param:ParamSearch) =>
    [
      "products",
      "list",
      param
      
    ] as const,

  detail: (id: number) =>
    ["products", "detail", id] as const,
};