
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { authApi } from "../../api/auth.api";
import type { UserRegisterPayLoad } from "../../types";
import { antdMessage } from "../../utils/antdMessage";

export const useUserRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (payload: UserRegisterPayLoad) => authApi.userRegister(payload),
    onSuccess: async (data) => {
      if (data.status) {
        notification.success({
          message: "Đăng ký thành công",
          description: data.message,
          duration: 3,
        });
        navigate("/login")
      }
    },
    onError: (error: Error) => {
      antdMessage.error(error.message || "Đã có lỗi xảy ra!");
    },
  });
};