// src/hooks/useRoomDetail.ts
import { useQuery } from "@tanstack/react-query"
import { categoryQueryKeys } from "./category.query-key"
import { categoryApi } from "../../api/categories.api"
import type { Category } from "../../types/categories.type"

export const useCategoryDetail = <T = Category>(id?: number) => {
  return useQuery<T>({
    queryKey: id ? categoryQueryKeys.detail(id) : [],
    queryFn: () => {
      if (!id) throw new Error("Product id is required")
      return categoryApi.getById(id) as T
    },
    enabled: !!id,
  })
}
