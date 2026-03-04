import {  getData, postData } from "../app/axiosClient"
import type { BannerConfig, BannerSlot, DashboardDTO } from "../types/entity.type"

export const adminApi = {
  // pay: (): Promise<Order[]> =>
  //   getData<Order[]>("/orders/user"),

  payUpdate: (): Promise<any> =>
    postData<any>(`/admin`,{}),

  getDashboard: (): Promise<DashboardDTO> => 
    getData<DashboardDTO>("/admin/dashboard"),

  setConfigBanner: (banners:BannerSlot[],categories:BannerSlot[],quickTopOption:BannerSlot[],quickBottomOption:BannerSlot[], selectedPreIds:number[],selectedPopularIds:number[]): Promise<BannerConfig> => 
    postData<BannerConfig>('/admin/configs/banner', { banners, categories,quickTopOption,quickBottomOption,selectedPreIds,selectedPopularIds }),

  getConfigBanner: (): Promise<BannerConfig> => 
    getData<BannerConfig>('/admin/configs/banner'),
  
  
}

