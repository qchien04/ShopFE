import './index.scss';
import Banner from './components/banner';
import Sidebar from './components/sidebar';
import NewProducts from './components/NewProducts';
import BrandShowcase from './components/Brandshowcase';
import HotDeals from './components/Hotdeals';
import FeaturedProducts from './components/FeaturedProducts';
import CustomCategory from './components/CustomCategory';
import FeaturedCategories from './components/FeaturedCategories';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../api/admin.api';
import type { HomePageConfig } from '../../../types/entity.type';
import SectionNews from './components/Categorynews';

// Cấu hình mặc định trong trường hợp chưa có config từ backend
const DEFAULT_LAYOUT = ['featured_products', 'new_products', 'brand_showcase', 'hot_deals', 'featured_categories', 'news'];

const MainContent = () => {
  const { data: config } = useQuery<HomePageConfig>({
    queryKey: ['banner-config'],
    queryFn: () => adminApi.getConfigBanner(),
    staleTime: 1000 * 60 * 5,
  });

  const renderSection = (id: string) => {
    switch (id) {
      case 'featured_products':
        return config?.featuredProducts?.active && <FeaturedProducts key={id} section={config.featuredProducts} />;
      case 'featured_categories':
        return config?.featuredCategories?.active && <FeaturedCategories key={id} section={config.featuredCategories} />;
      case 'new_products':
        return config?.newProducts?.active && <NewProducts key={id} section={config.newProducts} />;
      case 'brand_showcase':
        return config?.brandShowcase?.active && <BrandShowcase key={id} section={config.brandShowcase} />;
      case 'hot_deals':
        return config?.hotDeals?.active && <HotDeals key={id} section={config.hotDeals} />;
      case 'news':
        return config?.news?.active && <SectionNews key={id} section={config.news} />;
      default:
        if (id.startsWith('cat_sec_')) {
          const catSec = config?.categorySections?.find(c => c.id === id);
          return catSec?.active && <CustomCategory key={id} section={catSec} />;
        }
        return null;
    }
  };

  let layout = config?.layout?.length ? [...config.layout] : [...DEFAULT_LAYOUT];
  if (!layout.includes('featured_categories')) {
    layout.splice(1, 0, 'featured_categories');
  }

  // Giữ featured_products ở trên cùng khu vực bên phải sidebar nếu nó là top 1. Nếu không thì cho xuống dưới
  const topSectionId = layout.includes('featured_products') ? 'featured_products' : null;
  const bottomSections = layout.filter(id => id !== 'featured_products');

  return (
    <div className="main-content">
      <div className="content-container">
        {/* Left Sidebar */}
        <Sidebar config={config}></Sidebar>

        {/* Main Content Area */}
        <main className="main-area">
          <Banner banners={config?.banners}></Banner>
          {topSectionId && renderSection(topSectionId)}
        </main>
      </div>

      <div style={{ width: "100%" }}>
        {bottomSections.map(id => renderSection(id))}
      </div>
    </div>
  );
};

export default MainContent;
