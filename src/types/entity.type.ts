import type { Product } from "./product.type";

export interface CartItem{
  id:number;
  cartId:number;
  product:Product;
  quantity:number;
  price:number;
  addedAt:string;
}

export interface Cart{
  id?:number;
  items:CartItem[];
  updatedAt:string;
}

export interface CustomerAddress {
  id?: number;
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


export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: number;
  productImage:string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  subtotal:number;
}


export enum OrderStatus{
  PENDING="PENDING",
  CONFIRMED="CONFIRMED",
  PROCESSING="PROCESSING",
  SHIPPING="SHIPPING", 
  DELIVERED="DELIVERED", 
  CANCELLED="CANCELLED", 
  RETURNED="RETURNED",
}


export enum PaymentMethod{
  BANK_TRANSFER="BANK_TRANSFER",
  MOMO="MOMO",
  VNPAY="VNPAY",
  ZALOPAY="ZALOPAY",
}

export enum PaymentStatus{
  UNPAID="UNPAID",
  PAID="PAID",
  REFUNDED="REFUNDED",
}


export interface Order{
  id?: number;
  orderNumber:string;
  items: OrderItem[];
  total:number;
  status: OrderStatus;
  paymentMethod:PaymentMethod;
  paymentStatus:PaymentStatus;
  note:string;
  createdAt:string;
}


export interface Brand{
  id?: number;
  name:string;
  slug: string;
  description:string;
  website: string;
  logo:string;
  active:boolean;
  createdAt:string;
  updateAt:string;
}







