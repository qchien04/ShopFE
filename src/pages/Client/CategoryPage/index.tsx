import { Card, Col, Layout, Row, Skeleton } from "antd";
import ProductSidebar from "./Component/CategorySidebar";
import { useParams } from "react-router-dom";
import { useProductList } from "../../../hooks/Product/useProductList";
import ProductCard from "../../../components/ProductCard";
import FeaturedProductCard from "../../../components/FeaturedProductCard";

const { Sider, Content } = Layout;

const ProductSkeleton = () => (
  <Card loading style={{width:"100%"}}/>
);

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const {data:products,isLoading}=useProductList({type:"category",
    params:{category:slug}
  });


  return (
    <div style={{display:"flex",minHeight:"100vh",width:"100%"}}>
        <div style={{ 
          width: 280,
          flexShrink: 0,
          alignSelf: "flex-start", // QUAN TRỌNG!
          position: "sticky",
          top: 160,
          maxHeight: 500, // Giới hạn chiều cao
          overflowY: "auto" // Cho phép scroll nếu sidebar quá dài
        }}>
        <ProductSidebar />
      </div>
      <Content style={{ paddingLeft: 10, flex: 1 }}>
        <Row gutter={[10, 10]}>
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Col span={6} key={index}>
                  <ProductSkeleton />
                </Col>
              ))
            : products?.map((product, index) => (
                <Col span={6} key={index}>
                  <FeaturedProductCard product={product} />
                </Col>
              ))}
        </Row>
      </Content>
    </div>
  );
}
