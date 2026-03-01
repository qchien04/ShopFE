// SearchPage.tsx
import { Breadcrumb, Card, Col, Layout, Row, Pagination, Typography, Slider, Checkbox, Radio, Button, InputNumber, Divider, Tag, Collapse } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProductList } from "../../../hooks/Product/useProductList";
import FeaturedProductCard from "../../../components/FeaturedProductCard";
import "./SearchPage.scss";
import type { PageResponse } from "../../../api/product.api";
import type { Product } from "../../../types/product.type";
import {
  FilterOutlined,
  CloseOutlined,
  ReloadOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useCategoryList } from "../../../hooks/Category/useCategotyList";
import { useBrandList } from "../../../hooks/Brand/useBrand";
import type { Category } from "../../../types/categories.type";
import type { Brand } from "../../../types/entity.type";

const { Content } = Layout;
const { Title, Text } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────
interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  brandIds: number[];
  categoryIds: number[];
  sortBy: string;
  inStock: boolean;
}


const PRICE_PRESETS = [
  { label: "Dưới 50k",       min: 0,       max: 50000   },
  { label: "50k – 200k",     min: 50000,   max: 200000  },
  { label: "200k – 500k",    min: 200000,  max: 500000  },
  { label: "500k – 1 triệu", min: 500000,  max: 1000000 },
  { label: "Trên 1 triệu",   min: 1000000, max: null    },
];

const SORT_OPTIONS = [
  { value: "newest",       label: "Mới nhất"          },
  { value: "price_asc",    label: "Giá thấp → cao"    },
  { value: "price_desc",   label: "Giá cao → thấp"    },
  { value: "best_seller",  label: "Bán chạy nhất"     },
];

const ProductSkeleton = () => <Card loading style={{ width: "100%" }} />;

