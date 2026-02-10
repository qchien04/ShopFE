import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import type { LoginPayload, UserAccount } from "../../types";
import { userApi } from "../../api/user.api";
import { setUser } from "../../features/auth/authSlice";
import { antdMessage } from "../../utils/antdMessage";
import { authApi } from "../../api/auth.api";
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const { data: user, refetch: fetchUser } = useQuery<UserAccount, Error>({
    queryKey: ["myProfile"],
    queryFn: () => userApi.getMyProfile(),
    enabled: false,
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
      antdMessage.success("Đăng nhập thành công!");
      navigate("/")
    }
  }, [user, dispatch, navigate]);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: async (data) => {
      if (data.isAuth) {
        localStorage.setItem("jwtToken", data.jwt);
        fetchUser();
      }else {
        antdMessage.error("Đăng nhập thất bại!");
      }
    },
    onError: (error: Error) => {
      antdMessage.error(error.message || "Đã có lỗi xảy ra!");
    },
  });
};