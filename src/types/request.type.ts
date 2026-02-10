import type { PaymentMethod } from "./entity.type";

export interface ProductFormValues {
  name: string;
  sku: string;
  slug: string;
  categoryId: number;
  brandId: number;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  shortDescription: string;
  fullDescription: string;
  status: string;
  featured: boolean;
  mainImage: any[];
  images: any[];
  specifications: Array<{ specName: string; specValue: string }>;
  category:number[];
}


export interface CategoryFormValues {
  name: string;
  description: string;
  slug: string;
  icon:string;
  image: string;
  active: boolean;
}

export interface BrandFormValues {
  name: string;
  description: string;
  website: string;
  slug: string;
  logo: string;
  active: boolean;
}
export interface AddToCartRequest {
  productId: number;
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

export interface OrderRequestItem{
  productId:number;
  quantity:number;
}


export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
  items:OrderRequestItem[];
}


export interface CreatePaymentRequest{
  orderId: number;
  paymentMethod: PaymentMethod;
}






