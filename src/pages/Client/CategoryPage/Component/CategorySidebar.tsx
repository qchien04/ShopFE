import { useState, useEffect } from "react";
import { Checkbox, Divider, Typography, Spin, Select, InputNumber } from "antd";
import { useCategoryFilter } from "../../../../hooks/Category/useCategotyList";
import { Slider } from "antd";
import { FilterOutlined, SortAscendingOutlined, TagsOutlined, TrademarkOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

interface Props {
  categoryId: number;
  onFilterChange?: (filters: {
    sort: string;
    subCategoryIds: number[];
    brandIds: number[];
    minPrice: number;
    maxPrice: number;
  }) => void;
}

const CategorySidebar = ({ categoryId, onFilterChange }: Props) => {
  const { data, isLoading } = useCategoryFilter(categoryId);
  
  const [sort, setSort] = useState("default");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);

  useEffect(() => {
    if (data?.minPrice != null && data?.maxPrice != null) {
      setPriceRange([data.minPrice, data.maxPrice]);
    }
  }, [data]);

  const sortOptions = [
    { label: "Mặc định", value: "default" },
    { label: "Tên A-Z", value: "name_asc" },
    { label: "Tên Z-A", value: "name_desc" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao xuống thấp", value: "price_desc" },
  ];

  useEffect(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSort("default");
    setPriceRange([0, 5000000]);
  }, [categoryId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange?.({
        sort,
        subCategoryIds: selectedCategories,
        brandIds: selectedBrands,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [sort, selectedCategories, selectedBrands, priceRange]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
        <Spin size="large" tip="Đang tải bộ lọc..." />
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%)",
      borderRadius: 16,
      border: "1px solid #eef2f6",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
      padding: 20
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <FilterOutlined style={{ color: "#00b96b", fontSize: 18 }} />
        <Title level={5} style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>Bộ Lọc Tìm Kiếm</Title>
      </div>
      <Divider style={{ margin: "12px 0 20px" }} />

      {/* SORT */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <SortAscendingOutlined style={{ color: "#8c8c8c" }} />
          <Text strong style={{ color: "#434343", fontSize: 13 }}>Sắp xếp theo</Text>
        </div>
        <Select
          value={sort}
          onChange={setSort}
          options={sortOptions}
          style={{ width: "100%" }}
          dropdownStyle={{ borderRadius: 8 }}
        />
      </div>

      <Divider style={{ margin: "16px 0" }} />

      {/* PRICE RANGE */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ display: "block", color: "#434343", fontSize: 13, marginBottom: 12 }}>Khoảng giá (₫)</Text>
        
        <Slider
          range
          min={data?.minPrice ?? 0}
          max={data?.maxPrice ?? 10000000}
          step={data ? Math.max(1000, Math.floor((data.maxPrice - data.minPrice) / 100)) : 10000}
          value={priceRange}
          onChange={(value) => setPriceRange(value as [number, number])}
          style={{ margin: "0 10px 16px" }}
          tooltip={{ formatter: (v) => `${v?.toLocaleString()}đ` }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <InputNumber
            min={data?.minPrice ?? 0}
            max={priceRange[1]}
            value={priceRange[0]}
            onChange={(val) => setPriceRange([val ?? 0, priceRange[1]])}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(val) => Number(`${val}`.replace(/\$\s?|(,*)/g, ""))}
            style={{ width: "100%", borderRadius: 6 }}
            placeholder="Min"
          />
          <span style={{ color: "#bfbfbf" }}>-</span>
          <InputNumber
            min={priceRange[0]}
            max={data?.maxPrice ?? 10000000}
            value={priceRange[1]}
            onChange={(val) => setPriceRange([priceRange[0], val ?? (data?.maxPrice ?? 10000000)])}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(val) => Number(`${val}`.replace(/\$\s?|(,*)/g, ""))}
            style={{ width: "100%", borderRadius: 6 }}
            placeholder="Max"
          />
        </div>
      </div>

      {data?.subCategories && data.subCategories.length > 0 && (
        <>
          <Divider style={{ margin: "16px 0" }} />
          {/* SUB CATEGORIES */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <TagsOutlined style={{ color: "#8c8c8c" }} />
              <Text strong style={{ color: "#434343", fontSize: 13 }}>Loại sản phẩm</Text>
            </div>
            <Checkbox.Group
              value={selectedCategories}
              onChange={(values) => setSelectedCategories(values as number[])}
              style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
            >
              {data.subCategories.map((item: any) => (
                <div key={item.id} className="filter-checkbox-row">
                  <Checkbox value={item.id} style={{ fontSize: 13, color: "#595959" }}>{item.name}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        </>
      )}

      {data?.brands && data.brands.length > 0 && (
        <>
          <Divider style={{ margin: "16px 0" }} />
          {/* BRANDS */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <TrademarkOutlined style={{ color: "#8c8c8c" }} />
              <Text strong style={{ color: "#434343", fontSize: 13 }}>Thương hiệu</Text>
            </div>
            <Checkbox.Group
              value={selectedBrands}
              onChange={(values) => setSelectedBrands(values as number[])}
              style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
            >
              {data.brands.map((item: any) => (
                <div key={item.id} className="filter-checkbox-row">
                  <Checkbox value={item.id} style={{ fontSize: 13, color: "#595959" }}>{item.name}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        </>
      )}
    </div>
  );
};

export default CategorySidebar;