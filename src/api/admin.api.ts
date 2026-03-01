import { deleteData, getData, postData, putData } from "../app/axiosClient"
import type { BannerConfig, BannerSlot, Cart, CartItem, DashboardDTO, Order } from "../types/entity.type"

export const adminApi = {
  // pay: (): Promise<Order[]> =>
  //   getData<Order[]>("/orders/user"),

  payUpdate: (): Promise<any> =>
    postData<any>(`/admin`,{}),

  getDashboard: (): Promise<DashboardDTO> => 
    getData<DashboardDTO>("/admin/dashboard"),

  setConfigBanner: (banners:BannerSlot[],categories:BannerSlot[]): Promise<BannerConfig> => 
    postData<BannerConfig>('/admin/configs/banner', { banners, categories }),

  getConfigBanner: (): Promise<BannerConfig> => 
    getData<BannerConfig>('/admin/configs/banner'),
  
  
}

