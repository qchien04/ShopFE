import React, { useState } from 'react';
import {
  Card, Typography, Tag, Space, Image, Spin, Empty,
  Divider, Button, Tabs, Modal, message, Steps,
  Descriptions, Radio
} from 'antd';
import {
  ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, TruckOutlined, DollarOutlined,
  EyeOutlined, BankOutlined, WalletOutlined
} from '@ant-design/icons';
import { useMyOrders } from '../../../hooks/Order/useOrder';
import type { Order } from '../../../types/entity.type';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../../types/entity.type';
import { paymentApi } from '../../../api/payment.api';

const { Title, Text } = Typography;

const statusMap: Record<OrderStatus, { color: string; label: string; icon: React.ReactNode }> = {
  [OrderStatus.PENDING]:    { color: 'gold',    label: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
  [OrderStatus.CONFIRMED]:  { color: 'blue',    label: 'Đã xác nhận',  icon: <CheckCircleOutlined /> },
  [OrderStatus.PROCESSING]: { color: 'cyan',    label: 'Đang xử lý',   icon: <ShoppingCartOutlined /> },
  [OrderStatus.SHIPPING]:   { color: 'purple',  label: 'Đang giao',    icon: <TruckOutlined /> },
  [OrderStatus.DELIVERED]:  { color: 'success', label: 'Đã giao',      icon: <CheckCircleOutlined /> },
  [OrderStatus.CANCELLED]:  { color: 'error',   label: 'Đã hủy',       icon: <CloseCircleOutlined /> },
  [OrderStatus.RETURNED]:   { color: 'warning', label: 'Đã trả hàng',  icon: <CloseCircleOutlined /> },
};

const paymentStatusMap: Record<PaymentStatus, { color: string; label: string }> = {
  [PaymentStatus.UNPAID]:   { color: 'error',   label: 'Chưa TT' },
  [PaymentStatus.PAID]:     { color: 'success', label: 'Đã TT' },
  [PaymentStatus.REFUNDED]: { color: 'warning', label: 'Hoàn tiền' },
};

const paymentMethodMap: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  [PaymentMethod.BANK_TRANSFER]: { label: 'Chuyển khoản', icon: <BankOutlined /> },
  [PaymentMethod.COD]:           { label: 'COD',          icon: <WalletOutlined /> },
};

