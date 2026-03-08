// src/hooks/useRoomList.ts
import { useQuery } from "@tanstack/react-query"
import { productsQueryKeys } from "./room.query-key"
import { productApi } from "../../api/product.api"
import type { Product } from "../../types/product.type"
import type { PageResponse } from "../../types/response.type"

export type ProductListType =
  | "all"
  | "category"
  | "brand"
  | "featured"
  | "new"
  | "search"

export type ParamSearch={
  type:ProductListType,
  keyword?:string|null,
  page?: number,
  size?: number,
  minPrice?: number,
  maxPrice?: number,
  brandIds?: number[]|null,
  mainCategoryId?:number,
  subCategoryIds?:number[]|null,
  sort?: string,
  inStock?: boolean,
}

export const useProductList = <T = PageResponse<Product>>(params: ParamSearch = {type:"all"}) => {
  return useQuery<T>({
    queryKey: productsQueryKeys.list(params),
    queryFn: () => {
      switch (params.type) {
        case "category":
          return productApi.getByCategory(params) as T

        case "brand":
          return productApi.getByBrand(params) as T

        case "featured":
          return productApi.getFeaturedProducts() as T
          
        case "new":
          return productApi.getNew(params.mainCategoryId||1) as T

        case "search":
          return productApi.getByKeyword(params) as T

        default:
          return productApi.getAll(params) as T
      }
    },
   enabled: (() => {
      switch (params.type) {
        case "all":
        case "featured":
        case "new":
          return true

        case "category":
          return Boolean(params?.mainCategoryId)

        case "brand":
          return Boolean(params?.brandIds?.length==1)

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

export const useProductVariantsByIds = (ids: number[]) => {
  return useQuery({
    queryKey: ["products", ids],
    queryFn: () => productApi.getVariantByIds(ids),
    enabled: ids.length > 0,
  });
};