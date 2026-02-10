// src/hooks/useRoomList.ts
import { useQuery } from "@tanstack/react-query"
import { categoryQueryKeys } from "./category.query-key"
import { categoryApi } from "../../api/categories.api"
import type { Category } from "../../types/categories.type"


export const useCategoryList = <T = Category[]>() => {
  return useQuery<T>({
    queryKey: categoryQueryKeys.lists(),
    queryFn: () => { 
      return categoryApi.getAll() as T
    }
  })
}