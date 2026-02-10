import React from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './BrandShowcase.scss';
import { useNavigate } from 'react-router-dom';
import { useBrandList } from '../../../../hooks/Brand/useBrand';

interface Brand {
  id: number;
  name: string;
  logo: string;
  image: string;
}
const link="https://scontent.fhph1-2.fna.fbcdn.net/v/t39.30808-6/625540696_1547028036585292_1549913847161162697_n.jpg?stp=dst-jpg_s261x260_tt6&_nc_cat=108&ccb=1-7&_nc_sid=bd9a62&_nc_eui2=AeGaampFLk1DfXK0XxxIfbzhRyAsEWz9BjdHICwRbP0GN8PfVU6RIqu2rimFyYSRfMPwzRFE9ZMK1dkwBhumoprL&_nc_ohc=lucakr84ADMQ7kNvwETkELI&_nc_oc=AdkfIAcwTdNnSKZKzX8q8rYH5k56TkFGPmLsN6SELLEZLiTW6Mw7TAIizuJzJpN7cPNN3ecezxtTSHEaspRo94oC&_nc_zt=23&_nc_ht=scontent.fhph1-2.fna&_nc_gid=d9O808h5m-kAsAe5_2qIKA&oh=00_AfuEtbl4pa30wbc6OCtEkJkhAbzhYWAVXLBaBAwgUdHkgg&oe=698BBEFC"
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