import './index.scss';
import Banner from './components/banner';
import Sidebar from './components/sidebar';
import NewProducts from './components/NewProducts';
import BrandShowcase from './components/Brandshowcase';
import HotDeals from './components/Hotdeals';
import CategoryNews from './components/Categorynews';
import FeaturedProducts from './components/FeaturedProducts';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../../api/admin.api';
import type { BannerConfig } from '../../../types/entity.type';

// Cấu hình mặc định trong trường hợp chưa có config từ backend
const DEFAULT_LAYOUT = ['featured_products', 'new_products', 'brand_showcase', 'hot_deals', 'category_news'];

const MainContent = () => {
  const { data: config } = useQuery<BannerConfig>({
    queryKey: ['banner-config'],
    queryFn: () => adminApi.getConfigBanner(),
    staleTime: 1000 * 60 * 5,
  });

  const sections = config && config.productSections && config.productSections.length > 0
    ? config.productSections
    : DEFAULT_LAYOUT.map(id => ({ id, active: true }));

  // Helper để map tới component tương ứng
  const renderSection = (section: any) => {
    if (!section.active) return null;
    switch (section.id) {
      case 'featured_products': return <FeaturedProducts key={section.id} section={section} />;
      case 'new_products': return <NewProducts key={section.id} section={section} />;
      case 'brand_showcase': return (
        <BrandShowcase 
          key={section.id} 
          section={section} 
          brandIds={config?.brandIds} 
        />
      );
      case 'hot_deals': return <HotDeals key={section.id} section={section} />;
      case 'category_news': return <CategoryNews key={section.id} />;
      default: return null;
    }
  };

  // Chia layout: featured_products nẳm cùng cụm ngang Banner, còn lại nằm bên dưới.
  // Ghi chú: Thực ra nếu có drag & drop, thứ tự hiển thị nên được ưu tiên. 
  // Để linh hoạt, ta chỉ lấy thằng đầu tiên bỏ vào `main-area`, các thằng sau đẩy xuống dưới. Hoặc tùy ý.
  // Ở đây giữ chuẩn vị trí cũ của template, nghĩa là khối đầu tiên trong order sẽ luôn đi kèm Banner.

  const topSection = sections.length > 0 ? sections[0] : null;
  const restSections = sections.slice(1);

  return (
    <div className="main-content">
      <div className="content-container">
        {/* Left Sidebar */}
        <Sidebar></Sidebar>

        {/* Main Content Area */}
        <main className="main-area">
          <Banner></Banner>
          {topSection && renderSection(topSection)}
        </main>
      </div>

      <div style={{ width: "100%" }}>
        {restSections.map(section => renderSection(section))}
      </div>

    </div>
  );
};

export default MainContent;
