// src/hooks/useDeleteRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryQueryKeys } from "./category.query-key";
import { categoryApi } from "../../api/categories.api";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.lists(),
      });
    },
  });
};
