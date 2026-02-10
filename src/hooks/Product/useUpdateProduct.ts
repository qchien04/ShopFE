// hooks/useUpdateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { antdMessage } from "../../utils/antdMessage";
import { productApi } from "../../api/product.api";
import { productsQueryKeys } from "./room.query-key";
import type { Product } from "../../types/product.type";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (payload: Product) => productApi.updateProduct(payload),
      onSuccess: () => {
        antdMessage.success("Cập nhật thành công!");
        queryClient.invalidateQueries({
          queryKey: productsQueryKeys.all,
        });
      },
      onError: (err: any) => {
        console.error(err);
        antdMessage.error("Cập nhật thất bại!");
      },
    }
  );
};
