// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../api/categories.api";
import { categoryQueryKeys } from "./category.query-key";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.lists(),
      });
      
    },
  });
};
