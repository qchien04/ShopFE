// src/hooks/useRoomList.ts
import { useQuery } from "@tanstack/react-query"
import { productsQueryKeys } from "./room.query-key"
import { productApi } from "../../api/product.api"
import type { Product } from "../../types/product.type"

export type ProductListType =
  | "all"
  | "category"
  | "brand"
  | "featured"
  | "new"
  | "search"


interface UseProductListOptions {
  type?: ProductListType
  params?: Record<string, any>
}

export const useProductList = <T = Product[]>({
  type = "all",
  params,
}: UseProductListOptions = {}) => {
  return useQuery<T>({
    queryKey: productsQueryKeys.list(type, params),
    queryFn: () => {
      switch (type) {
        case "category":
          return productApi.getByCategory(params?.category) as T

        case "brand":
          return productApi.getByBrand(params?.brand) as T

        case "featured":
          return productApi.getFeaturedProducts() as T
          
        case "new":
          return productApi.getNew(params?.categoryId) as T

        case "search":
          return productApi.getByKeyword(params?.keyword) as T

        default:
          return productApi.getAll() as T
      }
    },
   enabled: (() => {
      switch (type) {
        case "all":
        case "featured":
        case "new":
          return true

        case "category":
          return Boolean(params?.category)

        case "brand":
          return Boolean(params?.brand)

        case "search":
          return Boolean(params?.keyword)

        default:
          return false
      }
    })(),
  })
}

export const useProductsByIds = (ids: number[]) => {
  return useQuery({
    queryKey: ["products", ids],
    queryFn: () => productApi.getByIds(ids),
    enabled: ids.length > 0,
  });
};