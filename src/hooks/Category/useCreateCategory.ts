// src/hooks/useCreateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../api/categories.api";
import { categoryQueryKeys } from "./category.query-key";
import { antdMessage } from "../../utils/antdMessage";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      antdMessage.success("Tạo mới thành công!");
      queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.lists(),
      });
    },
    onError: (err: any) => {
      console.error(err);
      antdMessage.error(err?.message || "Tạo mới thất bại!");
    },
  });
};
