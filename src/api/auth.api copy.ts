import { postData } from "../app/axiosClient"
import type { ApiResponse, LoginPayload, LoginResponse, UserRegisterPayLoad } from "../types"

export const authApi = {
  login: (payload: LoginPayload): Promise<LoginResponse> =>
    postData<LoginResponse>("/auth/login", payload),

  userRegister: (payload: UserRegisterPayLoad): Promise<ApiResponse> =>
    postData<ApiResponse>("/auth/register", payload),

  gglogin: (payload: {accessToken:string}): Promise<LoginResponse> =>
    postData<LoginResponse>("/google/login/user", payload),
}

