import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Category } from "../types/categories.type"

export const categoryApi = {
  getAll: (): Promise<Category[]> =>
    getData<Category[]>("/categories"),

  createCategory: (payload:Category): Promise<Category> =>
    postData<Category>("/categories", payload),

  updateCategory: (payload:Category): Promise<Category> =>
    putData<Category>(`/categories/${payload.id}`, payload),

  getById: (id:number): Promise<Category> =>
    getData<Category>(`/categories/${id}`),

  getBySlug: (slug:string): Promise<Category> =>
    getData<Category>(`/categories/slug/${slug}`),

  getRootCategories: (): Promise<Category[]> =>
    getData<Category[]>(`/categories/root`),


  deleteById: (id:number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>(`/categories/${id}`),


}

