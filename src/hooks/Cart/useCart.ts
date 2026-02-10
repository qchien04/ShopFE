import { useQuery } from "@tanstack/react-query"
import type { Cart } from "../../types/entity.type"
import { cartQueryKeys } from "./category.query-key"
import { cartApi } from "../../api/cart.api"

export const useCart = <T = Cart>() => {
  return useQuery<T>({
    queryKey: cartQueryKeys.all,
    queryFn: () => {
      return cartApi.getUserCart() as T
    },
  })
}
