export interface UserAccount{
  id?:number,
  username?:string,
  password?:string,
  fullName?:string,
  email?:string,
  roles?:string[],
  avt?:string,
  dob?:string,
  phoneNumber?:string,
}


export interface AuthState {
  userAccount: UserAccount | null
  isAuthenticated: boolean
}

export interface Role{
    id?:number,
    name: string,
    description:string
}


export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  jwt: string
  isAuth: boolean
}

export interface ApiResponse {
  message: string
  status: boolean
}

export interface UserRegisterPayLoad{
  username?:string,
  password?:string,
  fullName?:string,
  email?:string,
  avt?:string,
  dob?:string,
  phoneNumber?:string,
}

export interface Review{
  id?:number,
  prroductName:string,
  userAvatar?:string,
  userName?:string,
  rating?:number,
  comment?:string,
  reviewStatus?:string,
  createdAt?:string,
}

export interface ReviewSummary{
  averageRating?:number,
  totalReviews?:number,
  reviews?:Review[],
}

export interface Wishlist{
  id:number,
  productId:number,
  productName:string,
  mainImage?:string,
  price:number,
  salePrice?:number,
  status:string,
  addedAt:string,
}

export interface AiProduct {
  name: string;
  reason: string;
  price: number;
  link: string;
}

export interface AiResponse {
  message: string;
  products: AiProduct[];
  note?: string;
}

export interface VariantStats {
  variantId:    number;
  soldToday:    number;
  soldThisWeek: number;
  soldThisMonth:number;
  soldThisYear: number;
  soldTotal:    number;
  revenueTotal: number;
}

export interface ProductStats {
  productId:      number;
  productName:    string;
  totalViewCount: number;
  totalSoldCount: number;
  soldToday:      number;
  soldThisWeek:   number;
  soldThisMonth:  number;
  soldThisYear:   number;
  revenueToday:   number;
  variantStats:   VariantStats[];
}




