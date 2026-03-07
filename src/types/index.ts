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