const fmtVND = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(v);

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
const FilterSidebar = ({
  filters,
  onChange,
  onReset,
}: {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
}) => {
  const [localMin, setLocalMin] = useState<number | null>(filters.minPrice);
  const [localMax, setLocalMax] = useState<number | null>(filters.maxPrice);

  const { data: categories } = useCategoryList();

  const { data: brands } = useBrandList();

  const applyPrice = () => onChange({ minPrice: localMin, maxPrice: localMax });

  const activeCount =
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    filters.brandIds.length +
    filters.categoryIds.length +
    (filters.inStock ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0);

  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar__header">
        <span className="filter-sidebar__title">
          <FilterOutlined /> Bộ lọc
          {activeCount > 0 && (
            <span className="filter-sidebar__badge">{activeCount}</span>
          )}
        </span>
        {activeCount > 0 && (
          <button className="filter-sidebar__reset" onClick={onReset}>
            <ReloadOutlined /> Xóa hết
          </button>
        )}
      </div>

      {/* Sắp xếp */}
      <div className="filter-section">
        <div className="filter-section__label">
          <SwapOutlined /> Sắp xếp
        </div>
        <Radio.Group
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
          className="filter-radio-group"
        >
          {SORT_OPTIONS.map((o) => (
            <Radio key={o.value} value={o.value} className="filter-radio">
              {o.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <Divider className="filter-divider" />

      {/* Khoảng giá */}
      <div className="filter-section">
        <div className="filter-section__label">💰 Khoảng giá</div>

        {/* Preset buttons */}
        <div className="price-presets">
          {PRICE_PRESETS.map((p) => {
            const active = filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={p.label}
                className={`price-preset ${active ? "price-preset--active" : ""}`}
                onClick={() => {
                  setLocalMin(p.min);
                  setLocalMax(p.max);
                  onChange({ minPrice: p.min, maxPrice: p.max });
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Manual input */}
        <div className="price-inputs">
          <InputNumber
            value={localMin ?? undefined}
            onChange={(v) => setLocalMin(v ?? null)}
            placeholder="Từ"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number(v?.replace(/,/g, "")) as any}
            className="price-input"
          />
          <span className="price-dash">–</span>
          <InputNumber
            value={localMax ?? undefined}
            onChange={(v) => setLocalMax(v ?? null)}
            placeholder="Đến"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number(v?.replace(/,/g, "")) as any}
            className="price-input"
          />
        </div>
        <Button size="small" block className="price-apply-btn" onClick={applyPrice}>
          Áp dụng
        </Button>
      </div>

      <Divider className="filter-divider" />

      {/* Danh mục */}
      {categories && categories.length > 0 && (
        <>
          <div className="filter-section">
            <div className="filter-section__label">🗂️ Danh mục</div>
            <Checkbox.Group
              value={filters.categoryIds}
              onChange={(vals) => onChange({ categoryIds: vals as number[] })}
              className="filter-checkbox-group"
            >
              {categories.slice(0, 10).map((c) => (
                <Checkbox key={c.id} value={c.id} className="filter-checkbox">
                  {c.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          <Divider className="filter-divider" />
        </>
      )}

      {/* Thương hiệu */}
      {brands && brands.length > 0 && (
        <>
          <div className="filter-section">
            <div className="filter-section__label">🏷️ Thương hiệu</div>
            <Checkbox.Group
              value={filters.brandIds}
              onChange={(vals) => onChange({ brandIds: vals as number[] })}
              className="filter-checkbox-group"
            >
              {brands.slice(0, 10).map((b) => (
                <Checkbox key={b.id} value={b.id} className="filter-checkbox">
                  {b.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
          <Divider className="filter-divider" />
        </>
      )}

      {/* Còn hàng */}
      <div className="filter-section">
        <Checkbox
          checked={filters.inStock}
          onChange={(e) => onChange({ inStock: e.target.checked })}
          className="filter-checkbox"
        >
          <span className="instock-label">Chỉ hiện còn hàng</span>
        </Checkbox>
      </div>
    </div>
  );
};

// ─── Active Filter Tags ───────────────────────────────────────────────────────
const ActiveFilters = ({
  filters,
  categories,
  brands,
  onRemove,
}: {
  filters: FilterState;
  categories: Category[];
  brands: Brand[];
  onRemove: (key: string, value?: any) => void;
}) => {
  const tags: { key: string; label: string; value?: any }[] = [];

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const label = [
      filters.minPrice ? `từ ${fmtVND(filters.minPrice)}` : "",
      filters.maxPrice ? `đến ${fmtVND(filters.maxPrice)}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    tags.push({ key: "price", label: `💰 ${label}` });
  }

  filters.categoryIds.forEach((id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) tags.push({ key: "category", label: `🗂️ ${cat.name}`, value: id });
  });

  filters.brandIds.forEach((id) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) tags.push({ key: "brand", label: `🏷️ ${brand.name}`, value: id });
  });

  if (filters.inStock) tags.push({ key: "inStock", label: "✅ Còn hàng" });

  if (tags.length === 0) return null;

  return (
    <div className="active-filters">
      <Text className="active-filters__label">Đang lọc:</Text>
      {tags.map((tag, i) => (
        <Tag
          key={i}
          closable
          onClose={() => onRemove(tag.key, tag.value)}
          className="active-filter-tag"
        >
          {tag.label}
        </Tag>
      ))}
    </div>
  );
};

// ─── Default filters ──────────────────────────────────────────────────────────
const DEFAULT_FILTERS: FilterState = {
  minPrice: null,
  maxPrice: null,
  brandIds: [],
  categoryIds: [],
  sortBy: "newest",
  inStock: false,
};

// ─── Search Page ──────────────────────────────────────────────────────────────
export default function SearchPage() {
  const useQueryParams = () => new URLSearchParams(useLocation().search);
  const queryParams = useQueryParams();
  const keyword = queryParams.get("keyword");

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const pageSize = 12;

  const { data: categories = [] } = useCategoryList();

  const { data: brands = [] } = useBrandList();

  const { data, isLoading } = useProductList<PageResponse<Product>>({
    type: "search",
    params: {
      keyword,
      page: page - 1,
      size: pageSize,
      minPrice: filters.minPrice ?? undefined,
      maxPrice: filters.maxPrice ?? undefined,
      brandIds: filters.brandIds.length > 0 ? filters.brandIds.join(",") : undefined,
      categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds.join(",") : undefined,
      sortBy: filters.sortBy,
      inStock: filters.inStock || undefined,
    },
  });

  const products = data?.content || [];
  const total = data?.totalElements || 0;

  useEffect(() => { setPage(1); }, [keyword, filters]);

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilters((f) => ({ ...f, ...partial }));
    setPage(1);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const removeFilter = (key: string, value?: any) => {
    if (key === "price") updateFilter({ minPrice: null, maxPrice: null });
    else if (key === "category") updateFilter({ categoryIds: filters.categoryIds.filter((id) => id !== value) });
    else if (key === "brand")    updateFilter({ brandIds: filters.brandIds.filter((id) => id !== value) });
    else if (key === "inStock")  updateFilter({ inStock: false });
  };

  return (
    <div className="search-page">
      <Content className="search-page__content">
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Tìm kiếm</Breadcrumb.Item>
        </Breadcrumb>

        <div className="search-page__body">
          {/* Sidebar */}
          <aside className="search-page__sidebar">
            <FilterSidebar
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </aside>

          {/* Main */}
          <div className="search-page__main">
            <div className="search-header">
              <Title level={5} className="search-header__title">
                {isLoading
                  ? "Đang tìm kiếm..."
                  : total > 0
                  ? <>Tìm thấy <strong>{total}</strong> kết quả cho <em>"{keyword}"</em></>
                  : <>Không tìm thấy kết quả cho <em>"{keyword}"</em></>}
              </Title>
            </div>

            <ActiveFilters
              filters={filters}
              categories={categories}
              brands={brands}
              onRemove={removeFilter}
            />

            <Row gutter={[12, 12]} className="search-page__grid">
              {isLoading
                ? Array.from({ length: pageSize }).map((_, i) => (
                    <Col xs={12} sm={12} md={8} lg={6} key={i}>
                      <ProductSkeleton />
                    </Col>
                  ))
                : products.length > 0
                ? products.map((product) => (
                    <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                      <FeaturedProductCard product={product} />
                    </Col>
                  ))
                : (
                  <Col span={24}>
                    <div className="empty-result">
                      <div className="empty-result__icon">🔍</div>
                      <div className="empty-result__text">Không có sản phẩm phù hợp</div>
                      <button className="empty-result__reset" onClick={resetFilters}>
                        Xóa bộ lọc
                      </button>
                    </div>
                  </Col>
                )}
            </Row>

            {!isLoading && total > pageSize && (
              <div className="search-pagination">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}