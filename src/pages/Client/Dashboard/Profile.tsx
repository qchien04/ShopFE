import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Typography,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { authApi } from "../../../api/auth.api";
import { antdMessage } from "../../../utils/antdMessage";
import { useState } from "react";
import { userApi } from "../../../api/user.api";
import { useAppDispatch, useAppSelector, type RootState } from "../../../app/store";
import { setUser } from "../../../features/auth/authSlice";
import { Upload } from "antd";
import { BASE_URL } from "../../../app/const";
import axios from "axios";
import type { UserAccount } from "../../../types";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const {userAccount}= useAppSelector(
    (state: RootState) => state.auth
  );
  const [infoForm] = Form.useForm();
  const [pwForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  console.log(userAccount)
  const handleUpdateInfo =async ( values: any) => {
    setLoading(true);
    try {
      const res = await userApi.upadateInfo({
        fullName: values.fullName,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      }); 
      dispatch(setUser(res));

      antdMessage.success("Đổi thông tin thành công!");
    } catch (error: any) {
      antdMessage.error(
        error.message || "Đổi thông tin thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      const res=await authApi.changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      antdMessage.success(res.message);
      pwForm.resetFields();
    } catch (error: any) {
      antdMessage.error(
        error.message || "Đổi mật khẩu thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file); // đổi key nếu backend yêu cầu khác

    const res = await axios.post(
      `${BASE_URL}/upload/image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return res.data.imageUrl as string;
  };


  const handleThumbUpload = async (file: File): Promise<boolean> => {
    try {
      const url = await uploadImage(file);
      const newU:UserAccount={
        ...userAccount!,
        avt: url,
      }
      dispatch(
        setUser(newU)
      );
      userApi.upadateAvt(url);
      
      antdMessage.success('Upload ảnh đại diện thành công!');
    } catch {
      antdMessage.error('Upload thất bại!');
    }
    return false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── AVATAR + TÊN ──────────────────────────── */}
      <Card
        variant="borderless"
        style={{ textAlign: "center", paddingBottom: 8 }}
      >
        <Upload
          showUploadList={false}
          beforeUpload={(f: File) => { handleThumbUpload(f); return false; }} 
          accept="image/*"
          maxCount={1}
        >
          <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
            <Avatar
              size={88}
              src={userAccount!.avt || undefined}
              icon={!userAccount!.avt && <UserOutlined />}
              style={{ background: "#00b96b", fontSize: 36 }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <CameraOutlined style={{ fontSize: 13, color: "#555" }} />
            </div>
          </div>
        </Upload>

        <Title level={5} style={{ margin: "12px 0 2px" }}>
          {userAccount!.fullName}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          @{userAccount!.username}
        </Text>
      </Card>

      {/* ── THÔNG TIN CÁ NHÂN ─────────────────────── */}
      <Card
        title={
          <span>
            <UserOutlined style={{ marginRight: 8, color: "#00b96b" }} />
            Thông tin cá nhân
          </span>
        }
        variant="borderless"
      >
        <Form
          form={infoForm}
          layout="vertical"
          initialValues={{
            fullName: userAccount!.fullName,
            email: userAccount!.email,
            dob: userAccount!.dob ? dayjs(userAccount!.dob) : undefined,
          }}
          onFinish={handleUpdateInfo}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="Họ và tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input disabled placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{ background: "#00b96b", borderColor: "#00b96b", minWidth: 140 }}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title={
          <span>
            <LockOutlined style={{ marginRight: 8, color: "#00b96b" }} />
            Đổi mật khẩu
          </span>
        }
        variant="borderless"
      >
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          title="Lưu ý dành cho tài khoản đăng nhập bằng Google"
          description="Nếu bạn đăng nhập bằng Google, hãy đổi mật khẩu. Mật khẩu mặc định của bạn nằm trong email tôi đã gửi."
        />
        <Form
          form={pwForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
          >
            <Input.Password placeholder="Mật khẩu hiện tại" size="large" />
          </Form.Item>

          <Divider dashed style={{ margin: "8px 0 16px" }} />

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Tối thiểu 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu mới" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value)
                    return Promise.resolve();
                  return Promise.reject("Mật khẩu không khớp");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              danger
              loading={loading}
              style={{ minWidth: 140 }}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;