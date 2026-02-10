import './index.scss';
import Banner from './components/banner';
import Sidebar from './components/sidebar';
import FeaturedProducts from './components/FeaturedProducts';
import NewProducts from './components/NewProducts';
import BrandShowcase from './components/Brandshowcase';
import HotDeals from './components/Hotdeals';
import CategoryNews from './components/Categorynews';

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="content-container">
        {/* Left Sidebar */}
        <Sidebar></Sidebar>

        {/* Main Content Area */}
        <main className="main-area">
            <Banner></Banner>
            <div style={{ width: "100%" }}>
              <FeaturedProducts />
            </div>
        </main>
      </div>

      <div style={{maxWidth:1500,padding:40}}>
        <NewProducts />
        <BrandShowcase />
        <HotDeals />
        <CategoryNews />
      </div>
      
    </div>
  );
};

export default MainContent;


// // pages/Client/HomePage/index.tsx
// import { useEffect, useState, type JSX } from 'react';
// import './index.scss';
// import Banner from './components/banner';
// import Sidebar from './components/sidebar';
// import FeaturedProducts from './components/FeaturedProducts';
// import NewProducts from './components/NewProducts';
// import BrandShowcase from './components/Brandshowcase';
// import HotDeals from './components/Hotdeals';
// import CategoryNews from './components/Categorynews';
// import type { HomepageSection } from '../../Admin/Config/homepage.type';

// const MainContent = () => {
//   const [sections, setSections] = useState<HomepageSection[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch homepage configuration từ API
//     fetchHomepageConfig();
//   }, []);

//   const fetchHomepageConfig = async () => {
//     try {
//       // const response = await fetch('/api/homepage/config');
//       // const data = await response.json();
      
//       // Mock data - replace with actual API call
//       const mockConfig: HomepageSection[] = [
//         { id: 1, type: 'banner', title: 'Banner', active: true, order: 1, config: {} },
//         { id: 2, type: 'featured_products', title: 'Quick Actions', active: true, order: 2, config: {} },
//         { id: 3, type: 'new_products', title: 'Sản Phẩm Mới', active: true, order: 3, config: { productCount: 10 } },
//         { id: 4, type: 'brand_showcase', title: 'Thương Hiệu', active: true, order: 4, config: {} },
//         { id: 5, type: 'hot_deals', title: 'Deal Hot', active: true, order: 5, config: {} },
//         { id: 6, type: 'category_news', title: 'Danh Mục & Tin Tức', active: true, order: 6, config: {} }
//       ];

//       setSections(mockConfig.filter(s => s.active).sort((a, b) => a.order - b.order));
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch homepage config:', error);
//       setLoading(false);
//     }
//   };

//   const renderSection = (section: HomepageSection) => {
//     const components: Record<string, JSX.Element> = {
//       banner: <Banner key={section.id} />,
//       featured_products: <FeaturedProducts key={section.id} />,
//       new_products: <NewProducts key={section.id} config={section.config} />,
//       brand_showcase: <BrandShowcase key={section.id} config={section.config} />,
//       hot_deals: <HotDeals key={section.id} config={section.config} />,
//       category_news: <CategoryNews key={section.id} config={section.config} />
//     };

//     return components[section.type] || null;
//   };

//   if (loading) {
//     return <div className="loading-container">Loading...</div>;
//   }

//   // Sections that go inside main-area (with sidebar)
//   const topSections = sections.filter(s => 
//     s.type === 'banner' || s.type === 'featured_products'
//   );

//   // Sections that go below (full width)
//   const bottomSections = sections.filter(s => 
//     s.type !== 'banner' && s.type !== 'featured_products'
//   );

//   return (
//     <div className="main-content">
//       <div className="content-container">
//         {/* Left Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <main className="main-area">
//           {topSections.map(section => renderSection(section))}
//         </main>
//       </div>

//       {/* Full width sections */}
//       <div style={{ maxWidth: 1500 }}>
//         {bottomSections.map(section => renderSection(section))}
//       </div>
//     </div>
//   );
// };

// export default MainContent;