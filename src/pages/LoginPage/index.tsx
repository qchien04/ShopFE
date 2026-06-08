import { Button, Spin, Form, Input, Divider } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { LoginPayload } from "../../types";
import { GoogleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import './Signin.scss';
import { useEffect, useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { antdMessage } from "../../utils/antdMessage";
import { useLogin } from "../../hooks/Auth/useLogin";
import { useGoogleOAuth } from "../../hooks/Auth/useGoogleOAuth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const { handleLoginGG, loading } = useGoogleOAuth();
  const [searchParams] = useSearchParams();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      antdMessage.success("Kích hoạt thành công, vui lòng đăng nhập lại!");
    } else if (verified === "false") {
      antdMessage.error("Kích hoạt thất bại, vui lòng thử lại!");
    }
  }, []);

  const rules = [{ required: true, message: "Vui lòng nhập thông tin!" }];

  const handleSubmit = async (values: LoginPayload) => {
    login(values);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* LEFT - FORM */}
        <div className="login-left">
          <Spin spinning={isPending || loading} tip="Đang xử lý đăng nhập...">
            <div className="login-card">
              <h2>Đăng nhập</h2>

              <Form layout="vertical" onFinish={handleSubmit} size="large">
                <Form.Item name="username" rules={rules}>
                  <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
                </Form.Item>

                <Form.Item name="password" rules={rules}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  block
                  className="login-btn"
                >
                  Đăng nhập
                </Button>
                <div className="register-text">
                  <a onClick={() => setIsForgotModalOpen(true)}>Quên mật khẩu?</a>
                </div>
                <Divider plain>Hoặc</Divider>

                <Button
                  icon={<GoogleOutlined />}
                  onClick={handleLoginGG}
                  block
                  className="google-btn"
                >
                  Đăng nhập với Google
                </Button>

                <div className="register-text">
                  Chưa có tài khoản?{" "}
                  <span onClick={() => navigate("/register")}>
                    Đăng ký ngay
                  </span>
                </div>
              </Form>
              <ForgotPasswordModal open={isForgotModalOpen} onCancel={() => setIsForgotModalOpen(false)} />
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;