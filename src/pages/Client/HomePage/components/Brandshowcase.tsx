import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Brandshowcase.scss';
import { useNavigate } from 'react-router-dom';
import { useBrandList } from '../../../../hooks/Brand/useBrand';
import { useRef } from 'react';
import { Grid } from "antd";

const { useBreakpoint } = Grid;


const BrandShowcase = () => {
  const nav = useNavigate();
  const { data: brands } = useBrandList();
  
  const screens = useBreakpoint();

  const slides =
    screens.xl ? 5 :
    screens.lg ? 4 :
    screens.md ? 3 :
    screens.sm ? 2 : 1;
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
        <div className="section-icon"></div>
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
            slidesToShow={slides}
            slidesToScroll={1}
            arrows={false}
            dots={false}  
            responsive={[
              {
                breakpoint: 1400,
                settings: { slidesToShow: 4, slidesToScroll: 1 },
              },
              {
                breakpoint: 1200,
                settings: { slidesToShow: 3, slidesToScroll: 1 },
              },
              {
                breakpoint: 992,
                settings: { slidesToShow: 3, slidesToScroll: 1 },
              },
              {
                breakpoint: 768,
                settings: { slidesToShow: 2, slidesToScroll: 1 },
              },
              {
                breakpoint: 480,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
              },
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