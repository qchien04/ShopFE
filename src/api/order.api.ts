import { deleteData, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Cart, CartItem, Order } from "../types/entity.type"
import type { AddToCartRequest, CreateOrderRequest, UpdateCartItemQuantityRequest } from "../types/request.type"

export const orderApi = {
  getUserOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders/user"),

  createOrder: (payload:CreateOrderRequest): Promise<Order> =>
    postData<Order>("/orders", payload),
}

