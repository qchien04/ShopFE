import {  getData, postData, putData } from "../app/axiosClient"
import type { Order } from "../types/entity.type"
import type { CreateOrderRequest } from "../types/request.type"
import { OrderStatus } from "../types/entity.type"

export const orderApi = {
  getUserOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders/user"),

  getAllOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders"),

  updateStatusOrders: (id:number,status:OrderStatus): Promise<Order> =>
    putData<Order>(`/orders/${id}/status?status=${status}`,{}),

  createOrder: (payload:CreateOrderRequest): Promise<Order> =>
    postData<Order>("/orders", payload),
}

