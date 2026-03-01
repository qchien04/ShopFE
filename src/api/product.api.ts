import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Product } from "../types/product.type"
import type { ProductFormValues } from "../types/request.type"

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const productApi = {
  getAll: (): Promise<Product[]> =>
    getData<Product[]>("/products"),

  createProduct: (payload:ProductFormValues): Promise<Product> =>
    postData<Product>("/products", payload),

  updateProduct: (payload:Product): Promise<Product> =>
    putData<Product>(`/products/${payload.id}`, payload),

  getById: (id:number): Promise<Product> =>
    getData<Product>(`/products/${id}`),

  getByIds: (ids: number[]): Promise<Product[]> =>
  getData<Product[]>(`/products?ids=${ids.join(",")}`),

  getBySlug: (slug:string): Promise<Product> =>
    getData<Product>(`/products/slug/${slug}`),

  getByCategory: (params: {
    categoryId: number
    subCategoryIds?: string
    brandIds?: string
    sort?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<Product[]> =>
    getData<Product[]>(
      `/products/category/${params.categoryId}`,
      {
        subCategoryIds: params.subCategoryIds,
        brandIds: params.brandIds,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      }
    ),
  getByBrand: (params: {
    brandId: number
    subCategoryIds?: string
    sort?: string
    minPrice?: number
    maxPrice?: number
  }): Promise<Product[]> =>
    getData<Product[]>(
      `/products/brand/${params.brandId}`,
      {
        subCategoryIds: params.subCategoryIds,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      }
    ),

  getNew: (categoryId:number|null): Promise<Product[]> =>
    getData<Product[]>(`/products/new`,{categoryId}),

  getFeaturedProducts: (): Promise<Product[]> =>
    getData<Product[]>(`/products/featured`),

  getByKeyword: (
    keyword: string,
    page: number,
    size: number
  ): Promise<PageResponse<Product>> =>
    getData<PageResponse<Product>>(`/products/search`, {
      keyword,
      page,
      size,
    }),

  deleteById: (id:number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>(`/products/${id}`),

  increaseViewCount: (id:number): Promise<ApiResponse> =>
    postData<ApiResponse>(`/products/${id}/view`,{}),

}

