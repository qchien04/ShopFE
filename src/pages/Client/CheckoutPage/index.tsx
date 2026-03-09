import { Card, Typography, Space, Button, Modal, Radio, Divider, message, Spin, Row, Col, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  EnvironmentOutlined, EditOutlined, ShoppingOutlined,
  CheckCircleFilled, PlusOutlined, BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useCustomerAddresses } from "../../../hooks/CustomerAddress/useAddress";
import { PaymentMethod, type CustomerAddress } from "../../../types/entity.type";
import type { CreateOrderRequest, OrderRequestItem } from "../../../types/request.type";
import { orderApi } from "../../../api/order.api";
import { paymentApi } from "../../../api/payment.api";
import { useProductVariantsByIds } from "../../../hooks/Product/useProductList";
import CustomerAddressFormModal from "../../../components/AddressFormModal/AddressFormModal";
import { PaymentMethodCard } from "./PaymentMethodCard";

const { Title: CTitle, Text } = Typography;


const CheckoutPage = () => {
  const { state } = useLocation() as { state: { orderItems: OrderRequestItem[] } };
  const navigate  = useNavigate();
  const { data: addresses } = useCustomerAddresses();

  const [open,            setOpen]            = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<CustomerAddress | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress,  setEditingAddress]  = useState<CustomerAddress | undefined>();
  const [payMethod,       setPayMethod]       = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);
  const [redirecting,     setRedirecting]     = useState(false); // fullscreen spin

  const productIds = useMemo(
    () => state.orderItems.map((i) => i.productVariantId),
    [state.orderItems]
  );
  const { data: products, isLoading } = useProductVariantsByIds(productIds);

  const items = useMemo(() => {
    if (!products) return [];
    return state.orderItems.map((oi) => ({
      product: products.find((p) => p.id === oi.productVariantId),
      quantity: oi.quantity,
    }));
  }, [products, state.orderItems]);

  const subtotal    = items.reduce((sum, i) => sum + (i.product?.salePrice || 0) * i.quantity, 0);
  const shippingFee = 20000;
  const discount    = shippingFee;
  const total       = subtotal + shippingFee - discount;

  const currentAddress = selectedAddress || addresses?.find((a) => a.isDefault) || addresses?.[0];

  const openAddressForm = (addr?: CustomerAddress) => {
    setEditingAddress(addr);
    setAddressFormOpen(true);
  };

  const handleOrder = async () => {
    if (!currentAddress) { message.error("Vui lòng chọn địa chỉ giao hàng"); return; }

    setRedirecting(true);
    try {
      const payload: CreateOrderRequest = {
        addressId: currentAddress.id || 0,
        items: state.orderItems,
        paymentMethod: payMethod,
      };

      const order = await orderApi.createOrder(payload);

      if (payMethod === PaymentMethod.BANK_TRANSFER) {
        const res = await paymentApi.pay({ orderId: order.id, paymentMethod: PaymentMethod.BANK_TRANSFER });
        window.location.href = res.checkoutUrl;
      } else {
        message.success("Đặt hàng thành công!");
        navigate("/orders");
      }
    } catch (err: any) {
      message.error(err?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
      setRedirecting(false); // chỉ tắt spin nếu lỗi
    }
  };

  if (isLoading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Spin fullscreen size="large" tip="Đang tải thông tin đơn hàng..." />
    </div>
  );

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {redirecting&&<Spin fullscreen size="large" tip="Đang xử lý đơn hàng..." />}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <CTitle level={2} style={{ marginTop: 16, color: "#111827" }}>
          <ShoppingOutlined /> Thanh toán
        </CTitle>

        <Row gutter={[16, 16]}>
          {/* ── LEFT ── */}
          <Col xs={24} lg={16}>

            {/* Địa chỉ */}
            <Card
              style={{ marginBottom: 16, borderRadius: 12 }}
              title={<Space><EnvironmentOutlined style={{ color: "#00b96b" }} /><span>Địa chỉ nhận hàng</span></Space>}
            >
              {currentAddress ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Space orientation="vertical" size={4}>
                    <Text strong style={{ fontSize: 15 }}>
                      {currentAddress.fullName}
                      {currentAddress.isDefault && <Tag color="green" style={{ marginLeft: 8 }}>Mặc định</Tag>}
                    </Text>
                    <Text type="secondary">{currentAddress.phone}</Text>
                    <Text>
                      {currentAddress.detailAddress}, {currentAddress.ward},{" "}
                      {currentAddress.district}, {currentAddress.province}
                    </Text>
                  </Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => setOpen(true)}>Thay đổi</Button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Text type="secondary">Chưa có địa chỉ giao hàng</Text><br />
                  <Button
                    type="primary" icon={<PlusOutlined />}
                    style={{ marginTop: 12, background: "#00b96b", borderColor: "#00b96b" }}
                    onClick={() => openAddressForm()}
                  >
                    Thêm địa chỉ mới
                  </Button>
                </div>
              )}
            </Card>

            {/* Sản phẩm */}
            <Card title={`Sản phẩm (${items.length})`} style={{ marginBottom: 16, borderRadius: 12 }}>
              <Space orientation="vertical" size={0} style={{ width: "100%" }}>
                {items.map((i, idx) => (
                  <div key={idx} style={{
                    display: "flex", gap: 14, padding: "14px 0",
                    borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}>
                    <div style={{
                      width: 72, height: 72, background: "#f3f4f6", borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <ShoppingOutlined style={{ fontSize: 28, color: "#d1d5db" }} />
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Text strong style={{ fontSize: 14 }}>{i.product?.name}</Text>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>x{i.quantity}</Text>
                        <Text strong style={{ fontSize: 15, color: "#e53935" }}>
                          {((i.product?.salePrice || 0) * i.quantity).toLocaleString("vi-VN")} ₫
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>

            {/* Phương thức thanh toán */}
            <Card
              title={<Space><BankOutlined style={{ color: "#00b96b" }} /><span>Phương thức thanh toán</span></Space>}
              style={{ borderRadius: 12 }}
            >
              <Space orientation="vertical" size={10} style={{ width: "100%" }}>
                <PaymentMethodCard
                  selected={payMethod === PaymentMethod.BANK_TRANSFER}
                  onClick={() => setPayMethod(PaymentMethod.BANK_TRANSFER)}
                  icon={<BankOutlined />}
                  title="Chuyển khoản ngân hàng"
                  desc="Chuyển hướng đến trang thanh toán — xác nhận tự động"
                />
                <PaymentMethodCard
                  selected={payMethod === PaymentMethod.COD}
                  onClick={() => setPayMethod(PaymentMethod.COD)}
                  icon={<WalletOutlined />}
                  title="Thanh toán khi nhận hàng (COD)"
                  desc="Trả tiền mặt khi nhận được hàng"
                />
              </Space>
            </Card>
          </Col>

          {/* ── RIGHT ── */}
          <Col xs={24} lg={8}>
            <Card title="Tóm tắt đơn hàng" style={{ position: "sticky", top: 16, borderRadius: 12 }}>
              <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Tạm tính</Text>
                  <Text>{subtotal.toLocaleString("vi-VN")} ₫</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Phí vận chuyển</Text>
                  <Text>{shippingFee.toLocaleString("vi-VN")} ₫</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">Giảm giá</Text>
                  <Text style={{ color: "#00b96b" }}>-{discount.toLocaleString("vi-VN")} ₫</Text>
                </div>
                <Divider style={{ margin: "4px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text strong style={{ fontSize: 15 }}>Tổng cộng</Text>
                  <Text strong style={{ fontSize: 22, color: "#e53935" }}>
                    {total.toLocaleString("vi-VN")} ₫
                  </Text>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 12px", background: "#f0fdf4",
                  border: "1px solid #d1fae5", borderRadius: 8,
                }}>
                  {payMethod === PaymentMethod.BANK_TRANSFER
                    ? <BankOutlined style={{ color: "#00b96b" }} />
                    : <WalletOutlined style={{ color: "#00b96b" }} />}
                  <Text style={{ fontSize: 13, color: "#065f46" }}>
                    {payMethod === PaymentMethod.BANK_TRANSFER ? "Chuyển khoản ngân hàng" : "Thanh toán COD"}
                  </Text>
                </div>

                <Button
                  type="primary" size="large" block
                  style={{ height: 50, fontSize: 16, borderRadius: 10, background: "#00b96b", borderColor: "#00b96b" }}
                  onClick={handleOrder}
                  disabled={!currentAddress}
                >
                  {payMethod === PaymentMethod.BANK_TRANSFER ? "Đặt hàng & Thanh toán" : "Đặt hàng"}
                </Button>

                <Text type="secondary" style={{ fontSize: 11, textAlign: "center", display: "block" }}>
                  Bằng việc đặt hàng, bạn đồng ý với Điều khoản sử dụng
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Modal chọn địa chỉ */}
        <Modal
          title={<Space><EnvironmentOutlined /> Chọn địa chỉ giao hàng</Space>}
          open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}
          width={600} okText="Xác nhận" cancelText="Hủy"
          footer={(_, { OkBtn, CancelBtn }) => (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button icon={<PlusOutlined />} onClick={() => { setOpen(false); openAddressForm(); }}>
                Thêm địa chỉ mới
              </Button>
              <Space><CancelBtn /><OkBtn /></Space>
            </div>
          )}
        >
          <Radio.Group
            style={{ width: "100%" }}
            value={selectedAddress?.id || currentAddress?.id}
            onChange={(e) => {
              const addr = addresses?.find((a) => a.id === e.target.value);
              if (addr) setSelectedAddress(addr);
            }}
          >
            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              {addresses?.map((addr) => (
                <Card key={addr.id} size="small" hoverable style={{
                  border: (selectedAddress?.id ?? currentAddress?.id) === addr.id
                    ? "2px solid #00b96b" : "1px solid #e5e7eb",
                  borderRadius: 10,
                }}>
                  <Radio value={addr.id} style={{ width: "100%" }}>
                    <Space orientation="vertical" size={3} style={{ marginLeft: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Text strong>{addr.fullName}</Text>
                        {addr.isDefault && <Tag color="green" icon={<CheckCircleFilled />}>Mặc định</Tag>}
                      </div>
                      <Text type="secondary">{addr.phone}</Text>
                      <Text>{addr.detailAddress}, {addr.ward}, {addr.district}, {addr.province}</Text>
                    </Space>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Modal>

        {/* Modal tạo địa chỉ */}
        <CustomerAddressFormModal
          open={addressFormOpen}
          initial={editingAddress}
          onCancel={() => { setAddressFormOpen(false); setEditingAddress(undefined); }}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;