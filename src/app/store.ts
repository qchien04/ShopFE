import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux"

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: import.meta.env.DEV
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
