// =======================
// FeaturedProducts.tsx
// =======================
import { Card, Typography, Button, Space, Progress, Badge } from "antd";
import { ShoppingCartOutlined, ArrowRightOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRef } from "react";
import type { Product } from "../../../../types/product.type";
import FeaturedProductCard from "../../../../components/FeaturedProductCard";
import { useProductList } from "../../../../hooks/Product/useProductList";

import "./FeaturedProducts.scss"

interface FeaturedProductsProps {
  title?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}
const CARD_WIDTH = 250;
const GAP = 16;
const VISIBLE_COUNT = 4;

const FeaturedProducts = ({ 
  title = "Sản Phẩm Nổi Bật", 
}: FeaturedProductsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {data:products}=useProductList({type:"featured"})
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{ 
      background: "#fff", 
      padding: "14px 0",
      position: "relative"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        {/* HEADER */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 24,
          borderBottom: "3px solid #00b96b",
          paddingBottom: 12
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: "bold", 
            margin: 0,
            color: "#000"
          }}>
            {title}
          </h2>
          <Button 
            type="link" 
            style={{ 
              fontSize: 16,
              color: "#1890ff",
              padding: 0
            }}
            icon={<ArrowRightOutlined />}
          >
            Xem tất cả
          </Button>
        </div>

        <div style={{ position: "relative" }}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => scroll("left")}
            style={{
              position: "absolute",
              left: -20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10
            }}
          />

          <div
            style={{
              width: VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP,
              overflow: "hidden"
            }}
          >
            <div
              ref={scrollRef}
              className="hide-scrollbar"
              style={{
                display: "flex",
                gap: GAP,
                overflowX: "auto",
                overflowY: "hidden",
                padding: "8px 0",
                scrollBehavior: "smooth"
              }}
            >
              {products?.map((product) => (
                <div
                  key={product.id}
                  style={{
                    flex: `0 0 ${CARD_WIDTH}px`,
                    maxWidth: CARD_WIDTH
                  }}
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
            style={{
              position: "absolute",
              right: -20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10
            }}
          />
        </div>
      </div>     
    </div>
  );
};

export default FeaturedProducts;