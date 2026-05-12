import { Carousel } from "antd";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import type { Product } from "../../../../types/product.type";
import type { ProductSectionConfig } from "../../../../types/entity.type";
import FeaturedProductCard from "../../../../components/FeaturedProductCard";
import { useProductList } from "../../../../hooks/Product/useProductList";
import { productApi } from "../../../../api/product.api";
import "./FeaturedProducts.scss";
import { Grid } from "antd";

const { useBreakpoint } = Grid;

const FeaturedProducts = ({ title = "Sản Phẩm Nổi Bật", section }: { title?: string, section?: ProductSectionConfig }) => {
  const carouselRef = useRef<any>(null);

  const { data: defaultProducts } = useProductList<Product[]>({ type: "featured" });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCustom = async () => {
      if (section && section.productIds && section.productIds.length > 0) {
        try {
          const resp = await productApi.getByIds(section.productIds);
          setProducts(resp.content.slice(0, section.productCount || 10));
        } catch (e) { }
      } else {
        const list = defaultProducts || [];
        setProducts(list.slice(0, section?.productCount || list.length));
      }
    };
    fetchCustom();
  }, [section, defaultProducts]);

  const screens = useBreakpoint();

  const slides =
    screens.xl ? 5 :
      screens.lg ? 4 :
        screens.md ? 3 :
          screens.sm ? 2 : 1;
  return (
    <div className="featured-container">
      {/* HEADER */}
      <div className="featured-header">
        <h2 className="featured-title">{section?.title || title}</h2>
        <a href="#" className="featured-viewall">Xem tất cả <ArrowRightOutlined /></a>
      </div>

      {/* CAROUSEL */}
      <div className="featured-wrapper">
        <button type="button" className="featured-arrow" onClick={() => carouselRef.current?.prev()}>
          <LeftOutlined />
        </button>

        <div className="featured-inner">
          <Carousel
            ref={carouselRef}
            autoplay
            autoplaySpeed={3000}
            pauseOnHover
            slidesToShow={slides}
            slidesToScroll={1}
            arrows={false}
            dots={false}
            responsive={[
              { breakpoint: 1400, settings: { slidesToShow: 4 } },
              { breakpoint: 1200, settings: { slidesToShow: 3 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 480, settings: { slidesToShow: 1 } },
            ]}
          >
            {products?.map((product) => (
              <div key={product.id} className="featured-slide">
                <FeaturedProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>

        <button type="button" className="featured-arrow" onClick={() => carouselRef.current?.next()}>
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default FeaturedProducts;