import {  deleteData, getData, postData } from "../app/axiosClient"
import type { PromoPost } from "../pages/Admin/Banner/PromoPostsSlot"
import type { Review } from "../types";
import type { BannerConfig, BannerSlot, DashboardDTO } from "../types/entity.type"
import type { PageResponse } from "../types/response.type";

export const adminApi = {
  // pay: (): Promise<Order[]> =>
  //   getData<Order[]>("/orders/user"),

  payUpdate: (): Promise<any> =>
    postData<any>(`/admin`,{}),

  getDashboard: (): Promise<DashboardDTO> => 
    getData<DashboardDTO>("/admin/dashboard"),

  setConfigBanner: (banners:BannerSlot[],categories:BannerSlot[],
    quickTopOption:BannerSlot[],quickBottomOption:BannerSlot[], 
    featuredPostIds:number[],featuredPopularIds:number[],
    saleEvents: PromoPost[], ): Promise<BannerConfig> => 
    postData<BannerConfig>('/admin/configs/banner', { banners, categories,quickTopOption,quickBottomOption,featuredPostIds,featuredPopularIds,saleEvents }),

  getConfigBanner: (): Promise<BannerConfig> => 
    getData<BannerConfig>('/admin/configs/banner'),

  getAllAdminReview: (status:string, page:number): Promise<PageResponse<Review>> => 
    getData<PageResponse<Review>>(`/admin/reviews?status=${status}&page=${page}`),

  approveReview: (reviewId:number): Promise<PageResponse<Review>> => 
    postData<PageResponse<Review>>(`/admin/reviews/${reviewId}/approve`,{}),

  rejectReview: (reviewId:number): Promise<PageResponse<Review>> => 
    postData<PageResponse<Review>>(`/admin/reviews/${reviewId}/reject`,{}),

  deleteReview: (reviewId:number): Promise<PageResponse<Review>> => 
    deleteData<PageResponse<Review>>(`/admin/reviews/${reviewId}`,{}),
  
}

