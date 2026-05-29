import React, { useState } from 'react';
import { Modal, Form, Input, Button, Steps, message } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { authApi } from '../../api/auth.api';

interface ForgotPasswordModalProps {
  open: boolean;
  onCancel: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRequestOTP = async (values: { email: string }) => {
    try {
      setLoading(true);
      await authApi.forgotPassword(values.email);
      setEmail(values.email);
      setCurrentStep(1);
      message.success('Mã OTP đã được gửi đến email của bạn!');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      message.success('Đặt lại mật khẩu thành công!');
      handleCancel();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setEmail('');
    onCancel();
  };

  return (
    <Modal
      title="Quên mật khẩu"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        items={[
          { title: 'Nhập Email' },
          { title: 'Đặt lại mật khẩu' },
        ]}
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <Form form={form} layout="vertical" onFinish={handleRequestOTP}>
          <Form.Item
            name="email"
            label="Địa chỉ Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Gửi mã xác nhận
          </Button>
        </Form>
      )}

      {currentStep === 1 && (
        <Form form={form} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
          >
            <Input prefix={<SafetyCertificateOutlined />} placeholder="Nhập mã OTP gồm 6 chữ số" size="large" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Đặt lại mật khẩu
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
