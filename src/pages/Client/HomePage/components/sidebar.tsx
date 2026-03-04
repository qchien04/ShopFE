import { Menu, Button, Tooltip } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  GiftOutlined,
  ReadOutlined,
  SearchOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import styles from './sidebar.module.scss';
import type { BannerConfig, BannerSlot } from '../../../../types/entity.type';
import { adminApi } from '../../../../api/admin.api';

const staticMenuItems = [
  { key: 'home', icon: <HomeOutlined />, label: 'Trang Chủ' },
  { key: 'marketplace', icon: <ShoppingOutlined />, label: 'Sàn Thương Mại Điện Tử',
    children: [
      { key: 'shopee', label: 'Shopee' },
      { key: 'lazada', label: 'Lazada' },
      { key: 'tiktok', label: 'Tiktok' },
    ],
  },
  { key: 'promotions', icon: <GiftOutlined />, label: 'Chương Trình Khuyến Mãi' },
  { key: 'blog',       icon: <ReadOutlined />, label: 'Bài Viết' },
];

const Sidebar = () => {
  const { data } = useQuery<BannerConfig>({
    queryKey: ['banner-config'],  
    queryFn: () => adminApi.getConfigBanner(),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  // ── Lấy quick-top để build menu danh mục động ──
  const quickTopItems = data?.quickTopOption?.filter((b) => b.type === 'quick-top') ?? [];
  const quickBottomItems = data?.quickBottomOption?.filter((b) => b.type === 'quick-bottom') ?? [];

  // Build menu items: quick-top thành submenu "Sản Phẩm", children từ slot.children
  const productMenu = quickTopItems.length
    ? [{
        key: 'products',
        icon: <AppstoreOutlined />,
        label: 'Sản Phẩm',
        children: quickTopItems.map((item: BannerSlot) => ({
          key: item.id,
          label: (
            <a href={item.link} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </a>
          ),
          // nếu item có children (dropdown) thì render tiếp cấp 3
          ...(item.children?.length ? {
            children: item.children.map((child) => ({
              key: child.id,
              label: (
                <a href={child.link} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {child.icon && <span>{child.icon}</span>}
                  {child.label}
                </a>
              ),
            })),
          } : {}),
        })),
      }]
    : [{ // fallback nếu chưa có data
        key: 'products',
        icon: <AppstoreOutlined />,
        label: 'Sản Phẩm',
        children: [
          { key: 'adapters',     label: 'Adapter - Bộ Sạc - Nguồn' },
          { key: 'transformers', label: 'Biến Áp' },
          { key: 'boards',       label: 'Board Mạch' },
          { key: 'capacitors',   label: 'Các Loại Tụ' },
        ],
      }];

  const menuItems = [staticMenuItems[0], ...productMenu, ...staticMenuItems.slice(1)];

  return (
    <aside className={styles.sidebar}>
      {/* MENU */}
      <div className={styles.sidebarMenu}>
        <div className={styles.menuHeader}>
          <AppstoreOutlined />
          <h3>Danh Mục Sản Phẩm</h3>
        </div>

        <Menu
          mode="inline"
          className={styles.categoryMenu}
          defaultSelectedKeys={['home']}
          items={menuItems}
        />
      </div>

      {/* TRENDING SEARCH — từ quick-bottom */}
      <div className={styles.trendingSearch}>
        <div className={styles.searchHeader}>
          <SearchOutlined />
          <h4>Xu hướng tìm kiếm</h4>
        </div>

        <div className={styles.searchTags}>
          {quickBottomItems.length
            ? quickBottomItems.map((item) => (
                <a key={item.id} href={item.link} className={styles.searchTag}>
                  {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
                  {item.label}
                </a>
              ))
            : // fallback
              ['Hộp Nhựa', 'Fe Sắt Silic', 'Khuôn Nhựa'].map((t) => (
                <div key={t} className={styles.searchTag}>{t}</div>
              ))
          }
        </div>
      </div>

      {/* SOCIAL CONTACT */}
      <div className={styles.socialContacts}>
        <Tooltip title="Chat Zalo">
          <Button type="primary" shape="circle" size="large"
            className={styles['zalo-btn']} icon={<CustomerServiceOutlined />} />
        </Tooltip>
        <Tooltip title="Messenger">
          <Button type="primary" shape="circle" size="large"
            className={styles['messenger-btn']} icon={<MessageOutlined />} />
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;