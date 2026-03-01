import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Brandshowcase.scss';
import { useNavigate } from 'react-router-dom';
import { useBrandList } from '../../../../hooks/Brand/useBrand';

const BrandShowcase = () => {
  const nav=useNavigate();
  const {data:brands}=useBrandList();

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button className="carousel-arrow carousel-arrow-prev" onClick={onClick}>
        <LeftOutlined />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button className="carousel-arrow carousel-arrow-next" onClick={onClick}>
        <RightOutlined />
      </button>
    );
  };

  return (
    <section className="brand-showcase">
      <div className="section-header">
        <div className="section-icon">🏷️</div>
        <h2 className="section-title">Mua Nhiều Giá Sỉ</h2>
        <a href="#" className="view-all-link">
          Xem tất cả →
        </a>
      </div>

      <Carousel
        autoplay
        autoplaySpeed={3000}
        slidesToShow={5}
        slidesToScroll={1}
        arrows
        prevArrow={<CustomPrevArrow />}
        nextArrow={<CustomNextArrow />}
        responsive={[
          {
            breakpoint: 1400,
            settings: {
              slidesToShow: 4,
            }
          },
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            }
          }
        ]}
      >
        {brands?.map((brand) => (
          <div key={brand.id} className="brand-slide">
            <div className="brand-card"  onClick={()=>nav(`/brand/${brand.id}`)}>
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
    </section>
  );
};

export default BrandShowcase;