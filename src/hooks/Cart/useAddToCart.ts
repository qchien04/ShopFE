// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartQueryKeys } from "./category.query-key";
import { cartApi } from "../../api/cart.api";
import { antdMessage } from "../../utils/antdMessage";
import { useAppSelector, type RootState } from "../../app/store";
import type { AddToCartRequest } from "../../types/request.type";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const {isAuthenticated}= useAppSelector(
      (state: RootState) => state.auth
  );
  
  return useMutation({
    mutationFn: (payload:AddToCartRequest) => {
      if (!isAuthenticated) {
        throw new Error("User not authenticated");
      }
      return cartApi.addToCart(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.all,
      });
      antdMessage.success("Đã thêm vào giỏ hàng!");
    },
    onError:(error)=>{
      if (error.message === "User not authenticated") {
        antdMessage.warning("Vui lòng đăng nhập trước!");
      } else {
        antdMessage.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    }
  });
};
