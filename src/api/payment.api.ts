import { getData, postData } from "../app/axiosClient"
import type {  CreatePaymentRequest } from "../types/request.type"
import type { CreatePaymentLinkResponse } from "../types/response.type"

export const paymentApi = {
  // pay: (): Promise<Order[]> =>
  //   getData<Order[]>("/orders/user"),

  pay: (payload:CreatePaymentRequest): Promise<CreatePaymentLinkResponse> =>
    postData<CreatePaymentLinkResponse>(`/check-out/create-payment-link`,payload),

  payOSOder: (id:string): Promise<CreatePaymentLinkResponse> =>
    getData<CreatePaymentLinkResponse>(`/payments/${id}`),

  // paymentStatus: (id:string): Promise<any> =>
  //   getData<any>(`/payments/${id}`),
}

