import { Button, Col, Drawer, Layout, Row, Badge } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { useProductList, type ParamSearch } from "../../../hooks/Product/useProductList";
import FeaturedProductCard from "../../../components/FeaturedProductCard";
import { Card } from "antd";
import BrandSidebar from "./Component/CategorySidebar";
import { Pagination } from "antd";
import { useBrandDetail } from "../../../hooks/Brand/useBrand";

const { Content } = Layout;

const ProductSkeleton = () => <Card loading style={{ width: "100%", borderRadius: 12 }} />;

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const brandId = Number(slug);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  
  const [filters, setFilters] = useState({
    sort: "default",
    subCategoryIds: [] as number[],
    minPrice: 0,
    maxPrice: 99999999,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: brandDetail } = useBrandDetail(brandId);

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
      page: page,
      size: pageSize,
    }),
    [brandId, filters, page]
  );

  const { data, isLoading } = useProductList({ ...queryParams } as ParamSearch);

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
    <div className="brand-page-container" style={{ minHeight: "100vh", maxWidth: 1200, margin: "0 auto", padding: "20px 16px 60px" }}>
      {/* ── MOBILE FILTER FAB ─────────────────────────── */}
      <div
        style={{
          display: "none",
          position: "fixed",
          bottom: 40,
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
              width: 56,
              height: 56,
              background: "#00b96b",
              borderColor: "#00b96b",
              boxShadow: "0 4px 20px rgba(0,185,107,0.45)",
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
        size={320}
        styles={{ body: { padding: 0 } }}
        className="filter-drawer"
        footer={
          <Button
            type="primary"
            block
            size="large"
            onClick={() => setDrawerOpen(false)}
            style={{ background: "#00b96b", borderColor: "#00b96b", height: 48, borderRadius: 8 }}
          >
            Xem kết quả ({data?.totalElements ?? 0})
          </Button>
        }
      >
        {sidebar}
      </Drawer>

      {/* ── SLEEK MINIMALIST HEADER ── */}
      <div className="brand-minimal-header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottom: "1px solid #eaeaea",
        paddingBottom: 16,
        marginBottom: 28
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: "#111111", letterSpacing: "-0.5px" }}>
            {brandDetail?.name || "Thương hiệu"}
          </h1>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13.5 }}>
            Các sản phẩm chính hãng nổi bật của thương hiệu {brandDetail?.name || ""} tại Anbato.
          </p>
        </div>
        <div style={{
          fontSize: 12.5,
          color: "#00b96b",
          background: "#e6f8ef",
          padding: "6px 14px",
          borderRadius: 20,
          fontWeight: 600,
          border: "1px solid #b3eecb"
        }}>
          💡 Đang có {data?.totalElements ?? 0} sản phẩm
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
        <div
          className="desktop-sidebar"
          style={{
            width: 280,
            flexShrink: 0,
            position: "sticky",
            top: 20,
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
            borderRadius: 16
          }}
        >
          {sidebar}
        </div>

        {/* ── PRODUCT GRID ──────────────────────────────── */}
        <Content style={{ flex: 1, minWidth: 0 }}>
          <Row gutter={[16, 16]}>
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

          {data && data.totalElements > 0 && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              <Pagination
                current={data.page + 1}
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

          {data && data.totalElements === 0 && (
            <div style={{
              textAlign: "center",
              padding: "60px 0",
              background: "#fff",
              borderRadius: 16,
              border: "1px dashed #d9d9d9",
              marginTop: 16
            }}>
              <p style={{ color: "#8c8c8c", fontSize: 15 }}>Không tìm thấy sản phẩm nào khớp với bộ lọc của bạn.</p>
              <Button type="default" onClick={() => handleFilterChange({
                sort: "default",
                subCategoryIds: [],
                minPrice: 0,
                maxPrice: 99999999,
              })} style={{ marginTop: 12, borderRadius: 6 }}>
                Đặt lại bộ lọc
              </Button>
            </div>
          )}
        </Content>
      </div>

      <style>{`
        .desktop-sidebar {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .desktop-sidebar:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .filter-checkbox-row {
          transition: all 0.2s;
          padding: 4px 8px;
          border-radius: 6px;
          margin-left: -8px;
        }
        .filter-checkbox-row:hover {
          background-color: #f0f5ff;
        }
        .ant-pagination {
          background: #fff;
          padding: 10px 24px;
          border-radius: 12px;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid #f0f0f0;
        }

        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .filter-fab      { display: block !important; }
          .brand-minimal-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}