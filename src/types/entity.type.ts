import type { PromoPost } from "../pages/Admin/HomeConfig/components/PromoPostsSlot";
import type { ProductVariant } from "./product.type";

export interface CartItem {
  id: number;
  cartId: number;
  productVariant: ProductVariant;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  updatedAt: string;
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
  productImage: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  subtotal: number;
  attributes: string;
}


export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}


export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  // MOMO="MOMO",
  // VNPAY="VNPAY",
  // ZALOPAY="ZALOPAY",
  COD = "COD",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}


export interface Order {
  id: number;
  customerName: String;
  customerPhone: String;
  shippingAddress: String;
  shippingFee: number;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  note: string;
  discount: number;
  couponCode?: string;
  couponDetails?: string;
  createdAt: string;
  deliveredAt: string;
  deliveryAttempts?: number;
  cancelReason?: string;
  internalNote?: string;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: number;
  fromStatus?: OrderStatus;
  toStatus: OrderStatus;
  actionBy: string;
  note?: string;
  createdAt: string;
}


export interface Brand {
  id?: number;
  name: string;
  slug: string;
  description: string;
  website: string;
  logo: string;
  createdAt: string;
  updateAt: string;
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
  createdAt: string;
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
}

export interface DashboardDTO {
  stats: StatsDTO;
  revenueByDay: RevenueByDayDTO[];
  orderStatusCounts: OrderStatusCountDTO[];
  topProducts: TopProductDTO[];
  recentOrders: RecentOrderDTO[];
  featuredProducts: FeaturedProductDTO[];
}


export interface VisualBanner {
  id: string;
  type: 'main' | 'side';
  label: string;
  image: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  link?: string;
}

export interface NavSlot {
  id: string;
  type: 'category' | 'quick-top' | 'quick-bottom';
  label: string;
  link: string;
  icon?: string;
  children?: NavSlot[];
}


export interface CategoryWithProducts {
  productIds: number[];
  categoryId: number;
}

export interface FeaturedProductConfig {
  id: string;
  title: string;
  active: boolean;
  productIds: number[];
  productCount: number;
}

export interface NewProductConfig {
  id: string;
  title: string;
  active: boolean;
  categoryOfProduct: CategoryWithProducts[];
  productPerRow: number;
}
export interface BrandsShowcaseConfig {
  id: string;
  title: string;
  active: boolean;
  brandIds: number[];
  brandCount: number;
}

export interface HotDealsSectionConfig {
  id: string;
  title: string;
  active: boolean;
  productIds: number[];
  weeklyProductIds: number[];
  weeklyTitle: string;
  productPerRow: number;
}

export interface CategoryConfig {
  id: string;
  title: string;
  active: boolean;
  categoryIds: number[];
  productPerRow: number;
}

export interface FeaturedCategoryConfig {
  id: string;
  title: string;
  active: boolean;
  categoryIds: number[];
  categoryPerRow: number;
}

export interface NewsSectionConfig {
  id: string;
  title: string;
  active: boolean;
  postIds: number[];
  popularPostIds: number[];
  postPerRow: number;
}


export interface FooterConfig {
  companyDescription?: string;
  address?: string;
  hotline?: string;
  email?: string;
  workingHours?: string;
  copyright?: string;
  facebookLink?: string;
  twitterLink?: string;
  instagramLink?: string;
  youtubeLink?: string;
  shopeeLink?: string;
  lazadaLink?: string;
  tiktokLink?: string;
}

export type AnySectionConfig = FeaturedProductConfig | NewProductConfig | BrandsShowcaseConfig | HotDealsSectionConfig | CategoryConfig | NewsSectionConfig | FeaturedCategoryConfig;

export interface HomePageConfig {
  banners: VisualBanner[];
  navCategories: NavSlot[];
  navQuickTopOption: NavSlot[];
  navQuickBottomOption: NavSlot[];
  saleEvents: PromoPost[];
  footer?: FooterConfig;
  
  // Sections riêng biệt
  featuredProducts?: FeaturedProductConfig;
  newProducts?: NewProductConfig;
  brandShowcase?: BrandsShowcaseConfig;
  hotDeals?: HotDealsSectionConfig;
  news?: NewsSectionConfig;
  categorySections?: CategoryConfig[];
  featuredCategories?: FeaturedCategoryConfig;
  layout?: string[];
}

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface UserAccountDTO {
  id: number;
  username: string;
  fullName: string;
  dob: string;
  email: string;
  roles: string[];
}
