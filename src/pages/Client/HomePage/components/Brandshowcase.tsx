import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Brandshowcase.scss';
import { useNavigate } from 'react-router-dom';
import { useBrandList } from '../../../../hooks/Brand/useBrand';
import { useRef } from 'react';

const BrandShowcase = () => {
  const nav = useNavigate();
  const { data: brands } = useBrandList();
  const carouselRef = useRef<any>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    carouselRef.current?.prev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    carouselRef.current?.next();
  };

  return (
    <section className="brand-showcase">
      <div className="section-header">
        <div className="section-icon">🏷️</div>
        <h2 className="section-title">Mua Nhiều Giá Sỉ</h2>
        <a href="#" className="view-all-link">Xem tất cả →</a>
      </div>

      <div className="carousel-wrapper">
        <button
          className="carousel-arrow carousel-arrow-prev"
          onClick={handlePrev}
          type="button"
        >
          <LeftOutlined />
        </button>

        <div className="carousel-inner">
          <Carousel
            ref={carouselRef}
            autoplay
            autoplaySpeed={3000}
            pauseOnHover 
            pauseOnDotsHover
            slidesToShow={5}
            slidesToScroll={1}
            arrows={false}
            dots={false}  
            responsive={[
              { breakpoint: 1400, settings: { slidesToShow: 4 } },
              { breakpoint: 1200, settings: { slidesToShow: 3 } },
              { breakpoint: 768,  settings: { slidesToShow: 2 } },
              { breakpoint: 480,  settings: { slidesToShow: 1 } },
            ]}
          >
            {brands?.map((brand) => (
              <div key={brand.id} className="brand-slide">
                <div
                  className="brand-card"
                  onClick={() => nav(`/brand/${brand.id}`)}
                >
                  <div className="brand-image-wrapper">
                    <img src={brand.logo} alt={brand.name} className="brand-image" />
                    <div className="brand-overlay">
                      <img src={brand.logo} alt={brand.name} className="brand-logo" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <button
          className="carousel-arrow carousel-arrow-next"
          onClick={handleNext}
          type="button"
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  );
};

export default BrandShowcase;