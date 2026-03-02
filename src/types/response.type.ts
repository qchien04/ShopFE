import type { Category } from "./categories.type";
import type { Brand } from "./entity.type";

export interface CreatePaymentLinkResponse{
  accountName: string,
  accountNumber: string,
  amount: number,
  bin: string,
  checkoutUrl: string,
  currency: string,
  description: string,
  expiredAt: null,
  orderCode: number,
  paymentLinkId: string,
  qrCode: string,
  status: string,
}


export interface CategoryFilterResponse{
  minPrice:number;
  maxPrice:number;
  subCategories: Category[];
  brands: Brand[];
}

export interface BrandFilterResponse{
  minPrice:number;
  maxPrice:number;
  subCategories: Category[];
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}