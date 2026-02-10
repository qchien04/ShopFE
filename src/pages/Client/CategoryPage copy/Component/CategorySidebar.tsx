import { useState } from "react";
import { Checkbox, Divider, Typography } from "antd";

const { Title, Text } = Typography;

const CategorySidebar = () => {
  const [sort, setSort] = useState("default");
  
  const sortOptions = [
    { label: "Mặc định", value: "default" },
    { label: "Tên A-Z", value: "name_asc" },
    { label: "Tên Z-A", value: "name_desc" },
    { label: "Giá thấp đến cao", value: "price_asc" },
    { label: "Giá cao xuống thấp", value: "price_desc" },
  ];

  const typeOptions = [
    "Hộp Nhựa Vy Anh",
    "Vỏ biến áp",
    "Hộp nhựa phay sẵn CNC",
    "Hộp Nhựa WANCHI",
  ];

  const brandOptions = ["VY ANH", "Việt Nam", "WANCHI"];

  return (
    <div style={{ width: 260, padding: 16, background: "#fff", borderRadius:10}}>
      <Title style={{marginTop:0}} level={5}>Danh mục sản phẩm</Title>

      <Divider />

      <Text strong>Sắp xếp</Text>
      <div style={{ marginTop: 8 }}>
        {sortOptions.map((item) => (
          <div key={item.value} style={{ marginBottom: 6 }}>
            <Checkbox
              checked={sort === item.value}
              onChange={() => setSort(item.value)}
            >
              {item.label}
            </Checkbox>
          </div>
        ))}
      </div>

      <Divider />

      <Text strong>Loại</Text>
      <Checkbox.Group style={{ display: "block", marginTop: 8 }}>
        {typeOptions.map((item) => (
          <div key={item} style={{ marginBottom: 6 }}>
            <Checkbox value={item}>{item}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>

      <Divider />

      <Text strong>Thương hiệu</Text>
      <Checkbox.Group style={{ display: "block", marginTop: 8 }}>
        {brandOptions.map((item) => (
          <div key={item} style={{ marginBottom: 6 }}>
            <Checkbox value={item}>{item}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default CategorySidebar;
