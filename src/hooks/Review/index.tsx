// hooks/Product/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../../api/review.api";

export const useReviews = (productId: number) =>{
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: ()=>reviewApi.getReviewsByProductId(productId),
    enabled: !!productId && !isNaN(productId), 
  });
}
  

export const useAddReview = (productId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) => {
      if (!productId || isNaN(productId)) {
        return Promise.reject(new Error("Invalid productId"));
      }
      return reviewApi.addReview(productId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
};