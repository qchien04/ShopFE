// src/hooks/useRoomDetail.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { brandApi } from "../../api/brand.api"
import { antdMessage } from "../../utils/antdMessage"
import type { Brand } from "../../types/entity.type"

export const brandQueryKeys = {
  all: ["brand"] as const,

  lists: () => [...brandQueryKeys.all, "list"] as const,

  detail: (id: number) =>
    [...brandQueryKeys.all, "detail", id] as const,
}

export const useBrandDetail = <T = Brand>(id?: number) => {
  return useQuery<T>({
    queryKey: id ? brandQueryKeys.detail(id) : [],
    queryFn: () => {
      if (!id) throw new Error("Product id is required")
      return brandApi.getById(id) as T
    },
    enabled: !!id,
  })
}



export const useBrandList = <T = Brand[]>() => {
  return useQuery<T>({
    queryKey: brandQueryKeys.lists(),
    queryFn: () => { 
      return brandApi.getAll() as T
    }
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: brandApi.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: brandQueryKeys.lists(),
      });
      
    },
  });
};


export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandApi.deleteById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: brandQueryKeys.lists(),
      });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (payload: Brand) => brandApi.updateBrand(payload),
      onSuccess: () => {
        antdMessage.success("Cập nhật thành công!");
        queryClient.invalidateQueries({
          queryKey: brandQueryKeys.all,
        });
      },
      onError: (err: any) => {
        console.error(err);
        antdMessage.error("Cập nhật thất bại!");
      },
    }
  );
};
