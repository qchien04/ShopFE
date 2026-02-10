export const productsQueryKeys = {
  all: ["products"] as const,

  lists: () => [...productsQueryKeys.all, "list"] as const,

  list: (type: string, params?: any) =>
    [...productsQueryKeys.lists(), type, params] as const,

  detail: (id: number) =>
    [...productsQueryKeys.all, "detail", id] as const,
}