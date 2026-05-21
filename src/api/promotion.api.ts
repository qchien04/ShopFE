import { getData, postData, putData, deleteDataNoBody, patchData } from "../app/axiosClient";
import type { Promotion } from "../types/entity.type";

export const promotionApi = {
  // Public
  getActivePromotions: (): Promise<Promotion[]> =>
    getData<Promotion[]>("/promotions/active"),

  getFlashSales: (): Promise<Promotion[]> =>
    getData<Promotion[]>("/promotions/flash-sales"),

  getPromotion: (id: number): Promise<Promotion> =>
    getData<Promotion>(`/promotions/${id}`),

  // Admin
  getAllPromotions: (): Promise<Promotion[]> =>
    getData<Promotion[]>("/admin/promotions"),

  getPromotionById: (id: number): Promise<Promotion> =>
    getData<Promotion>(`/admin/promotions/${id}`),

  createPromotion: (data: Partial<Promotion>): Promise<Promotion> =>
    postData<Promotion>("/admin/promotions", data),

  updatePromotion: (id: number, data: Partial<Promotion>): Promise<Promotion> =>
    putData<Promotion>(`/admin/promotions/${id}`, data),

  deletePromotion: (id: number): Promise<void> =>
    deleteDataNoBody<void>(`/admin/promotions/${id}`),

  togglePromotion: (id: number): Promise<Promotion> =>
    patchData<Promotion>(`/admin/promotions/${id}/toggle`, {}),
};
