// Banner.tsx
import React from 'react';
import styles from './banner.module.scss';
import slide1 from "../../../../assets/bannerslide1.webp";
import slide2 from "../../../../assets/bannerslide2.webp";
import sideBanner from "../../../../assets/sidebanner.webp";
import { Carousel, Skeleton } from 'antd';
import {
  ShopOutlined,
  ThunderboltOutlined,
  SkinOutlined,
  GiftOutlined,
  SmileOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { BannerConfig, BannerSlot } from '../../../../types/entity.type';
import { adminApi } from '../../../../api/admin.api';

// ─── Types (khớp BannerManager) ──────────────────────────────────────────────


// ─── Fallback data (ảnh tĩnh cũ) ─────────────────────────────────────────────
const FALLBACK_BANNERS: BannerSlot[] = [
  { id: 'main-1', type: 'main',  label: 'Banner chính', image: slide1,      link: '/' },
  { id: 'main-2', type: 'main',  label: 'Banner chính', image: slide2,      link: '/' },
  { id: 'side-1', type: 'side',  label: 'Banner phụ 1', image: sideBanner,  link: '/' },
  { id: 'side-2', type: 'side',  label: 'Banner phụ 2', image: slide1,      link: '/' },
];

const FALLBACK_CATEGORIES: BannerSlot[] = [
  { id: 'cat-1', type: 'category', label: 'Shopee Xử Lý',         icon: 'shop',    link: '/' },
  { id: 'cat-2', type: 'category', label: 'Deal Hot\nGiờ Vàng',   icon: 'thunder', link: '/' },
  { id: 'cat-3', type: 'category', label: 'Shopee Style\nVoucher 30%', icon: 'skin', link: '/' },
  { id: 'cat-4', type: 'category', label: 'Săn Ngay\n100.000 Xu', icon: 'gift',    link: '/' },
  { id: 'cat-5', type: 'category', label: 'Khách Hàng\nThân Thiết', icon: 'smile', link: '/' },
  { id: 'cat-6', type: 'category', label: 'Mã Giảm Giá',           icon: 'dollar', link: '/' },
];

// Map icon string -> Ant Design icon (dùng cho fallback và khi admin chọn preset)
const ICON_MAP: Record<string, React.ReactNode> = {
  shop:    <ShopOutlined />,
  thunder: <ThunderboltOutlined />,
  skin:    <SkinOutlined />,
  gift:    <GiftOutlined />,
  smile:   <SmileOutlined />,
  dollar:  <DollarCircleOutlined />,
};

const renderCategoryIcon = (slot: BannerSlot) => {
  // Nếu admin nhập emoji hoặc ký tự ngắn → render thẳng
  if (slot.icon && slot.icon.length <= 4 && !ICON_MAP[slot.icon]) {
    return <span style={{ fontSize: 22 }}>{slot.icon}</span>;
  }
  // Nếu là key preset → dùng Ant icon
  return ICON_MAP[slot.icon ?? ''] ?? <ShopOutlined />;
};

// ─── API fetch ────────────────────────────────────────────────────────────────
const fetchBannerConfig = async (): Promise<BannerConfig> => {
  const res = await adminApi.getConfigBanner();
  return res;
};

// ─── Banner Component ─────────────────────────────────────────────────────────
const Banner: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['banner-config'],
    queryFn: fetchBannerConfig,
    staleTime: 1000 * 60 * 10,       // cache 10 phút
    retry: false,                     // nếu API lỗi dùng fallback ngay
  });

  // Dùng data từ API nếu có, fallback về ảnh tĩnh
  const mainSlides = (data?.banners ?? FALLBACK_BANNERS).filter(b => b.type === 'main');
  const sideBanners = (data?.banners ?? FALLBACK_BANNERS).filter(b => b.type === 'side');
  const categories  = data?.categories ?? FALLBACK_CATEGORIES;

  if (isLoading) {
    return (
      <section>
        <div className={styles.container}>
          <Skeleton.Image active style={{ width: '100%', height: 415 }} />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className={styles.container}>
        {/* Carousel */}
        <div className={styles.mainBanner}>
          <Carousel
            className={styles.carousel}
            autoplay
            autoplaySpeed={3500}
            pauseOnHover
            dots
            arrows
            draggable
          >
            {mainSlides.map((slide) => (
              <a key={slide.id} href={slide.link ?? '#'} className={styles.slide}>
                <img src={slide.image} alt={slide.label} />
              </a>
            ))}
          </Carousel>
        </div>

        {/* Side banners */}
        <div className={styles.sideBanners}>
          {sideBanners.slice(0, 2).map((s) => (
            <a key={s.id} href={s.link ?? '#'}>
              <img src={s.image} alt={s.label} />
            </a>
          ))}
        </div>
      </div>

      {/* Feature strip */}
      <div className={styles.features}>
        {categories.map((cat) => (
          <a key={cat.id} href={cat.link ?? '#'} className={styles.featureItem}>
            <span className={styles.featureIcon}>
              {renderCategoryIcon(cat)}
            </span>
            <span className={styles.featureText}>
              {cat.label.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Banner;