import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ParamSearch } from "../hooks/Product/useProductList"
import type { ApiResponse, ProductStats } from "../types"
import type { Product, ProductVariant } from "../types/product.type"
import type { ProductFormValues } from "../types/request.type"
import type { PageResponse } from "../types/response.type"

export const productApi = {
  getAll: (param:ParamSearch): Promise<PageResponse<Product>> =>
    getData<PageResponse<Product>>("/products",param),

  createProduct: (payload:ProductFormValues): Promise<Product> =>
    postData<Product>("/products", payload),

  updateProduct: (payload:Product): Promise<Product> =>
    putData<Product>(`/products/${payload.id}`, payload),

  getById: (id:number): Promise<Product> =>
    getData<Product>(`/products/${id}`),

  getProductStats: (productId:number): Promise<ProductStats> =>
    getData<ProductStats>(`/products/${productId}/stats`),

  getByIds: (ids: number[]): Promise<PageResponse<Product>> =>
  getData<PageResponse<Product>>(`/products?ids=${ids.join(",")}`),

  getVariantByIds: (ids: number[]): Promise<ProductVariant[]> =>
  getData<ProductVariant[]>(`/products/variant?ids=${ids.join(",")}`),

  getBySlug: (slug:string): Promise<Product> =>
    getData<Product>(`/products/slug/${slug}`),

  getByCategory: (params:ParamSearch): Promise<Product[]> =>
    getData<Product[]>(
      `/products/category/${params.mainCategoryId}`,
      {
        subCategoryIds: params.subCategoryIds,
        brandIds: params.brandIds,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        page: params.page,
        size: params.size,
      }
    ),
  getByBrand: (params: ParamSearch): Promise<Product[]> =>
    getData<Product[]>(
      `/products/brand/${params.brandIds?params.brandIds[0]:0}`,
      {
        subCategoryIds: params.subCategoryIds,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        page: params.page,
        size: params.size,
      }
    ),

  getNew: (categoryId:number|null): Promise<Product[]> =>
    getData<Product[]>(`/products/new`,{categoryId}),

  getFeaturedProducts: (): Promise<Product[]> =>
    getData<Product[]>(`/products/featured`),

  getByKeyword: (params:ParamSearch): Promise<PageResponse<Product>> =>
    getData<PageResponse<Product>>(`/products/search`, {
      ...params
    }),

  deleteById: (id:number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>(`/products/${id}`),

  increaseViewCount: (id:number): Promise<ApiResponse> =>
    postData<ApiResponse>(`/products/${id}/view`,{}),

}

