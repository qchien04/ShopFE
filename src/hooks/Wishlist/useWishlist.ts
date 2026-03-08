import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishListApi } from "../../api/wishlist.api";

export const useWishlist = () =>
  useQuery({
    queryKey: ["wishlist"],
    queryFn: () =>wishListApi.getMyList(),
  });

export const useAddWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      wishListApi.add(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};

export const useWishlistCheck= (id:number) => 
  useQuery({
    queryKey: ["wishlist-check", id],
    queryFn: () =>wishListApi.check(id),
  });
;

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
       wishListApi.RemoveWishlist(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
};