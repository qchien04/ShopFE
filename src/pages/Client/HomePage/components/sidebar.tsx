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

import styles from './sidebar.module.scss';

const menuItems = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: 'Trang Chủ',
  },
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: 'Sản Phẩm',
    children: [
      { key: 'adapters', label: 'Adapter - Bộ Sạc - Nguồn' },
      { key: 'transformers', label: 'Biến Áp' },
      { key: 'boards', label: 'Board Mạch' },
      { key: 'capacitors', label: 'Các Loại Tụ' },
    ],
  },
  {
    key: 'marketplace',
    icon: <ShoppingOutlined />,
    label: 'Sàn Thương Mại Điện Tử',
    children: [
      { key: 'shopee', label: 'Shopee' },
      { key: 'lazada', label: 'Lazada' },
      { key: 'tiktok', label: 'Tiktok' },
    ],
  },
  {
    key: 'promotions',
    icon: <GiftOutlined />,
    label: 'Chương Trình Khuyến Mãi',
  },
  {
    key: 'blog',
    icon: <ReadOutlined />,
    label: 'Bài Viết',
  },
];

const Sidebar = () => {
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

      {/* TRENDING SEARCH */}
      <div className={styles.trendingSearch}>
        <div className={styles.searchHeader}>
          <SearchOutlined />
          <h4>Xu hướng tìm kiếm</h4>
        </div>

        <div className={styles.searchTags}>
          <div className={styles.searchTag}>Hộp Nhựa</div>
          <div className={styles.searchTag}>Fe Sắt Silic</div>
          <div className={styles.searchTag}>Khuôn Nhựa</div>
          <div className={styles.searchTag}>Hộp Nhựa</div>
          <div className={styles.searchTag}>Fe Sắt Silic</div>
          <div className={styles.searchTag}>Khuôn Nhựa</div>
          <div className={styles.searchTag}>Hộp Nhựa</div>
          <div className={styles.searchTag}>Fe Sắt Silic</div>
          <div className={styles.searchTag}>Khuôn Nhựa</div>
          <div className={styles.searchTag}>Hộp Nhựa</div>
          <div className={styles.searchTag}>Fe Sắt Silic</div>
        </div>
      </div>

      {/* SOCIAL CONTACT */}
      <div className={styles.socialContacts}>
        <Tooltip title="Chat Zalo">
          <Button
            type="primary"
            shape="circle"
            size="large"
            className={styles['zalo-btn']}
            icon={<CustomerServiceOutlined />}
          />
        </Tooltip>

        <Tooltip title="Messenger">
          <Button
            type="primary"
            shape="circle"
            size="large"
            className={styles['messenger-btn']}
            icon={<MessageOutlined />}
          />
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
