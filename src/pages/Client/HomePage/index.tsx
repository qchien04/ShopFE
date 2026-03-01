import './index.scss';
import Banner from './components/banner';
import Sidebar from './components/sidebar';
import NewProducts from './components/NewProducts';
import BrandShowcase from './components/Brandshowcase';
import HotDeals from './components/Hotdeals';
import CategoryNews from './components/Categorynews';
import FeaturedProducts from './components/FeaturedProducts';

const MainContent = () => {
  return (
    <div className="main-content">
      <div className="content-container">
        {/* Left Sidebar */}
        <Sidebar></Sidebar>

        {/* Main Content Area */}
        <main className="main-area">
            <Banner></Banner>
            <FeaturedProducts />
        </main>
      </div>

      <div style={{width:"100%"}}>
        <NewProducts />
        <BrandShowcase />
        <HotDeals />
        <CategoryNews />
      </div>
      
    </div>
  );
};

export default MainContent;

