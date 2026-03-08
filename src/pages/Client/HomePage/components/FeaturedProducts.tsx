import { Carousel } from "antd";
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import type { Product } from "../../../../types/product.type";
import FeaturedProductCard from "../../../../components/FeaturedProductCard";
import { useProductList } from "../../../../hooks/Product/useProductList";
import "./FeaturedProducts.scss";

const FeaturedProducts = ({ title = "Sản Phẩm Nổi Bật" }: { title?: string }) => {
  const carouselRef = useRef<any>(null);
  const { data: products } = useProductList<Product[]>({ type: "featured" });

  return (
    <div className="featured-container">
      {/* HEADER */}
      <div className="featured-header">
        <h2 className="featured-title">{title}</h2>
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