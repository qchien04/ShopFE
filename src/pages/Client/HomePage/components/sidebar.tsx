import { Menu } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  GiftOutlined,
  ReadOutlined,
  SearchOutlined,
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

  const quickTopItems = data?.quickTopOption?.filter((b) => b.type === 'quick-top') ?? [];
  const quickBottomItems = data?.quickBottomOption?.filter((b) => b.type === 'quick-bottom') ?? [];

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
    : [{ 
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
            :
              ['Hộp Nhựa', 'Fe Sắt Silic', 'Khuôn Nhựa'].map((t) => (
                <div key={t} className={styles.searchTag}>{t}</div>
              ))
          }
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;