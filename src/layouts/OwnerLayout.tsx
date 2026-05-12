// OwnerLayout.tsx
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OwnerLayout.scss";
import { useAppSelector, type RootState } from "../app/store";
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
  CodeSandboxOutlined
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
  // { key: "test", label: "Test", icon: <ExperimentOutlined />, path: "/admin/test" },
];

const OwnerLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userAccount } = useAppSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeKey, setActiveKey] = useState("products");


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

        {/* User */}
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">{userAccount.fullName?.charAt(0).toUpperCase() || "A"}</div>
          {!collapsed && (
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{userAccount.fullName || "Admin"}</span>
              <span className="admin-sidebar__user-role">Owner</span>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default OwnerLayout;