// src/hooks/useRoomDetail.ts
import { useQuery } from "@tanstack/react-query"
import type { Product } from "../../types/product.type"
import { productApi } from "../../api/product.api"
import { productsQueryKeys } from "./room.query-key"

export const useProductDetail = <T = Product>(id?: number) => {
  return useQuery<T>({
    queryKey: id ? productsQueryKeys.detail(id) : [],
    queryFn: () => {
      if (!id) throw new Error("Product id is required")
      return productApi.getById(id) as T
    },
    enabled: !!id,
  })
}
