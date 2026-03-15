import type { ColumnsType } from "antd/es/table"
import type { Product, ProductStatus } from "../../../types/product.type"
import { Button, Image, Popconfirm, Space, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
const STATUS_COLOR: Record<ProductStatus, string> = {
  DRAFT:        "default",
  PUBLISHED:    "success",
  OUT_OF_STOCK: "warning",
  DISCONTINUED: "error",
};

const STATUS_TEXT: Record<ProductStatus, string> = {
  DRAFT:        "Nháp",
  PUBLISHED:    "Đã xuất bản",
  OUT_OF_STOCK: "Hết hàng",
  DISCONTINUED: "Ngừng kinh doanh",
};

export const buildColumns = (
  onEdit:   (id: number) => void,
  onDelete: (id: number) => void,
  onView:   (id: number) => void,
  deleting: boolean,
): ColumnsType<Product> => [
  {
    title: "Ảnh", dataIndex: "mainImage", width: 100,
    render: (url) => (
      <Image width={80} height={80}
        style={{ objectFit: "cover", borderRadius: 6 }}
        src={url}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
    ),
  },
  { title: "SKU",          dataIndex: "sku",               width: 130 },
  { title: "Tên sản phẩm", dataIndex: "name",              width: 200 },
  { title: "Danh mục",     dataIndex: ["category", "name"], width: 130 },
  { title: "Thương hiệu",  dataIndex: ["brand", "name"],    width: 130 },
  {
    title: "Giá", dataIndex: "price", width: 140,
    render: (price, record) => (
      <Space direction="vertical" size={0}>
        <span style={{ textDecoration: record.salePrice ? "line-through" : "none", color: "#999" }}>
          {price?.toLocaleString()}₫
        </span>
        {record.salePrice && (
          <span style={{ color: "#ff4d4f", fontWeight: 700 }}>
            {record.salePrice.toLocaleString()}₫
          </span>
        )}
      </Space>
    ),
  },
  // {
  //   title: "Tồn kho", dataIndex: "stockQuantity", width: 100,
  //   render: (qty) => <Tag color={qty > 0 ? "green" : "red"}>{qty}</Tag>,
  // },
  // { title: "Đã bán",   dataIndex: "soldCount",  width: 90 },
  // { title: "Lượt xem", dataIndex: "viewCount",  width: 90 },
  {
    title: "Trạng thái", dataIndex: "status", width: 140,
    render: (status: ProductStatus) => (
      <Tag color={STATUS_COLOR[status]}>{STATUS_TEXT[status]}</Tag>
    ),
  },
  {
    title: "Hành động", fixed: "right", width: 130,
    render: (_, record) => (
      <Space>
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onView(record.id)}
        >
          Xem
        </Button>
        <Button type="primary" size="small" onClick={() => onEdit(record.id)}>Sửa</Button>
        <Popconfirm
          title="Xóa sản phẩm này?"
          description="Hành động này không thể hoàn tác!"
          onConfirm={() => onDelete(record.id)}
          okText="Xóa" cancelText="Hủy"
        >
          <Button danger size="small" loading={deleting}>Xóa</Button>
        </Popconfirm>
      </Space>
    ),
  },
];