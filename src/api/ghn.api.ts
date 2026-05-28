import { getData, postData } from "../app/axiosClient"

export interface GHNProvince {
  ProvinceID: number
  ProvinceName: string
  CountryID: number
  Code: string
}

export interface GHNDistrict {
  DistrictID: number
  ProvinceID: number
  DistrictName: string
  Code: string
  Type: number
}

export interface GHNWard {
  WardCode: string
  DistrictID: number
  WardName: string
}

export interface GHNFee {
  total: number
  service_fee: number
  insurance_fee: number
  coupon_value: number
  r2s_fee: number
}

export interface GHNShippingResult {
  order_code: string
  sort_code: string
  trans_type: string
  ward_encode: string
  district_encode: string
  expected_delivery_time: string
  total_fee: number
  ghnOrderCode?: string
  shippingFee?: number
}

export interface CreateGHNShippingPayload {
  serviceTypeId?: number       // 2=Express, 5=Standard
  paymentTypeId?: number       // 1=Shop trả phí, 2=Người nhận trả
  requiredNote?: string        // CHOXEMHANGKHONGTHU | CHOTHUHANG | KHONGCHOXEMHANG
  codAmount?: number
  insuranceValue?: number
  note?: string
  weight?: number
  length?: number
  width?: number
  height?: number
}

export interface GHNCalculateFeePayload {
  toDistrictId: number
  toWardCode: string
  weight: number
  length?: number
  width?: number
  height?: number
  insuranceValue?: number
  serviceTypeId?: number
  items?: Array<{
    name: string
    quantity: number
    weight?: number
    length?: number
    width?: number
    height?: number
  }>
}

export const ghnApi = {
  getProvinces: (): Promise<GHNProvince[]> =>
    getData<GHNProvince[]>("/ghn/provinces"),

  getDistricts: (provinceId: number): Promise<GHNDistrict[]> =>
    getData<GHNDistrict[]>(`/ghn/districts?provinceId=${provinceId}`),

  getWards: (districtId: number): Promise<GHNWard[]> =>
    getData<GHNWard[]>(`/ghn/wards?districtId=${districtId}`),

  calculateFee: (payload: GHNCalculateFeePayload): Promise<GHNFee> =>
    postData<GHNFee>("/ghn/calculate-fee", payload),

  calculateFeeByOrder: (orderId: number, payload: GHNCalculateFeePayload): Promise<GHNFee> =>
    postData<GHNFee>(`/ghn/calculate-fee/${orderId}`, payload),

  createShipping: (orderId: number, payload: CreateGHNShippingPayload): Promise<GHNShippingResult> =>
    postData<GHNShippingResult>(`/ghn/create-shipping/${orderId}`, payload),

  trackOrder: (ghnOrderCode: string): Promise<any> =>
    getData<any>(`/ghn/tracking/${ghnOrderCode}`),

  generatePrintToken: (orderCodes: string[]): Promise<{ token: string; printUrl: string }> =>
    postData<{ token: string; printUrl: string }>("/ghn/print-token", { orderCodes }),
}
