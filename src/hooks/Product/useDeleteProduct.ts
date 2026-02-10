// src/hooks/useDeleteRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../api/product.api";
import { productsQueryKeys } from "./room.query-key";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      });
    },
  });
};
