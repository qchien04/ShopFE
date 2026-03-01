import {
  Image,
  InputNumber,
  Button,
  Card,
  Typography,
  Popconfirm,
  Spin,
  Checkbox,
  message,
  Empty,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCart } from "../../../hooks/Cart/useCart";
import { useUpdateCartItemQuantity } from "../../../hooks/Cart/useUpdateCartItemQuantity";
import { useRemoveCartItem } from "../../../hooks/Cart/useRemoveCartItem";
import { useClearCart } from "../../../hooks/Cart/useClearCart";
import type { CartItem } from "../../../types/entity.type";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { OrderRequestItem } from "../../../types/request.type";

const { Text, Title } = Typography;

const CartPage = () => {
  const { data: cart, isLoading } = useCart();
  const updateMutation = useUpdateCartItemQuantity();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const items: CartItem[] = cart?.items ?? [];
  const selectedItems = items.filter((i) => selectedKeys.includes(i.id));
  const allChecked = items.length > 0 && selectedKeys.length === items.length;
  const indeterminate = selectedKeys.length > 0 && selectedKeys.length < items.length;

  const total = selectedItems.reduce(
    (sum, i) => sum + (i.product?.salePrice || 0) * i.quantity,
    0
  );

  const toggleAll = (checked: boolean) =>
    setSelectedKeys(checked ? items.map((i) => i.id) : []);

  const toggleOne = (id: React.Key, checked: boolean) =>
    setSelectedKeys((prev) =>
      checked ? [...prev, id] : prev.filter((k) => k !== id)
    );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    const orderItems: OrderRequestItem[] = selectedItems.map((i) => ({
      productId: i.product?.id,
      quantity: i.quantity,
    }));
    navigate("/checkout", { state: { orderItems } });
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm");
      return;
    }
    selectedItems.forEach((item) => removeMutation.mutate(item.id));
    setSelectedKeys([]);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px 16px 60px",
        boxSizing: "border-box",
      }}
    >
      <Title level={3} style={{ marginBottom: 20 }}>
        🛒 Giỏ hàng ({items.length})
      </Title>

      {items.length === 0 ? (
        <Card>
          <Empty description="Giỏ hàng trống" />
        </Card>
      ) : (
        <>
          {/* SELECT ALL */}
          <Card
            size="small"
            style={{ marginBottom: 8, borderRadius: 8 }}
            bodyStyle={{ padding: "10px 16px" }}
          >
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              onChange={(e) => toggleAll(e.target.checked)}
            >
              <Text strong>Chọn tất cả ({items.length} sản phẩm)</Text>
            </Checkbox>
          </Card>

          {/* ITEM CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item) => {
              const checked = selectedKeys.includes(item.id);
              const subtotal = (item.product?.salePrice || 0) * item.quantity;

              return (
                <Card
                  key={item.id}
                  size="small"
                  style={{
                    borderRadius: 8,
                    borderColor: checked ? "#00b96b" : undefined,
                    transition: "border-color 0.2s",
                  }}
                  bodyStyle={{ padding: 12 }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {/* Checkbox */}
                    <Checkbox
                      checked={checked}
                      onChange={(e) => toggleOne(item.id, e.target.checked)}
                    />

                    {/* Image */}
                    <Image
                      width={80}
                      height={80}
                      src={item.product?.mainImage}
                      style={{ objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
                      preview={false}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={item.product?.name}
                      >
                        {item.product?.name}
                      </Text>

                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.product?.salePrice?.toLocaleString()} ₫ / sản phẩm
                      </Text>

                      {/* Qty + subtotal + delete */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 8,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          size="small"
                          style={{ width: 80 }}
                          onChange={(value) => {
                            if (!value || value === item.quantity) return;
                            updateMutation.mutate({
                              cartItemId: item.id,
                              quantity: value,
                            });
                          }}
                        />

                        <Text strong style={{ color: "#e53935", fontSize: 15 }}>
                          {subtotal.toLocaleString()} ₫
                        </Text>

                        <Popconfirm
                          title="Xóa sản phẩm này?"
                          onConfirm={() => removeMutation.mutate(item.id)}
                        >
                          <Button
                            danger
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* SUMMARY — sticky ở bottom */}
          <Card
            style={{
              marginTop: 12,
              borderRadius: 8,
              position: "sticky",
              bottom: 16,
              boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
            }}
            bodyStyle={{ padding: "14px 16px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {/* Tổng tiền */}
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Tổng ({selectedItems.length} sản phẩm)
                </Text>
                <Title level={4} style={{ margin: 0, color: "#e53935" }}>
                  {total.toLocaleString()} ₫
                </Title>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Popconfirm
                  title="Xóa các sản phẩm đã chọn?"
                  onConfirm={handleRemoveSelected}
                  disabled={selectedKeys.length === 0}
                >
                  <Button danger disabled={selectedKeys.length === 0}>
                    Xóa đã chọn
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Xóa toàn bộ giỏ hàng?"
                  onConfirm={() => clearMutation.mutate()}
                >
                  <Button danger>Xóa tất cả</Button>
                </Popconfirm>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  style={{
                    minWidth: 130,
                    background: "#00b96b",
                    borderColor: "#00b96b",
                  }}
                >
                  Đặt hàng ({selectedItems.length})
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default CartPage;