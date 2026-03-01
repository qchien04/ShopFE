import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../api/admin.api";

export const DASHBOARD_KEY = ["dashboard"] as const;

export const useDashboard = () =>
  useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn:  adminApi.getDashboard,
    staleTime: 1000 * 60 * 5,  
    refetchOnWindowFocus: false,
  });
