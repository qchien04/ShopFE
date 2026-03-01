import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { UserAccount } from "../../../types";
import { useAuth } from "../../../hooks/Auth/useAuth";

const { Title, Text } = Typography;
const mockUser: UserAccount = {
  id: 1,
  username: "nguyenvana",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  roles: ["USER"],
  avt: "",
  dob: "1999-05-20",
};
// ── Giả lập user hiện tại, thay bằng hook thực tế ──

const ProfilePage = () => {
  const {user}=useAuth();
  const [infoForm] = Form.useForm();
  const [pwForm] = Form.useForm();

  const handleUpdateInfo = (values: UserAccount) => {
    console.log("Update info:", values);
    message.success("Cập nhật thông tin thành công!");
  };

  const handleChangePassword = (values: {
    currentPassword: string;
    newPassword: string;
  }) => {
    console.log("Change password:", values);
    message.success("Đổi mật khẩu thành công!");
    pwForm.resetFields();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── AVATAR + TÊN ──────────────────────────── */}
      <Card variant="borderless" style={{ textAlign: "center", paddingBottom: 8 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar
            size={88}
            src={user!.avt || undefined}
            icon={user!.avt && <UserOutlined />}
            style={{ background: "#00b96b", fontSize: 36 }}
          />
          <button
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #e0e0e0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <CameraOutlined style={{ fontSize: 13, color: "#555" }} />
          </button>
        </div>

        <Title level={5} style={{ margin: "12px 0 2px" }}>
          {mockUser.fullName}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          @{mockUser.username}
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
            fullName: mockUser.fullName,
            email: mockUser.email,
            dob: mockUser.dob ? dayjs(mockUser.dob) : undefined,
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
            <Input placeholder="Email" size="large" />
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
              style={{ background: "#00b96b", borderColor: "#00b96b", minWidth: 140 }}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* ── ĐỔI MẬT KHẨU ──────────────────────────── */}
      <Card
        title={
          <span>
            <LockOutlined style={{ marginRight: 8, color: "#00b96b" }} />
            Đổi mật khẩu
          </span>
        }
        variant="borderless"
      >
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