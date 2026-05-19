import type { PaymentMethod } from "./entity.type";

export interface VariantFormValue {
  id?: number;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  mainImage?: any[];
  attributes?: Array<{ key: string; value: string }>;
}

export interface ProductFormValues {
  name: string;
  sku: string;
  slug?: string;
  categoryId: number;
  brandId: number;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  shortDescription: string;
  fullDescription?: string;

  mainImage: any[];
  images: any[];
  variants: VariantFormValue[];
}


export interface CategoryFormValues {
  id?: number
  name: string;
  description: string;
  slug: string;
  icon: string;
  image: string;

  parentId?: number;
}

export interface BrandFormValues {
  name: string;
  description: string;
  website: string;
  slug: string;
  logo: string;

}
export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemQuantityRequest {
  cartItemId: number;
  quantity: number;
}


export interface CreateCustomerAddressRequest {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
  lat?: number;
  lng?: number;
}

export interface OrderRequestItem {
  productVariantId: number;
  quantity: number;
}


export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
  items: OrderRequestItem[];
  couponCode?: string;
}


export interface CreatePaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserInfoRequest {
  fullName: string;
  dob: string;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}







