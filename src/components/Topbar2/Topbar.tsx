import { useState } from 'react';
import { Input, Badge, Dropdown, type MenuProps } from 'antd';
import logo from '../../assets/logo.png';
import logoShort from '../../assets/logoshort.png';
import { 
  SearchOutlined, 
  HeartOutlined, 
  UserOutlined, 
  ShoppingCartOutlined,
  DownOutlined 
} from '@ant-design/icons';
import './Topbar.scss';
import { queryClient } from '../../app/queryClient';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector, type RootState } from '../../app/store';
import { useCategoryParentList } from '../../hooks/Category/useCategotyList';
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";


const TopBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const {data:categories} = useCategoryParentList();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {userAccount,isAuthenticated} = useAppSelector((state:RootState)=>state.auth);

  const [keyword, setKeyword] = useState("");
  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    queryClient.clear();
    navigate("/login");
  };

  const handlePosts = () => {
    navigate("/post");
  };

  
  const handleDashboard = () => {
    console.log(userAccount)
    console.log(userAccount?.roles?.length)
    if(!isAuthenticated) navigate("/login");
    if(userAccount?.roles?.length == 0) navigate("/user/profile");
    if(userAccount?.roles?.length &&
      userAccount?.roles?.length>0 &&
      userAccount?.roles[0]=='ADMIN'
    ) navigate("/admin/address");
    setCartCount(0);
  };

  const handleCart = () => {
    navigate("/cart");
  };

  // Menu cho dropdown Sản Phẩm
  const productItems: MenuProps['items'] = categories
  ? categories.map((category) => ({
      key: `parent-${category.id}`,
      label: (
        <span
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/category/${category.id}`);
          }}
        >
          {category.name}
        </span>
      ),
      children: category.children?.map((c) => ({
        key: `child-${c.id}`,
        label: c.name,
      })),
    }))
  : [];

  const marketplaceItems: MenuProps['items'] = [
    { key: '1', label: 'Shopee' },
    { key: '2', label: 'Lazada' },
    { key: '3', label: 'Tiktok' },
  ];

  const promotionItems: MenuProps['items'] = [
    { key: '1', label: 'Quyền Lợi Thành Viên' },
    { key: '2', label: 'Chương Trình Miễn Phí Vận Chuyển' },
  ];

  const blogItems: MenuProps['items'] = [
    { key: '1', label: 'Mẹo Vặt' },
    { key: '2', label: 'Hướng Dẫn Sử Dụng Sản Phẩm' },
    { key: '3', label: 'Tin tức' },
  ];


  const accountItems: MenuProps["items"] = isAuthenticated
  ? [
      {
        key: "user-info",
        disabled: true,
        label: (
          <div style={{ padding: "4px 8px" }}>
            <div style={{ fontWeight: 600 }}>
              {userAccount?.username || "User"}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {userAccount?.email}
            </div>
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ",
        onClick: handleDashboard,
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        onClick: () => navigate("/user/profile"),
      },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
      },
    ]
  : [
      {
        key: "login",
        icon: <UserOutlined />,
        label: "Đăng nhập",
        onClick: () => navigate("/login"),
      },
    ];


  return (
    <div className="topbar">
      {/* Top Header - Nền xanh lá */}
      <div className="topbar-header">
        <div className="topbar-container">
          {/* Logo */}
          <div className="topbar-logo">
            <div className="logo-icon" onClick={()=>navigate("/")}>
                <img src={logo} className="logo-full" />
                <img src={logoShort} className="logo-short" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="topbar-search">
            <Input
              className="search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
              suffix={
                <button 
                  className="search-btn"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </button>
              }
            />
          </div>

          {/* Right Actions */}
          <div className="topbar-actions">
            <div className="action-item">
              <HeartOutlined className="action-icon" />
              <span className="action-text">Yêu thích</span>
            </div>
            
            <Dropdown
              menu={{ items: accountItems }}
              trigger={['hover']}
            >
              <div className="action-item" style={{ cursor: 'pointer' }}>
                <UserOutlined className="action-icon" />
                <span className="action-text">Tài khoản</span>
              </div>
            </Dropdown>
            
            <div className="action-item" onClick={handleCart}>
              <Badge count={cartCount} showZero>
                <ShoppingCartOutlined className="action-icon" />
              </Badge>
              <span className="action-text">Giỏ hàng</span>
            </div>
          </div>
        </div>
      </div>

      <div className="topbar-nav">
        <div className="topbar-container">
          <nav className="nav-menu">
            <a href="#" className="nav-item" onClick={()=>navigate("/")}>Trang Chủ</a>
            <a href="#" className="nav-item" onClick={()=>navigate("/about")}>Giới Thiệu</a>
            
            <Dropdown
              trigger={['hover']}
              menu={{
                items: productItems,
                onClick: ({ key }) => {
                  const id = key.split('-')[1];
                  navigate(`/category/${id}`);
                },
                style: {
                  maxHeight: "300px",
                  overflowY: "auto",
                },
              }}
            >
              <span className="nav-item nav-dropdown" style={{ cursor: "pointer" }}>
                Sản Phẩm <DownOutlined />
              </span>
            </Dropdown>
            
            <a href="#" className="nav-item">Kiểm Tra Đơn Hàng</a>
            
            <Dropdown menu={{items:marketplaceItems}} trigger={['hover']}>
              <a href="#" className="nav-item nav-dropdown">
                Sàn Thương Mại Điện Tử <DownOutlined />
              </a>
            </Dropdown>
            
            <Dropdown menu={{items:promotionItems}} trigger={['hover']}>
              <a href="#" className="nav-item nav-dropdown">
                Chương Trình Khuyến Mãi <DownOutlined />
              </a>
            </Dropdown>
            
            <Dropdown menu={{items:blogItems}} trigger={['hover']}>
              <a href="#" onClick={handlePosts} className="nav-item nav-dropdown">
                Bài Viết <DownOutlined />
              </a>
            </Dropdown>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TopBar;