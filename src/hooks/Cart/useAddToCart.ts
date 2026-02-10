// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./category.query-key";
import { cartApi } from "../../api/cart.api";
import { antdMessage } from "../../utils/antdMessage";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.all,
      });
      antdMessage.success("Đã thêm vào giỏ hàng!");
    },
    onError:()=>{
      antdMessage.error("Có lỗi xảy ra!");
    }
  });
};
