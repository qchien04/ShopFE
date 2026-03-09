import { Button, Col, Drawer, Layout, Row, Badge } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { useProductList, type ParamSearch } from "../../../hooks/Product/useProductList";
import FeaturedProductCard from "../../../components/FeaturedProductCard";
import { Card } from "antd";
import BrandSidebar from "./Component/CategorySidebar";
import { Pagination } from "antd";

const { Content } = Layout;

const ProductSkeleton = () => <Card loading style={{ width: "100%" }} />;

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const brandId = Number(slug);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const [filters, setFilters] = useState({
    sort: "default",
    subCategoryIds: [] as number[],
    minPrice: 0,
    maxPrice: 999999,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFilterCount =
    (filters.sort !== "default" ? 1 : 0) +
    filters.subCategoryIds.length;

  const queryParams = useMemo(
    () => ({
      type: "brand",
      subCategoryIds:
        filters.subCategoryIds.length > 0
          ? filters.subCategoryIds.join(",")
          : undefined,
      brandIds: [brandId],
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page:page,
      size: pageSize,
    }),
    [brandId, filters, page]
  );

  const { data, isLoading } = useProductList({...queryParams}as ParamSearch );

  const handleFilterChange = useCallback(
    (newFilters: {
      sort: string;
      subCategoryIds: number[];
      minPrice: number;
      maxPrice: number;
    }) => {
      setFilters(newFilters);
      setPage(0);
    },
    []
  );

  const sidebar = (
    <BrandSidebar
      brandId={brandId}
      onFilterChange={handleFilterChange}
    />
  );

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "0 0 40px" }}>
      {/* ── MOBILE FILTER FAB ─────────────────────────── */}
      <div
        style={{
          display: "none",
          position: "fixed",
          top: 250,
          right: 20,
          zIndex: 1000,
        }}
        className="filter-fab"
      >
        <Badge count={activeFilterCount} offset={[-4, 4]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<FilterOutlined />}
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 52,
              height: 52,
              background: "#00b96b",
              borderColor: "#00b96b",
              boxShadow: "0 4px 16px rgba(0,185,107,0.4)",
            }}
          />
        </Badge>
      </div>

      {/* ── MOBILE DRAWER ─────────────────────────────── */}
      <Drawer
        title="Bộ lọc"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={300}
        styles={{ body: { padding: 0 } }}
        className="filter-drawer"
        footer={
          <Button
            type="primary"
            block
            size="large"
            onClick={() => setDrawerOpen(false)}
            style={{ background: "#00b96b", borderColor: "#00b96b" }}
          >
            Xem kết quả ({data?.totalElements ?? 0})
          </Button>
        }
      >
        {sidebar}
      </Drawer>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "0 16px" }}>
        {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
        <div
          className="desktop-sidebar"
          style={{
            width: 260,
            flexShrink: 0,
            position: "sticky",
            top: 10,
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          {sidebar}
        </div>

        {/* ── PRODUCT GRID ──────────────────────────────── */}
        <Content style={{ flex: 1, minWidth: 0 }}>
          <Row gutter={[12, 12]}>
            {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Col xs={12} sm={12} md={8} lg={6} key={i}>
                  <ProductSkeleton />
                </Col>
              ))
            : data?.content.map((product: any) => (
                <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                  <FeaturedProductCard product={product} />
                </Col>
              ))
            }
          </Row>
          {data && (
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <Pagination
                current={data.number + 1}
                pageSize={data.size}
                total={data.totalElements}
                onChange={(newPage) => {
                  setPage(newPage - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                showSizeChanger={false}
              />
            </div>
          )}
        </Content>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .filter-fab      { display: block !important; }
        }
      `}</style>
    </div>
  );
}