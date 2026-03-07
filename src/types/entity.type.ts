import type { PromoPost } from "../pages/Admin/Banner/PromoPostsSlot";
import type { ProductStatus, ProductVariant } from "./product.type";

export interface CartItem{
  id:number;
  cartId:number;
  productVariant:ProductVariant;
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
  // MOMO="MOMO",
  // VNPAY="VNPAY",
  // ZALOPAY="ZALOPAY",
  COD = "COD",
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



export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostPayload {
  title: string;
  category: string;
  content: string;
  status: PostStatus;
  // ...
}

export interface Post {
  id: number;
  title: string;
  category: string;
  description?: string;
  thumbnail?: string;
  content: string;       // HTML string từ TipTap editor
  tags?: string[];
  status: PostStatus;
  updatedAt: string;     // ISO string
}



export interface StatsDTO {
  totalRevenue: number;
  revenueGrowthPercent: number;
  todayOrders: number;
  pendingOrders: number;
  orderGrowthPercent: number;
  totalProducts: number;
  lowStockProducts: number;
  newCustomersThisWeek: number;
  customerGrowthPercent: number;
}

export interface RevenueByDayDTO {
  date: string;       // "2024-01-15"
  dayLabel: string;   // "T2", "T3"...
  revenue: number;
}

export interface OrderStatusCountDTO {
  status: OrderStatus;
  label: string;
  count: number;
  color: string;
}

export interface TopProductDTO {
  id: number;
  name: string;
  sku: string;
  mainImage: string;
  brand: string;
  category: string;
  soldCount: number;
  price: number;
  salePrice?: number;
}

export interface RecentOrderDTO {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface FeaturedProductDTO {
  id: number;
  name: string;
  sku: string;
  mainImage: string;
  brand: string;
  category: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  soldCount: number;
  status: ProductStatus;
}

export interface DashboardDTO {
  stats: StatsDTO;
  revenueByDay: RevenueByDayDTO[];
  orderStatusCounts: OrderStatusCountDTO[];
  topProducts: TopProductDTO[];
  recentOrders: RecentOrderDTO[];
  featuredProducts: FeaturedProductDTO[];
}


export interface BannerSlot {
  id: string;
  type: 'main' | 'side' | 'category' | 'quick-top' | 'quick-bottom';
  label: string;
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  link?: string;
  icon?: string;
  children?: BannerSlotChild[];
}
export interface BannerSlotChild {
  id: string;
  label: string;
  link: string;
  icon: string;
}


export interface BannerConfig {
  banners: BannerSlot[];
  categories: BannerSlot[];
  quickTopOption: BannerSlot[];
  quickBottomOption: BannerSlot[];
  featuredPostIds:number[];
  featuredPopularIds:number[];
  saleEvents: PromoPost[], 
}
