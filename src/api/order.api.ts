import { getData, postData, putData } from "../app/axiosClient"
import type { Order } from "../types/entity.type"
import type { CreateOrderRequest } from "../types/request.type"
import { OrderStatus, PaymentStatus } from "../types/entity.type"

import type { UserOrderResponse } from "../types/response.type"
import type { AdminOrderFilter } from "../types"

export const orderApi = {
  getUserOrder: (page = 0, size = 10, status = "ALL"): Promise<UserOrderResponse<Order>> =>
    getData<UserOrderResponse<Order>>(`/orders/user?page=${page}&size=${size}&status=${status}`),

  getAllOrder: (): Promise<Order[]> =>
    getData<Order[]>("/orders"),

  updateStatusOrders: (id: number, status: OrderStatus, reason: string, internalNote: string): Promise<Order> =>
    putData<Order>(`/orders/${id}/status`, { status: status, reason, internalNote }),

  updatePaymentStatus: (id: number, paymentStatus: PaymentStatus): Promise<Order> =>
    putData<Order>(`/orders/${id}/payment-status?status=${paymentStatus}`, {}),

  createOrder: (payload: CreateOrderRequest): Promise<Order> =>
    postData<Order>("/orders", payload),

  getOrderById: (id: number): Promise<Order> =>
    getData<Order>(`/orders/${id}`),

  calculateDiscountPreview: (payload: CreateOrderRequest): Promise<any> =>
    postData<any>("/orders/calculate-discount", payload),

  getOrderByNumber: (orderNumber: string): Promise<Order> =>
    getData<Order>(`/orders/number/${orderNumber}`),

  getAdminOrdersPaginated: (filter: AdminOrderFilter): Promise<UserOrderResponse<Order>> =>
    getData<UserOrderResponse<Order>>(`/orders`, filter),
}

