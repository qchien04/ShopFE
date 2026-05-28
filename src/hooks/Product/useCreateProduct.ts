// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../../api/product.api";
import { productsQueryKeys } from "./room.query-key";
import { antdMessage } from "../../utils/antdMessage";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      antdMessage.success("Tạo mới thành công!");
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.all,
      });
    },
    onError: (err: any) => {
      console.error(err);
      antdMessage.error(err.response?.data?.message || err.response?.data?.error || "Tạo mới thất bại!");
    },
  });
};
