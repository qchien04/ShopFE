import { deleteData, getData, postData, putData } from "../app/axiosClient"
import type { ApiResponse } from "../types"
import type { Cart, CartItem } from "../types/entity.type"
import type { AddToCartRequest, UpdateCartItemQuantityRequest } from "../types/request.type"

export const cartApi = {
  getUserCart: (): Promise<Cart> =>
    getData<Cart>("/cart"),

  addToCart: (payload:AddToCartRequest): Promise<CartItem> =>
    postData<CartItem>("/cart/add", payload),

  updateCartItemQuantity: (r:UpdateCartItemQuantityRequest): Promise<ApiResponse> =>
    putData<ApiResponse>(`/cart/item/${r.cartItemId}`, {quantity:r.quantity}),

  removeFromCart: (id:number): Promise<ApiResponse> =>
    deleteData<ApiResponse>(`/cart/item/${id}`,{}),

  clearCart: (): Promise<ApiResponse> =>
    deleteData<ApiResponse>(`/cart/clear`,{}),
}

