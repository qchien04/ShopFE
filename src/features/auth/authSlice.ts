import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { AuthState,UserAccount } from "../../types"

const initialState: AuthState = {
  userAccount: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userAccount = action.payload.userAccount;
    },
    setUser(state, action: PayloadAction<UserAccount>) {
      state.userAccount = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      localStorage.removeItem('jwtToken');
      console.log("xoa ne")
      state.userAccount = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
