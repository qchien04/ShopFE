import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Category } from "../types/categories.type"
import type { CategoryFilterResponse } from "../types/response.type"

export const categoryApi = {
  getAll: (): Promise<Category[]> =>
    getData<Category[]>("/categories"),

  getAllParent: (): Promise<Category[]> =>
    getData<Category[]>("/categories/parent"),

  getFilter: (id:number): Promise<CategoryFilterResponse> =>
    getData<CategoryFilterResponse>("/categories/filter",{categoryId:id}),

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

