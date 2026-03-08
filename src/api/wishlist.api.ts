import { deleteData, getData, postData } from "../app/axiosClient"
import type { ApiResponse, Wishlist } from "../types"


export const wishListApi = {
  getMyList: (): Promise<Wishlist[]> =>
    getData<Wishlist[]>(`/wishlist`),

  check: (productId:number): Promise<{isInWishlist:boolean}> =>
    getData<{isInWishlist:boolean}>(`/wishlist/${productId}/check`),

  add: (productId:number): Promise<Wishlist> =>
    postData<Wishlist>(`/wishlist/${productId}`,{}),

  RemoveWishlist: (productId:number): Promise<ApiResponse> =>
    deleteData<ApiResponse>(`/wishlist/${productId}`,{}),

}

