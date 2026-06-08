import { useQuery } from "@tanstack/react-query"
import type { Cart } from "../../types/entity.type"
import { cartQueryKeys } from "./category.query-key"
import { cartApi } from "../../api/cart.api"
import { useAppSelector, type RootState } from "../../app/store"

export const useCart = <T = Cart>() => {
  const { isAuthenticated } = useAppSelector(
    (state: RootState) => state.auth
  );

  return useQuery<T>({
    queryKey: cartQueryKeys.all,
    queryFn: () => {
      return cartApi.getUserCart() as T
    },
    enabled: isAuthenticated
  })
}
