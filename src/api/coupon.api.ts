import { getData, postData, putData, deleteDataNoBody } from "../app/axiosClient"
import type { Coupon } from "../types/entity.type"

export interface CouponValidationRequest {
  code: string;
  orderTotal: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  message?: string;
  discountAmount?: number;
  coupon?: Coupon;
}

export const couponApi = {
  validateCoupon: (payload: CouponValidationRequest): Promise<CouponValidationResponse> =>
    postData<CouponValidationResponse>("/coupons/validate", payload),
    
  getActiveCoupons: (): Promise<Coupon[]> => getData<Coupon[]>("/coupons"),
  
  // Admin Endpoints
  getAllCoupons: (): Promise<Coupon[]> => getData<Coupon[]>("/admin/coupons"),
  getCouponById: (id: number): Promise<Coupon> => getData<Coupon>(`/admin/coupons/${id}`),
  createCoupon: (payload: any): Promise<Coupon> => postData<Coupon>("/admin/coupons", payload),
  updateCoupon: (id: number, payload: any): Promise<Coupon> => putData<Coupon>(`/admin/coupons/${id}`, payload),
  deleteCoupon: (id: number): Promise<any> => deleteDataNoBody<any>(`/admin/coupons/${id}`)
};
