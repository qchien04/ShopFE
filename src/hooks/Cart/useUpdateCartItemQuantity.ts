// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./category.query-key";
import { cartApi } from "../../api/cart.api";

export const useUpdateCartItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.all,
      });
      
    },
  });
};
