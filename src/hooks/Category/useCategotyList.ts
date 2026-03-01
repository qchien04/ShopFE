// src/hooks/useRoomList.ts
import { useQuery } from "@tanstack/react-query"
import { categoryQueryKeys } from "./category.query-key"
import { categoryApi } from "../../api/categories.api"
import type { Category } from "../../types/categories.type"
import type { CategoryFilterResponse } from "../../types/response.type"


export const useCategoryList = <T = Category[]>() => {
  return useQuery<T>({
    queryKey: categoryQueryKeys.lists(),
    queryFn: () => { 
      return categoryApi.getAll() as T
    }
  })
}

export const useCategoryParentList = <T = Category[]>() => {
  return useQuery<T>({
    queryKey: categoryQueryKeys.listParent(),
    queryFn: () => { 
      return categoryApi.getAllParent() as T
    }
  })
}

export const useCategoryFilter = <T = CategoryFilterResponse>(id:number) => {
  return useQuery<T>({
    queryKey: categoryQueryKeys.listFilter(id),
    queryFn: () => { 
      return categoryApi.getFilter(id) as T
    }
  })
}