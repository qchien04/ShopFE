import { deleteData, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Cart, CartItem, Order } from "../types/entity.type"
import type { AddToCartRequest, CreateOrderRequest, CreatePaymentRequest, UpdateCartItemQuantityRequest } from "../types/request.type"
import type { CreatePaymentLinkResponse } from "../types/response.type"

export const paymentApi = {
  // pay: (): Promise<Order[]> =>
  //   getData<Order[]>("/orders/user"),

  pay: (payload:CreatePaymentRequest): Promise<CreatePaymentLinkResponse> =>
    postData<CreatePaymentLinkResponse>(`/check-out/create-payment-link`,payload),

  payOSOder: (id:string): Promise<CreatePaymentLinkResponse> =>
    getData<CreatePaymentLinkResponse>(`/payments/${id}`),
}

