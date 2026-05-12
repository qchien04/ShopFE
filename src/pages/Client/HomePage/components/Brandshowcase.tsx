import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Brandshowcase.scss';
import { useNavigate } from 'react-router-dom';
import { useBrandList } from '../../../../hooks/Brand/useBrand';
import { useRef, useMemo } from 'react';
import { Grid } from "antd";
import type { ProductSectionConfig } from '../../../../types/entity.type';

const { useBreakpoint } = Grid;


const BrandShowcase = ({ section, brandIds }: { section?: ProductSectionConfig, brandIds?: number[] }) => {
  const nav = useNavigate();
  const { data: allBrands } = useBrandList();

  const brands = useMemo(() => {
    if (!allBrands) return [];

    // Sử dụng brandIds từ prop (top-level) hoặc fallback từ section (nếu có)
    const activeBrandIds = brandIds && brandIds.length > 0 ? brandIds : (section as any)?.brandIds || [];

    if (activeBrandIds.length === 0) return allBrands.slice(0, section?.productCount || 10);

    // Ghim thương hiệu được chọn lên đầu
    const pinned = activeBrandIds
      .map((id: number) => allBrands.find(b => b.id === id))
      .filter((b: any): b is any => !!b);

    // Nếu muốn bù thêm cho đủ số lượng
    const others = allBrands.filter(b => !activeBrandIds.includes(b.id!));
    const result = [...pinned, ...others].slice(0, section?.productCount || 10);

    return result;
  }, [allBrands, section, brandIds]);

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
        <h2 className="section-title">{section?.title || "Mua Nhiều Giá Sỉ"}</h2>
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