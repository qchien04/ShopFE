// =======================
// FeaturedProducts.tsx
// =======================

import { Button } from "antd";
import {
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useRef, useState, useEffect } from "react";
import type { Product } from "../../../../types/product.type";
import FeaturedProductCard from "../../../../components/FeaturedProductCard";
import { useProductList } from "../../../../hooks/Product/useProductList";

import "./FeaturedProducts.scss";

interface FeaturedProductsProps {
  title?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const FeaturedProducts = ({
  title = "Sản Phẩm Nổi Bật",
}: FeaturedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: products } = useProductList<Product[]>({ type: "featured" });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5
    );
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  return (
    <div className="featured-container">
      <div className="featured-inner">
        {/* HEADER */}
        <div className="featured-header">
          <h2 className="featured-title">{title}</h2>

          <Button
            type="link"
            className="featured-viewall"
            icon={<ArrowRightOutlined />}
          >
            Xem tất cả
          </Button>
        </div>

        {/* PRODUCT LIST */}
        <div className="featured-wrapper">
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="scroll-btn left-btn"
          />

          <div className="featured-scroll-outer">
            <div
              ref={scrollRef}
              className="featured-scroll hide-scrollbar"
            >
              {products?.map((product) => (
                <div
                  key={product.id}
                  className="featured-product-item"
                >
                  <FeaturedProductCard product={product} />
                
                </div>
              ))}
            </div>
          </div>

          <Button
            shape="circle"
            icon={<RightOutlined />}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="scroll-btn right-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;