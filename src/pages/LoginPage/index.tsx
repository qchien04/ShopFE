import { Button, Spin, Form, Input } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { LoginPayload } from "../../types";
import welcome from '../../assets/welcome.png';
import { GoogleOutlined } from "@ant-design/icons";
import './Signin.scss';
import { useEffect } from "react";
import { antdMessage } from "../../utils/antdMessage";
import { useLogin } from "../../hooks/Auth/useLogin";
import { useGoogleOAuth } from "../../hooks/Auth/useGoogleOAuth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const  handleGGLogin= useGoogleOAuth();
  const [searchParams] = useSearchParams();

  useEffect(()=>{
    const verified = searchParams.get("verified");
    if(verified === "true") {
      antdMessage.success("Kích hoạt thành công, vui lòng đăng nhập lại!");
    } else if (verified === "false") {
      antdMessage.error("Kích hoạt thất bại, vui lòng thử lại!");
    }
  },[])
  

  const rules = [
    {
      required: true,
      message: "Vui lòng nhập !",
    },
  ];
  const handleSubmit = async (values: LoginPayload) => {
    login(values);
  };
 
  
  return (
    <div style={{width:"100%",height:"100%"}}>
      <div className="center-container">
        <Spin spinning={isPending} tip="Đang xử lý đăng nhập...">
          <div style={{ 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div className="login-content">
              <div className="form-ui">
                <h2 style={{ textAlign: "center", marginBottom: '8px' }}>Chào mừng đến với</h2>
                <p style={{ 
                  fontSize: 25, 
                  fontWeight: 700, 
                  color: "red", 
                  textAlign: "center",
                  marginBottom: '32px'
                }}>
                  FaceBug
                </p>
                
                <Form
                  name="login-form"
                  layout="vertical"
                  onFinish={handleSubmit}
                  style={{ width: '400px' }}
                >
                  <Form.Item label="Tài khoản" name="username" rules={rules}>
                    <Input size="large" placeholder="Nhập tên đăng nhập" />
                  </Form.Item>

                  <Form.Item label="Mật khẩu" name="password" rules={rules}>
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={isPending}
                      size="large"
                      block
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                  
                  <div style={{ textAlign: 'center' }}>
                    Chưa có tài khoản?
                  </div>
                  
                  <Button 
                    type="default" 
                    onClick={() => navigate("/register")}
                    size="large"
                    block
                  >
                    Đăng kí
                  </Button>

                  <Button
                    style={{ marginTop: 10 }}
                    type="primary"
                    size="large"
                    icon={<GoogleOutlined/>}
                    onClick={handleGGLogin}
                    variant='filled' 
                    block
                    shape='round' 
                  >
                    Đăng nhập với tài khoản Google 
                  </Button>
                </Form>
              </div>

              <div className="welcome-img">
                <img src={welcome} alt="welcome" />
              </div>
            </div>
            
          </div>
          
        </Spin>
      </div>
    </div>
  );
};

export default LoginPage;