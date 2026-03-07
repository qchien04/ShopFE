import { Button, Spin, Form, Input, Row, Col, DatePicker, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import './RegisterPage.scss';
import { useUserRegister } from "../../hooks/Auth/useUserRegister";
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useUserRegister();
  
  const rules = [
    {
      required: true,
      message: "Vui lòng nhập !",
    },
  ];
  const handleSubmit = (values: any) => {
    const { password2, dob, ...rest } = values;
    const payload = {
      ...rest,
      dob: dob.format('YYYY-MM-DD'),
    };

    register(payload);
  };
 
  
  return (
    <div style={{width:"100%",height:"100%"}}>
      <div className="center-container">
        <Spin spinning={isPending} tip="Đang xử lý ..."
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
        }}>
          <div style={{ 
            background: '#fff', 
            padding: '40px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ textAlign: "center", marginBottom: '8px' }}>Đăng kí tài khoản</h2>
            <Form
              name="register-form"
              layout="vertical"
              onFinish={handleSubmit}
              style={{ width: '800px' }}
            >

              <Row gutter={2}>
                <Col span={12}>
                  <Form.Item label="Tên" name="fullName" rules={rules}>
                    <Input size="large" placeholder="Nhập tên của bạn" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Số điện thoại" name="phoneNumber" rules={rules}>
                    <Input size="large" placeholder="Nhập SDT" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={2}>
                <Col span={12}>
                  <Form.Item label="Email" name="email" rules={rules}>
                    <Input size="large" placeholder="Nhập email của bạn" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dob"
                    rules={[{ required: true, message: 'Chọn ngày sinh' }]}
                  >
                    <DatePicker format="DD/MM/YYYY" size="large" style={{width:"100%",height:"100%"}}/>
                  </Form.Item>
                </Col>
              </Row>


              <Row gutter={2}>
                <Col span={24}>
                  <Form.Item label="Tài khoản" name="username" rules={rules}>
                    <Input size="large" placeholder="Nhập tên đăng nhập" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Mật khẩu" name="password" rules={rules}>
                    <Input.Password size="large" placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Nhập lại mật khẩu"
                    name="password2"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Mật khẩu nhập lại không khớp')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Alert
                title="Lưu ý"
                description="Sau khi đăng ký, vui lòng kiểm tra Gmail và nhấn vào link xác thực để kích hoạt tài khoản."
                type="warning"
                showIcon
                style={{ marginTop: '16px' , marginBottom:"10px"}}
              />


              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={isPending}
                  size="large"
                  block
                >
                  Đăng kí
                </Button>
              </Form.Item>
              
              <div style={{ textAlign: 'center' }}>
                Đã có tài khoản?
              </div>
              
              <Button 
                type="default" 
                onClick={() => navigate("/login")}
                size="large"
                block
              >
                Đăng nhập
              </Button>

            </Form>
          </div>
          
        </Spin>
      </div>
    </div>
    
  );
};

export default RegisterPage;