const TAB_ITEMS = [
  { key: 'ALL',                    icon: null,                    label: 'Tất cả' },
  { key: OrderStatus.PENDING,      icon: <ClockCircleOutlined />, label: 'Chờ xác nhận' },
  { key: OrderStatus.PROCESSING,   icon: <ShoppingCartOutlined />,label: 'Đang xử lý' },
  { key: OrderStatus.SHIPPING,     icon: <TruckOutlined />,       label: 'Đang giao' },
  { key: OrderStatus.DELIVERED,    icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  { key: OrderStatus.CANCELLED,    icon: <CloseCircleOutlined />, label: 'Đã hủy' },
];

const getOrderProgress = (status: OrderStatus) =>
  [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.DELIVERED]
    .indexOf(status);

const OrderListPage = () => {
  const { data, isLoading } = useMyOrders();
  const [activeTab, setActiveTab]             = useState('ALL');
  const [selectedOrder, setSelectedOrder]     = useState<Order | null>(null);
  const [detailOpen, setDetailOpen]           = useState(false);
  const [paymentOpen, setPaymentOpen]         = useState(false);
  const [payMethod, setPayMethod]             = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Spin size="large" />
      <p style={{ marginTop: 12, color: '#999' }}>Đang tải đơn hàng...</p>
    </div>
  );

  if (!data?.length) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Empty description="Bạn chưa có đơn hàng nào">
        <Button type="primary" href="/" style={{ background: '#00b96b', borderColor: '#00b96b' }}>
          Mua sắm ngay
        </Button>
      </Empty>
    </div>
  );

  const counts: Record<string, number> = { ALL: data.length };
  TAB_ITEMS.forEach(t => {
    if (t.key !== 'ALL')
      counts[t.key] = data.filter((o: Order) =>
        t.key === OrderStatus.PROCESSING
          ? o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PROCESSING
          : o.status === t.key
      ).length;
  });

  const filteredOrders = activeTab === 'ALL' ? data : data.filter((o: Order) =>
    activeTab === OrderStatus.PROCESSING
      ? o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PROCESSING
      : o.status === activeTab
  );

  const handleConfirmPayment = async (id?: number) => {
    if (!id || !selectedOrder) return;
    try {
      const res = await paymentApi.pay({ orderId: id, paymentMethod: payMethod });
      window.location.href = res.checkoutUrl;
      setPaymentOpen(false);
    } catch {
      message.error('Không thể tạo thanh toán!');
    }
  };

  const handleCancelOrder = (order: Order) => {
    Modal.confirm({
      title: 'Hủy đơn hàng',
      content: `Xác nhận hủy đơn ${order.orderNumber}?`,
      okText: 'Hủy đơn', cancelText: 'Không',
      okButtonProps: { danger: true },
      onOk: async () => { message.success('Đã hủy đơn hàng'); },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* TABS */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabBarStyle={{ marginBottom: 0 }}
        size="small"
        items={TAB_ITEMS.map(t => ({
          key: t.key,
          label: (
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '2px 0' }}>
              {t.icon && <span style={{ fontSize: 14 }}>{t.icon}</span>}
              <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{t.label}</span>
              <span style={{
                fontSize: 10, lineHeight: '14px',
                background: activeTab === t.key ? '#00b96b' : '#f0f0f0',
                color: activeTab === t.key ? '#fff' : '#888',
                borderRadius: 8, padding: '0 5px', minWidth: 16, textAlign: 'center',
              }}>
                {counts[t.key] ?? 0}
              </span>
            </span>
          ),
        }))}
      />

      {/* ORDER LIST */}
      {filteredOrders.length === 0
        ? <Empty description="Không có đơn hàng nào" style={{ padding: 40 }} />
        : filteredOrders.map((order: Order) => (
          <Card
            key={order.id}
            size="small"
            style={{ borderRadius: 10 }}
            styles={{ body: { padding: 14 } }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Text strong style={{ color: '#1890ff', fontSize: 13 }}>#{order.orderNumber}</Text>
                <Tag color={statusMap[order.status].color} icon={statusMap[order.status].icon} style={{ margin: 0 }}>
                  {statusMap[order.status].label}
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </Text>
            </div>

            <Divider style={{ margin: '10px 0' }} />

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Image
                    src={item.productImage}
                    width={60} height={60}
                    style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                    preview={false}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>x{item.quantity}</Text>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <Text strong style={{ color: '#e53935', fontSize: 13, display: 'block' }}>
                      {item.subtotal.toLocaleString('vi-VN')}₫
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            <Divider style={{ margin: '10px 0' }} />

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              {/* Total + payment status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <Tag color={paymentStatusMap[order.paymentStatus as PaymentStatus]?.color} style={{ margin: 0 }}>
                  {paymentStatusMap[order.paymentStatus as PaymentStatus]?.label}
                </Tag>
                <Text strong style={{ color: '#e53935', fontSize: 15 }}>
                  {order.total.toLocaleString('vi-VN')}₫
                </Text>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Button size="small" icon={<EyeOutlined />} onClick={() => { setSelectedOrder(order); setDetailOpen(true); }}>
                  Chi tiết
                </Button>

                {order.paymentStatus === PaymentStatus.UNPAID && order.status !== OrderStatus.CANCELLED && (
                  <Button size="small" type="primary" icon={<DollarOutlined />}
                    onClick={() => { setSelectedOrder(order); setPaymentOpen(true); }}
                    style={{ background: '#00b96b', borderColor: '#00b96b' }}
                  >
                    Thanh toán
                  </Button>
                )}

                {order.status === OrderStatus.PENDING && (
                  <Button size="small" danger onClick={() => handleCancelOrder(order)}>Hủy</Button>
                )}

                {order.status === OrderStatus.DELIVERED && (
                  <Button size="small" type="primary" style={{ background: '#00b96b', borderColor: '#00b96b' }}>
                    Mua lại
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))
      }

      {/* DETAIL MODAL */}
      <Modal
        open={detailOpen}
        title={<Text strong>Đơn hàng #{selectedOrder?.orderNumber}</Text>}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width="min(720px, 95vw)"
        style={{ top: 20 }}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Steps
              current={getOrderProgress(selectedOrder.status)}
              size="small"
              responsive
              items={[
                { title: 'Đặt hàng' },
                { title: 'Xác nhận' },
                { title: 'Xử lý' },
                { title: 'Giao hàng' },
                { title: 'Hoàn thành' },
              ]}
            />

            <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Mã đơn" span={2}>{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusMap[selectedOrder.status].color}>{statusMap[selectedOrder.status].label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Tag color={paymentStatusMap[selectedOrder.paymentStatus as PaymentStatus]?.color}>
                  {paymentStatusMap[selectedOrder.paymentStatus as PaymentStatus]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <Text strong style={{ color: '#e53935' }}>{selectedOrder.total.toLocaleString('vi-VN')}₫</Text>
              </Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú" span={2}>{selectedOrder.note}</Descriptions.Item>
              )}
            </Descriptions>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Sản phẩm</Text>
              {selectedOrder.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: 10, background: '#fafafa', borderRadius: 8 }}>
                  <Image src={item.productImage} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} preview={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block', fontSize: 13 }}>{item.productName}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>x{item.quantity} · {item.price.toLocaleString('vi-VN')}₫</Text>
                  </div>
                  <Text strong style={{ color: '#e53935', flexShrink: 0 }}>{item.subtotal.toLocaleString('vi-VN')}₫</Text>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal
        open={paymentOpen}
        title="Thanh toán đơn hàng"
        onCancel={() => setPaymentOpen(false)}
        onOk={() => handleConfirmPayment(selectedOrder?.id)}
        okText="Xác nhận thanh toán"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#00b96b', borderColor: '#00b96b' } }}
        width="min(480px, 95vw)"
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f0', borderRadius: 10 }}>
              <Text type="secondary">Tổng thanh toán</Text>
              <Title level={3} style={{ color: '#e53935', margin: '4px 0 0' }}>
                {selectedOrder.total.toLocaleString('vi-VN')}₫
              </Title>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 10 }}>Phương thức thanh toán</Text>
              <Radio.Group value={payMethod} onChange={e => setPayMethod(e.target.value)} style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {Object.entries(paymentMethodMap).map(([key, val]) => (
                    <Radio key={key} value={key} style={{
                      width: '100%', padding: '12px 14px',
                      border: `2px solid ${payMethod === key ? '#00b96b' : '#f0f0f0'}`,
                      borderRadius: 8, background: payMethod === key ? '#f0faf5' : '#fff',
                      transition: 'all 0.2s',
                    }}>
                      <Space>{val.icon}<Text strong>{val.label}</Text></Space>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderListPage;