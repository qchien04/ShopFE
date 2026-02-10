import { deleteData, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { CustomerAddress } from "../types/entity.type"
import type { CreateCustomerAddressRequest } from "../types/request.type"

export const customerAddressApi = {
  getAll: (): Promise<CustomerAddress[]> =>
    getData<CustomerAddress[]>("/address"),

  createAddress: (payload:CreateCustomerAddressRequest): Promise<CustomerAddress> =>
    postData<CustomerAddress>("/address", payload),

  updateAddress: (r:CustomerAddress): Promise<CustomerAddress> =>
    putData<CustomerAddress>(`/address`, r),

  deleteAddress: (id:number): Promise<ApiResponse> =>
    deleteData<ApiResponse>(`/address/${id}`,{}),
}

