import {
  Table,
  Image,
  InputNumber,
  Button,
  Card,
  Typography,
  Space,
  Popconfirm,
  Spin,
  message,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../../../hooks/Cart/useCart";
import { useUpdateCartItemQuantity } from "../../../hooks/Cart/useUpdateCartItemQuantity";
import { useRemoveCartItem } from "../../../hooks/Cart/useRemoveCartItem";
import { useClearCart } from "../../../hooks/Cart/useClearCart";
import type { ColumnsType } from "antd/es/table";
import type { CartItem } from "../../../types/entity.type";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { OrderRequestItem } from "../../../types/request.type";

const { Title, Text } = Typography;

const CartPage = () => {
  const { data: cart, isLoading } = useCart();
  const updateMutation = useUpdateCartItemQuantity();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<CartItem> = [
    {
      title: "Ảnh",
      dataIndex: ["product", "mainImage"],
      width: 100,
      render: (url) => (
        <Image
          width={80}
          height={80}
          style={{ objectFit: "cover", borderRadius: 6 }}
          src={url}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: ["product", "name"],
      render: (_, r) => (
        <div>
          <Text strong>{r.product?.name}</Text>
          <br />
          <Text type="secondary">ID: {r.product?.id}</Text>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: ["product", "salePrice"],
      render: (price) => `${price?.toLocaleString() ?? 0} ₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (qty, r) => (
        <InputNumber
          min={1}
          value={qty}
          onChange={(value) => {
            if (!value || value === qty) return;
            updateMutation.mutate({ cartItemId: r.id, quantity: value });
          }}
        />
      ),
    },
    {
      title: "Thành tiền",
      render: (_, r) => (
        <Text strong>
          {((r.product?.salePrice || 0) * r.quantity).toLocaleString()} ₫
        </Text>
      ),
    },
    {
      title: "",
      width: 60,
      render: (_, r) => (
        <Popconfirm
          title="Xóa sản phẩm khỏi giỏ?"
          onConfirm={() => removeMutation.mutate(r.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin />
      </div>
    );
  }

  const items: CartItem[] = cart?.items ?? [];
  const selectedItems = items.filter((i) => selectedRowKeys.includes(i.id));

  const total = selectedItems.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }

    const orderItems:OrderRequestItem[]=selectedItems.map(
      (i) =>({productId:i.product?.id,quantity:i.quantity})
    );

    navigate("/admin/checkout", {
      state: {
        orderItems,
      },
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2}>🛒 Giỏ hàng</Title>

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          pagination={false}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        />
      </Card>

      <Card style={{ marginTop: 16, textAlign: "right" }}>
        <Space orientation="vertical" size="middle">
          <Title level={4}>Tổng thanh toán: {total.toLocaleString()} ₫</Title>

          <Space>
            <Popconfirm
              title="Xóa toàn bộ giỏ hàng?"
              onConfirm={() => clearMutation.mutate()}
            >
              <Button danger>Clear cart</Button>
            </Popconfirm>

            <Button type="primary" size="large" onClick={handleCheckout}>
              Đặt hàng
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default CartPage;

