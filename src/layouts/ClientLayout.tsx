import { Tabs, Avatar, Typography } from "antd";
import { HomeOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Text } = Typography;

const NAV_ITEMS = [
  { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
  { key: "address", icon: <HomeOutlined />, label: "Địa chỉ" },
  { key: "orders", icon: <ShoppingOutlined />, label: "Đơn hàng" },
];

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split("/")[2] || "address";

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      {/* User info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          padding: "16px",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Avatar
          size={48}
          icon={<UserOutlined />}
          style={{ background: "#00b96b", flexShrink: 0 }}
        />
        <div>
          <Text strong style={{ display: "block" }}>
            Nguyễn Văn A
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Thành viên
          </Text>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "0 16px 16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Tabs
          activeKey={selectedKey}
          onChange={(key) => navigate(`/user/${key}`)}
          items={NAV_ITEMS.map((item) => ({
            key: item.key,
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {item.icon}
                {item.label}
              </span>
            ),
            children: <Outlet />,
          }))}
        />
      </div>
    </div>
  );
};

export default ClientLayout;