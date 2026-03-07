import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin.api";

export const DASHBOARD_KEY = ["dashboard"] as const;

export const useDashboard = () =>
  useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn:  adminApi.getDashboard,
    staleTime: 1000 * 60 * 5,  
    refetchOnWindowFocus: false,
  });

export const useAdminReviews = (status = "PENDING", page = 0) =>
  useQuery({
    queryKey: ["admin-reviews", status, page],
    queryFn: () =>adminApi.getAllAdminReview(status,page),
  });

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) =>adminApi.approveReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) =>adminApi.approveReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });
};


export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) =>adminApi.deleteReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });
};