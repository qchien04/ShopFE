import React, { useState } from 'react';
import {
  Card,
  Typography,
  Tag,
  Space,
  Image,
  Spin,
  Empty,
  Divider,
  Button,
  Tabs,
  Modal,
  message,
  Steps,
  Timeline,
  Descriptions,
  Radio
} from 'antd';
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  DollarOutlined,
  EyeOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { useMyOrders } from '../../../hooks/Order/useOrder';
import type { Order } from '../../../types/entity.type';
import { OrderStatus, PaymentStatus, PaymentMethod } from '../../../types/entity.type';
import './OrderListPage.scss';
import { paymentApi } from '../../../api/payment.api';
const { Title, Text } = Typography;

const OrderListPage = () => {
  const { data, isLoading } = useMyOrders();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOMO);

  const statusMap: Record<OrderStatus, { color: string; label: string; icon: any }> = {
    [OrderStatus.PENDING]: { 
      color: 'gold', 
      label: 'Chờ xác nhận',
      icon: <ClockCircleOutlined />
    },
    [OrderStatus.CONFIRMED]: { 
      color: 'blue', 
      label: 'Đã xác nhận',
      icon: <CheckCircleOutlined />
    },
    [OrderStatus.PROCESSING]: { 
      color: 'cyan', 
      label: 'Đang xử lý',
      icon: <ShoppingCartOutlined />
    },
    [OrderStatus.SHIPPING]: { 
      color: 'purple', 
      label: 'Đang giao',
      icon: <TruckOutlined />
    },
    [OrderStatus.DELIVERED]: { 
      color: 'success', 
      label: 'Đã giao',
      icon: <CheckCircleOutlined />
    },
    [OrderStatus.CANCELLED]: { 
      color: 'error', 
      label: 'Đã hủy',
      icon: <CloseCircleOutlined />
    },
    [OrderStatus.RETURNED]: { 
      color: 'warning', 
      label: 'Đã trả hàng',
      icon: <CloseCircleOutlined />
    }
  };

  const paymentStatusMap: Record<PaymentStatus, { color: string; label: string }> = {
    [PaymentStatus.UNPAID]: { color: 'error', label: 'Chưa thanh toán' },
    [PaymentStatus.PAID]: { color: 'success', label: 'Đã thanh toán' },
    [PaymentStatus.REFUNDED]: { color: 'warning', label: 'Đã hoàn tiền' }
  };

  const paymentMethodMap: Record<PaymentMethod, { label: string; icon: any }> = {
    [PaymentMethod.BANK_TRANSFER]: { label: 'Chuyển khoản ngân hàng', icon: <BankOutlined /> },
    [PaymentMethod.MOMO]: { label: 'Ví MoMo', icon: <WalletOutlined /> },
    [PaymentMethod.VNPAY]: { label: 'VNPay', icon: <CreditCardOutlined /> },
    [PaymentMethod.ZALOPAY]: { label: 'ZaloPay', icon: <WalletOutlined /> }
  };

  const filterOrders = (status: string) => {
    if (!data) return [];
    if (status === 'ALL') return data;
    return data.filter((order: Order) => order.status === status);
  };

  const getOrderCounts = () => {
    if (!data) return { ALL: 0 };
    
    return {
      ALL: data.length,
      [OrderStatus.PENDING]: data.filter((o: Order) => o.status === OrderStatus.PENDING).length,
      [OrderStatus.PROCESSING]: data.filter((o: Order) => 
        o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PROCESSING
      ).length,
      [OrderStatus.SHIPPING]: data.filter((o: Order) => o.status === OrderStatus.SHIPPING).length,
      [OrderStatus.DELIVERED]: data.filter((o: Order) => o.status === OrderStatus.DELIVERED).length,
      [OrderStatus.CANCELLED]: data.filter((o: Order) => o.status === OrderStatus.CANCELLED).length
    };
  };

  const handleViewDetail = (order: Order) => {
    const ok=paymentApi.payOSOder(order.orderNumber);
    console.log(ok)
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handlePayment = (order: Order) => {
    setSelectedOrder(order);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (id:any) => {
    if(id==undefined) return;
    if (!selectedOrder) return;

    try {
      try {
        const response=await paymentApi.pay({
          orderId: id,
          paymentMethod: selectedPaymentMethod,
        })
  
        console.log(response)
        window.location.href = response.checkoutUrl;
 
  
      } catch (err) {
        message.error("Không thể tạo thanh toán!");
        console.error(err);
      }      
      
      setPaymentModalOpen(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi thanh toán');
    }
  };

  const handleCancelOrder = (order: Order) => {
    Modal.confirm({
      title: 'Hủy đơn hàng',
      content: `Bạn có chắc muốn hủy đơn hàng ${order.orderNumber}?`,
      okText: 'Hủy đơn',
      cancelText: 'Không',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // Call API to cancel order
          message.success('Đã hủy đơn hàng');
        } catch (error) {
          message.error('Không thể hủy đơn hàng');
        }
      }
    });
  };

  const getOrderProgress = (status: OrderStatus) => {
    const steps = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPING,
      OrderStatus.DELIVERED
    ];
    return steps.indexOf(status);
  };

  const counts = getOrderCounts();
  const filteredOrders = filterOrders(activeTab);

  const tabItems = [
    {
      key: 'ALL',
      label: `Tất cả (${counts.ALL || 0})`
    },
    {
      key: OrderStatus.PENDING,
      label: (
        <span>
          <ClockCircleOutlined /> Chờ xác nhận ({counts[OrderStatus.PENDING] || 0})
        </span>
      )
    },
    {
      key: OrderStatus.PROCESSING,
      label: (
        <span>
          <ShoppingCartOutlined /> Đang xử lý ({counts[OrderStatus.PROCESSING] || 0})
        </span>
      )
    },
    {
      key: OrderStatus.SHIPPING,
      label: (
        <span>
          <TruckOutlined /> Đang giao ({counts[OrderStatus.SHIPPING] || 0})
        </span>
      )
    },
    {
      key: OrderStatus.DELIVERED,
      label: (
        <span>
          <CheckCircleOutlined /> Hoàn thành ({counts[OrderStatus.DELIVERED] || 0})
        </span>
      )
    },
    {
      key: OrderStatus.CANCELLED,
      label: (
        <span>
          <CloseCircleOutlined /> Đã hủy ({counts[OrderStatus.CANCELLED] || 0})
        </span>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-container">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Bạn chưa có đơn hàng nào"
        >
          <Button type="primary" href="/">
            Mua sắm ngay
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="order-list-page">
      <div className="page-header">
        <Title level={2}>
          <ShoppingCartOutlined /> Đơn hàng của tôi
        </Title>
        <Text type="secondary">Quản lý đơn hàng và theo dõi tình trạng giao hàng</Text>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="order-tabs"
      />

      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <Empty description="Không có đơn hàng nào" />
        ) : (
          <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {filteredOrders.map((order: Order) => (
              <Card key={order.id} className="order-card">
                {/* Header */}
                <div className="order-header">
                  <div className="order-info">
                    <Text strong className="order-number">
                      Mã đơn: {order.orderNumber}
                    </Text>
                    <Tag 
                      color={statusMap[order.status].color}
                      icon={statusMap[order.status].icon}
                      className="status-tag"
                    >
                      {statusMap[order.status].label}
                    </Tag>
                  </div>
                  <Text type="secondary" className="order-date">
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </div>

                <Divider />

                {/* Items */}
                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <Image
                        src={item.productImage}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                        preview={false}
                      />
                      <div className="item-details">
                        <Text strong className="item-name">{item.productName}</Text>
                        <Text type="secondary" className="item-sku">
                          SKU: {item.productSku}
                        </Text>
                        <Text className="item-quantity">
                          Số lượng: x{item.quantity}
                        </Text>
                      </div>
                      <div className="item-pricing">
                        <Text className="item-price">
                          {item.price.toLocaleString('vi-VN')}₫
                        </Text>
                        <Text strong className="item-subtotal">
                          {item.subtotal.toLocaleString('vi-VN')}₫
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />

                {/* Payment Status */}
                <div className="payment-info">
                  <Space>
                    <Text type="secondary">Thanh toán:</Text>
                    <Tag color={paymentStatusMap[order.paymentStatus as PaymentStatus]?.color || 'default'}>
                      {paymentStatusMap[order.paymentStatus as PaymentStatus]?.label || 'N/A'}
                    </Tag>
                    {order.paymentMethod && (
                      <Tag icon={paymentMethodMap[order.paymentMethod].icon}>
                        {paymentMethodMap[order.paymentMethod].label}
                      </Tag>
                    )}
                  </Space>
                </div>

                <Divider />

                {/* Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <Text type="secondary">Tổng tiền:</Text>
                    <Title level={4} style={{ margin: 0, color: '#ff4444' }}>
                      {order.total.toLocaleString('vi-VN')}₫
                    </Title>
                  </div>

                  <Space className="order-actions">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(order)}
                    >
                      Chi tiết
                    </Button>

                    {order.paymentStatus === PaymentStatus.UNPAID && 
                     order.status !== OrderStatus.CANCELLED && (
                      <Button
                        type="primary"
                        icon={<DollarOutlined />}
                        onClick={() => handlePayment(order)}
                      >
                        Thanh toán
                      </Button>
                    )}

                    {order.status === OrderStatus.PENDING && (
                      <Button
                        danger
                        onClick={() => handleCancelOrder(order)}
                      >
                        Hủy đơn
                      </Button>
                    )}

                    {order.status === OrderStatus.DELIVERED && (
                      <Button type="primary">
                        Mua lại
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            ))}
          </Space>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={detailModalOpen}
        title={`Chi tiết đơn hàng ${selectedOrder?.orderNumber}`}
        onCancel={() => setDetailModalOpen(false)}
        width={800}
        footer={null}
        className="order-detail-modal"
      >
        {selectedOrder && (
          <div>
            {/* Progress Steps */}
            <Steps
              current={getOrderProgress(selectedOrder.status)}
              items={[
                { title: 'Đặt hàng', icon: <ShoppingCartOutlined /> },
                { title: 'Xác nhận', icon: <CheckCircleOutlined /> },
                { title: 'Đang xử lý', icon: <ClockCircleOutlined /> },
                { title: 'Đang giao', icon: <TruckOutlined /> },
                { title: 'Hoàn thành', icon: <CheckCircleOutlined /> }
              ]}
              style={{ marginBottom: 32 }}
            />

            <Divider />

            {/* Order Info */}
            <Descriptions title="Thông tin đơn hàng" bordered column={2}>
              <Descriptions.Item label="Mã đơn hàng" span={2}>
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusMap[selectedOrder.status].color}>
                  {statusMap[selectedOrder.status].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                <Tag color={paymentStatusMap[selectedOrder.paymentStatus as PaymentStatus]?.color}>
                  {paymentStatusMap[selectedOrder.paymentStatus as PaymentStatus]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedOrder.note || 'Không có ghi chú'}
              </Descriptions.Item>
            </Descriptions>

            {/* Timeline */}
            <Divider />
            <Title level={5}>Lịch sử đơn hàng</Title>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <p><strong>Đặt hàng thành công</strong></p>
                      <p>{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    </>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        open={paymentModalOpen}
        title="Thanh toán đơn hàng"
        onCancel={() => setPaymentModalOpen(false)}
        onOk={()=>handleConfirmPayment(selectedOrder?.id)}
        okText="Thanh toán"
        cancelText="Hủy"
        width={600}
      >
        {selectedOrder && (
          <div className="payment-modal-content">
            <div className="payment-summary">
              <Text strong style={{ fontSize: 16 }}>
                Tổng thanh toán:
              </Text>
              <Title level={3} style={{ color: '#ff4444', margin: '8px 0' }}>
                {selectedOrder.total.toLocaleString('vi-VN')}₫
              </Title>
            </div>

            <Divider />

            <Title level={5}>Chọn phương thức thanh toán</Title>
            <Radio.Group
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(paymentMethodMap).map(([key, value]) => (
                  <Radio key={key} value={key} className="payment-method-option">
                    <Space>
                      {value.icon}
                      <Text strong>{value.label}</Text>
                    </Space>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderListPage;