// user.api.ts
import type { UserAccount } from "../types"
import { getData, postData } from "../app/axiosClient"
import type { UpdateUserInfoRequest } from "../types/request.type"

export const userApi = {
  getMyProfile:():Promise<UserAccount> =>  getData("/users/me"),
  getUsers: (): Promise<UserAccount[]> => getData("/auth/sign-in"),
  upadateInfo: (payload:UpdateUserInfoRequest): Promise<UserAccount> => postData("/users/update-info",payload),
  upadateAvt: (payload:string): Promise<UserAccount> => postData("/users/update-avt",payload),

}
