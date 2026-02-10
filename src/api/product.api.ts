import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Product } from "../types/product.type"
import type { ProductFormValues } from "../types/request.type"

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

  getByCategory: (category:string): Promise<Product[]> =>
    getData<Product[]>(`/products/category/${category}`),

  getByBrand: (brand:string): Promise<Product[]> =>
    getData<Product[]>(`/products/brand/${brand}`),

  getNew: (categoryId:number|null): Promise<Product[]> =>
    getData<Product[]>(`/products/new`,{categoryId}),

  getFeaturedProducts: (): Promise<Product[]> =>
    getData<Product[]>(`/products/featured`),

  getByKeyword: (key:string): Promise<Product[]> =>
    getData<Product[]>(`/products/search`,{keyword:key}),

  deleteById: (id:number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>(`/products/${id}`),

  increaseViewCount: (id:number): Promise<ApiResponse> =>
    postData<ApiResponse>(`/products/${id}/view`,{}),

}

