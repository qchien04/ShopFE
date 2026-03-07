// hooks/Product/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../../api/review.api";

export const useReviews = (productId: number) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: ()=>reviewApi.getReviewsByProductId(productId)
  });

export const useAddReview = (productId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      reviewApi.addReview(productId,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
};