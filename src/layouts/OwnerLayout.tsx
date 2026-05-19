// OwnerLayout.tsx
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OwnerLayout.scss";
import { useAppSelector, useAppDispatch, type RootState } from "../app/store";
import { logout } from "../features/auth/authSlice";
import { authApi } from "../api/auth.api";
import { antdMessage } from "../utils/antdMessage";
import { Dropdown, Modal, Form, Input, Button } from "antd";
import {
  DashboardOutlined,
  SkinOutlined,
  AppstoreOutlined,
  TagOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CommentOutlined,
  MessageOutlined,
  SettingOutlined,
  ExperimentOutlined,
  SearchOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CodeSandboxOutlined,
  KeyOutlined,
  LogoutOutlined,
  LockOutlined
} from "@ant-design/icons";

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { key: "dashboard", label: "Tổng quan", icon: <DashboardOutlined />, path: "/admin/dashboard" },
  { key: "products", label: "Sản phẩm", icon: <SkinOutlined />, path: "/admin/products" },
  { key: "categories", label: "Danh mục", icon: <AppstoreOutlined />, path: "/admin/categories" },
  { key: "brands", label: "Thương hiệu", icon: <TagOutlined />, path: "/admin/brands" },
  { key: "orders", label: "Đơn hàng", icon: <ShoppingCartOutlined />, path: "/admin/orders" },
  { key: "coupons", label: "Voucher", icon: <ExperimentOutlined />, path: "/admin/coupons" },
  { key: "post", label: "Bài viết", icon: <FileTextOutlined />, path: "/admin/post" },
  { key: "reviews", label: "Bình luận", icon: <CommentOutlined />, path: "/admin/reviews" },
  { key: "chat-manager", label: "Chat", icon: <MessageOutlined />, path: "/admin/chat-manager" },
  { key: "configs", label: "Cài đặt", icon: <SettingOutlined />, path: "/admin/configs" },
];

const OwnerLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, userAccount } = useAppSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("products");

  // State for Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [pwForm] = Form.useForm();
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePasswordSubmit = async (values: any) => {
    setPwLoading(true);
    try {
      const res = await authApi.changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      antdMessage.success(res.message || "Đổi mật khẩu thành công!");
      pwForm.resetFields();
      setIsChangePasswordOpen(false);
    } catch (error: any) {
      console.error(error);
      antdMessage.error(error.message || "Đổi mật khẩu thất bại!");
    } finally {
      setPwLoading(false);
    }
  };

  if (!isAuthenticated || !userAccount) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userAccount.roles?.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const matched = navItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (matched) setActiveKey(matched.key);
  }, [location.pathname]);

  const handleNav = (item: NavItem) => {
    setActiveKey(item.key);
    navigate(item.path);
  };

  return (
    <div className={`admin-shell ${collapsed ? "admin-shell--collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <span className="admin-sidebar__logo-icon"><CodeSandboxOutlined /></span>
            {!collapsed && <span className="admin-sidebar__logo-text">AdminHub</span>}
          </div>
          <button
            className="admin-sidebar__toggle"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Divider */}
        <div className="admin-sidebar__divider" />

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {!collapsed && (
            <span className="admin-sidebar__nav-section">Quản lý</span>
          )}
          <ul className="admin-sidebar__list">
            {navItems.map((item) => (
              <li
                key={item.key}
                className={`admin-sidebar__item ${activeKey === item.key ? "admin-sidebar__item--active" : ""
                  }`}
                onClick={() => handleNav(item)}
                title={collapsed ? item.label : undefined}
              >
                <span className="admin-sidebar__item-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="admin-sidebar__item-label">{item.label}</span>
                )}
                {activeKey === item.key && (
                  <span className="admin-sidebar__item-indicator" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Dropdown */}
        <Dropdown
          menu={{
            items: [
              {
                key: "change-password",
                label: "Đổi mật khẩu",
                icon: <KeyOutlined />,
                onClick: () => setIsChangePasswordOpen(true),
              },
              {
                type: "divider",
              },
              {
                key: "logout",
                label: "Đăng xuất",
                icon: <LogoutOutlined />,
                danger: true,
                onClick: () => {
                  dispatch(logout());
                  navigate("/login");
                  antdMessage.success("Đã đăng xuất thành công!");
                },
              },
            ],
          }}
          trigger={["click"]}
          placement="topRight"
        >
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{userAccount.fullName?.charAt(0).toUpperCase() || "A"}</div>
            {!collapsed && (
              <div className="admin-sidebar__user-info">
                <span className="admin-sidebar__user-name">{userAccount.fullName || "Admin"}</span>
                <span className="admin-sidebar__user-role">Owner</span>
              </div>
            )}
          </div>
        </Dropdown>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__breadcrumb">
            <span className="admin-topbar__breadcrumb-root">Admin</span>
            <span className="admin-topbar__breadcrumb-sep">/</span>
            <span className="admin-topbar__breadcrumb-current">
              {navItems.find((i) => i.key === activeKey)?.label ?? "Dashboard"}
            </span>
          </div>
          <div className="admin-topbar__actions">
            <div className="admin-topbar__search">
              <span className="admin-topbar__search-icon"><SearchOutlined /></span>
              <input
                className="admin-topbar__search-input"
                placeholder="Tìm kiếm..."
              />
            </div>
            <div className="admin-topbar__notif"><BellOutlined /></div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* Change Password Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-heading)' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--sidebar-accent)',
              fontSize: 16
            }}>
              <LockOutlined />
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Đổi mật khẩu Admin</span>
          </div>
        }
        open={isChangePasswordOpen}
        onCancel={() => {
          setIsChangePasswordOpen(false);
          pwForm.resetFields();
        }}
        footer={null}
        width={420}
        destroyOnClose
        centered
        className="change-password-modal"
      >
        <div style={{ marginTop: 20 }}>
          <Form
            form={pwForm}
            layout="vertical"
            onFinish={handleChangePasswordSubmit}
          >
            <Form.Item
              name="currentPassword"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Mật khẩu hiện tại</span>}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
            >
              <Input.Password placeholder="Mật khẩu hiện tại" size="large" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Mật khẩu mới</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }
              ]}
            >
              <Input.Password placeholder="Mật khẩu mới" size="large" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span style={{ fontWeight: 600, color: '#374151' }}>Xác nhận mật khẩu mới</span>}
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value)
                      return Promise.resolve();
                    return Promise.reject("Mật khẩu không khớp!");
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  pwForm.resetFields();
                }}
                size="large"
                style={{ marginRight: 8, borderRadius: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={pwLoading}
                style={{
                  background: 'var(--sidebar-accent)',
                  borderColor: 'var(--sidebar-accent)',
                  borderRadius: 8,
                  fontWeight: 600
                }}
              >
                Lưu mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerLayout;