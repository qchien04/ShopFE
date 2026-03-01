import {  getData, postData } from "../app/axiosClient"
import type { Order } from "../types/entity.type"
import type { CreateOrderRequest } from "../types/request.type"

export const orderApi = {
  getUserOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders/user"),

  getAllOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders"),

  createOrder: (payload:CreateOrderRequest): Promise<Order> =>
    postData<Order>("/orders", payload),
}

