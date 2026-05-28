// src/hooks/useRoomDetail.ts
import { useQuery } from "@tanstack/react-query"
import type { Product } from "../../types/product.type"
import { productApi } from "../../api/product.api"
import { aiApi } from "../../api/ai.api"
import { reviewApi } from "../../api/review.api"
import { productsQueryKeys } from "./room.query-key"
import type { ProductStats, ReviewSummary } from "../../types"

export const useProductDetail = <T = Product>(id?: number|string) => {
  const isId = !isNaN(Number(id));

  return useQuery<T>({
    queryKey: id ? productsQueryKeys.detail(id) : [],
    queryFn: () => {
      if (!id) throw new Error("Product id is required")
      
      return isId?productApi.getById(id as number) as T:
        productApi.getBySlug(id as string) as T
    },  
    enabled: !!id,
  })
}



export const useProductStats = (productId: number | null) =>
  useQuery<ProductStats>({
    queryKey: ["product-stats", productId],
    queryFn:  () =>productApi.getProductStats(productId!),
    enabled: !!productId,
  });

export const useProductReviews = (productId: number | null, page = 0, size = 5) =>
  useQuery<ReviewSummary>({
    queryKey: ["product-reviews", productId, page, size],
    queryFn: () => reviewApi.getReviewsByProductId(productId!, page, size),
    enabled: !!productId,
  });

export const useRelatedProducts = (productId: number, limit = 4) =>
  useQuery<Product[]>({
    queryKey: ["related-products", productId, limit],
    queryFn: () => aiApi.getRelatedProducts(productId, limit),
    enabled: !!productId,
  });
