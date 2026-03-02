import { useState, useEffect } from "react";
import { Checkbox, Divider, Typography, Spin } from "antd";
import { useCategoryFilter } from "../../../../hooks/Category/useCategotyList";
import { Slider } from "antd";
const { Title, Text } = Typography;

interface Props {
  categoryId: number;
  onFilterChange?: (filters: {
    sort: string;
    subCategoryIds: number[];
    brandIds: number[];
    minPrice:number;
    maxPrice:number;
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

  if (isLoading) return <Spin />;

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 10 ,maxHeight:"70vh"}}>
      <Title level={5}>Danh mục sản phẩm</Title>
      <Divider />

      <Text strong>Khoảng giá</Text>

      <Slider
        range
        min={data?.minPrice ?? 0}
        max={data?.maxPrice ?? 0}
        step={data?(data?.maxPrice-data?.minPrice)/10:10000}
        value={priceRange}
        onChange={(value) => setPriceRange(value as [number, number])}
        style={{ marginTop: 12 }}
      />

      <div style={{ marginTop: 8 }}>
        <Text>
          {priceRange[0].toLocaleString()}đ -{" "}
          {priceRange[1].toLocaleString()}đ
        </Text>
      </div>

      <Divider />

      {/* SORT */}
      <Text strong>Sắp xếp</Text>
      {sortOptions.map((item) => (
        <div key={item.value} style={{ marginTop: 6 }}>
          <Checkbox
            checked={sort === item.value}
            onChange={() => setSort(item.value)}
          >
            {item.label}
          </Checkbox>
        </div>
      ))}

      <Divider />

      {/* SUB CATEGORIES */}
      <Text strong>Loại</Text>
      <Checkbox.Group
        value={selectedCategories}
        onChange={(values) =>
          setSelectedCategories(values as number[])
        }
        style={{ display: "block", marginTop: 8 }}
      >
        {data?.subCategories?.map((item: any) => (
          <div key={item.id} style={{ marginBottom: 6 }}>
            <Checkbox value={item.id}>{item.name}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>

      <Divider />

      {/* BRANDS */}
      <Text strong>Thương hiệu</Text>
      <Checkbox.Group
        value={selectedBrands}
        onChange={(values) =>
          setSelectedBrands(values as number[])
        }
        style={{ display: "block", marginTop: 8 }}
      >
        {data?.brands?.map((item: any) => (
          <div key={item.id} style={{ marginBottom: 6 }}>
            <Checkbox value={item.id}>{item.name}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default CategorySidebar;