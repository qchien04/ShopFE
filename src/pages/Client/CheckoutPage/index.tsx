// =======================
// CheckoutPage.tsx (IMPROVED UI)
// =======================
import { Card, Typography, Space, Button, Modal, Radio, Divider, message, Spin, Row, Col, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { EnvironmentOutlined, EditOutlined, ShoppingOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useCustomerAddresses } from "../../../hooks/CustomerAddress/useAddress";
import { PaymentMethod, type CustomerAddress } from "../../../types/entity.type";
import type { CreateOrderRequest, OrderRequestItem } from "../../../types/request.type";
import { orderApi } from "../../../api/order.api";
import { useProductVariantsByIds } from "../../../hooks/Product/useProductList";

const { Title: CTitle, Text } = Typography;

const CheckoutPage = () => {
  const { state } = useLocation() as { state: { orderItems: OrderRequestItem[] } };
  const navigate = useNavigate();
  const { data: addresses } = useCustomerAddresses();
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);

  // ===== LẤY DANH SÁCH PRODUCT THEO productId =====
  const productIds = useMemo(
    () => state.orderItems.map((i) => i.productVariantId),
    [state.orderItems]
  );
  const { data: products, isLoading } = useProductVariantsByIds(productIds);

  // ===== MERGE PRODUCT + QUANTITY =====
  const items = useMemo(() => {
    if (!products) return [];
    return state.orderItems.map((oi) => {
      const product = products.find((p) => p.id === oi.productVariantId);
      return {
        product,
        quantity: oi.quantity,
      };
    });
  }, [products, state.orderItems]);

  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.salePrice || 0) * i.quantity,
    0
  );
  const shippingFee =20000;
  const total = subtotal + shippingFee - shippingFee;

  const currentAddress = selectedAddress || addresses?.find((a) => a.isDefault) || addresses?.[0];

  const handleOrder = () => {
    if (!currentAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    const payload: CreateOrderRequest = {
      addressId: currentAddress.id || 0,
      items: state.orderItems,
      paymentMethod: PaymentMethod.BANK_TRANSFER
    };
    console.log("CREATE ORDER", payload);
    orderApi.createOrder(payload);
    message.success("Đặt hàng thành công");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "0 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <CTitle level={2} style={{ marginTop: 10, color: "#1890ff" }}>
          <ShoppingOutlined /> Thanh toán
        </CTitle>

        <Row gutter={[16, 16]}>
          {/* LEFT COLUMN */}
          <Col xs={24} lg={16}>
            {/* ĐỊA CHỈ GIAO HÀNG */}
            <Card
              style={{ marginBottom: 16 }}
              title={
                <Space>
                  <EnvironmentOutlined style={{ color: "#1890ff" }} />
                  <span>Địa chỉ nhận hàng</span>
                </Space>
              }
            >
              {currentAddress ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ fontSize: 16 }}>
                      {currentAddress.fullName}
                      {currentAddress.isDefault && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>Mặc định</Tag>
                      )}
                    </Text>
                    <Text type="secondary">{currentAddress.phone}</Text>
                    <Text>
                      {currentAddress.detailAddress}, {currentAddress.ward}, {currentAddress.district}, {currentAddress.province}
                    </Text>
                  </Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => setOpen(true)}>
                    Thay đổi
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Text type="secondary">Chưa có địa chỉ giao hàng</Text>
                  <br />
                  <Button type="primary" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
                    Thêm địa chỉ
                  </Button>
                </div>
              )}
            </Card>

            {/* DANH SÁCH SẢN PHẨM */}
            <Card title={`Sản phẩm (${items.length})`}>
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {items.map((i, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: 16,
                      paddingBottom: idx < items.length - 1 ? 16 : 0,
                      borderBottom: idx < items.length - 1 ? "1px solid #f0f0f0" : "none"
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        background: "#fafafa",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <ShoppingOutlined style={{ fontSize: 32, color: "#d9d9d9" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Text strong style={{ fontSize: 15 }}>{i.product?.name}</Text>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text type="secondary">Số lượng: {i.quantity}</Text>
                        <Text strong style={{ fontSize: 16, color: "#ff4d4f" }}>
                          {((i.product?.price || 0) * i.quantity).toLocaleString()} ₫
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* RIGHT COLUMN - THANH TOÁN */}
          <Col xs={24} lg={8}>
            <Card
              title="Tổng thanh toán"
              style={{ position: "sticky", top: 160 }}
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Tạm tính</Text>
                  <Text>{subtotal.toLocaleString()} ₫</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Phí vận chuyển</Text>
                  <Text>{shippingFee.toLocaleString()} ₫</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Giảm giá</Text>
                  <Text>{shippingFee.toLocaleString()} ₫</Text>
                </div>
                <Divider style={{ margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ fontSize: 16 }}>Tổng cộng</Text>
                  <Text strong style={{ fontSize: 20, color: "#ff4d4f" }}>
                    {total.toLocaleString()} ₫
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{ marginTop: 16, height: 48, fontSize: 16 }}
                  onClick={handleOrder}
                  disabled={!currentAddress}
                >
                  Đặt hàng
                </Button>
                <Text type="secondary" style={{ fontSize: 12, textAlign: "center", display: "block" }}>
                  Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* MODAL CHỌN ĐỊA CHỈ */}
        <Modal
          title={
            <Space>
              <EnvironmentOutlined />
              Chọn địa chỉ giao hàng
            </Space>
          }
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => setOpen(false)}
          width={600}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Radio.Group
            style={{ width: "100%" }}
            value={selectedAddress?.id || currentAddress?.id}
            onChange={(e) => {
              const addr = addresses?.find((a) => a.id === e.target.value);
              if (addr) setSelectedAddress(addr);
            }}
          >
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {addresses?.map((addr) => (
                <Card
                  key={addr.id}
                  size="small"
                  hoverable
                  style={{
                    border: selectedAddress?.id === addr.id || currentAddress?.id === addr.id
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9"
                  }}
                >
                  <Radio value={addr.id} style={{ width: "100%" }}>
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Text strong>{addr.fullName}</Text>
                        {addr.isDefault && <Tag color="blue" icon={<CheckCircleFilled />}>Mặc định</Tag>}
                      </div>
                      <Text type="secondary">{addr.phone}</Text>
                      <Text>
                        {addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}
                      </Text>
                    </Space>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;