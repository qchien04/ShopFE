// hooks/useUpdateRoom.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { antdMessage } from "../../utils/antdMessage";
import { categoryQueryKeys } from "./category.query-key";
import type { Category } from "../../types/categories.type";
import { categoryApi } from "../../api/categories.api";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (payload: Category) => categoryApi.updateCategory(payload),
      onSuccess: () => {
        antdMessage.success("Cập nhật thành công!");
        queryClient.invalidateQueries({
          queryKey: categoryQueryKeys.all,
        });
      },
      onError: (err: any) => {
        console.error(err);
        antdMessage.error("Cập nhật thất bại!");
      },
    }
  );
};
