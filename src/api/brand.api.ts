import { deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Brand } from "../types/entity.type"
import type { BrandFilterResponse } from "../types/response.type"

export const brandApi = {
  getAll: (): Promise<Brand[]> =>
    getData<Brand[]>("/brands"),

  getFilter: (id:number): Promise<BrandFilterResponse> =>
      getData<BrandFilterResponse>("/brands/filter",{brandId:id}),
  
  createBrand: (payload:Brand): Promise<Brand> =>
    postData<Brand>("/brands", payload),

  updateBrand: (payload:Brand): Promise<Brand> =>
    putData<Brand>(`/brands/${payload.id}`, payload),

  getById: (id:number): Promise<Brand> =>
    getData<Brand>(`/brands/${id}`),

  getBySlug: (slug:string): Promise<Brand> =>
    getData<Brand>(`/brands/slug/${slug}`),

  deleteById: (id:number): Promise<ApiResponse> =>
    deleteDataNoBody<ApiResponse>(`/brands/${id}`),


}

