// user.api.ts
import type { UserAccount } from "../types"
import { getData } from "../app/axiosClient"

export const userApi = {
  getMyProfile:():Promise<UserAccount> =>  getData("/users/me"),
  getUsers: (): Promise<UserAccount[]> => getData("/auth/sign-in"),
}
