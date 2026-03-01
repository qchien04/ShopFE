export const productsQueryKeys = {
  all: ["products"] as const,

  list: (
    type: string,
    brandId?: number,
    categoryId?: number,
    subCategoryIds?: string,
    brandIds?: string,
    sort?: string,
    minPrice?: number,
    maxPrice?: number
  ) =>
    [
      "products",
      "list",
      type,
      brandId ?? "",
      categoryId ?? "",
      subCategoryIds ?? "",
      brandIds ?? "",
      sort ?? "",
      minPrice ?? 0,
      maxPrice ?? 0,
      
    ] as const,

  detail: (id: number) =>
    ["products", "detail", id] as const,
};