import { useState } from 'react';
import {
  Spin, Empty, Button, Tabs, Modal, message
} from 'antd';
import {
  ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, TruckOutlined,
} from '@ant-design/icons';
import { useMyOrders } from '../../../../hooks/Order/useOrder';
import type { Order } from '../../../../types/entity.type';
import { OrderStatus, PaymentMethod } from '../../../../types/entity.type';
import { paymentApi } from '../../../../api/payment.api';
import OrderClientDetailModal from './OrderClientDetailModal';
import { PaymentModal } from './PaymentModal';
import { OrderCard } from './OrderCard';
import { Pagination } from 'antd';

const TAB_ITEMS = [
  { key: 'ALL',                    icon: null,                    label: 'Tất cả' },
  { key: OrderStatus.PENDING,      icon: <ClockCircleOutlined />, label: 'Chờ xác nhận' },
  { key: OrderStatus.PROCESSING,   icon: <ShoppingCartOutlined />,label: 'Đang xử lý' },
  { key: OrderStatus.SHIPPING,     icon: <TruckOutlined />,       label: 'Đang giao' },
  { key: OrderStatus.DELIVERED,    icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  { key: OrderStatus.CANCELLED,    icon: <CloseCircleOutlined />, label: 'Đã hủy' },
];


const OrderListPage = () => {
  const { data, isLoading } = useMyOrders();
  const [activeTab, setActiveTab]             = useState('ALL');
  const [selectedOrder, setSelectedOrder]     = useState<Order | null>(null);
  const [detailOpen, setDetailOpen]           = useState(false);
  const [paymentOpen, setPaymentOpen]         = useState(false);
  const [payMethod, setPayMethod]             = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;


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

  const sortedOrders = [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const filteredOrders = activeTab === 'ALL'
  ? sortedOrders
  : sortedOrders.filter((o: Order) =>
      activeTab === OrderStatus.PROCESSING
        ? o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PROCESSING
        : o.status === activeTab
    );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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
    <div style={{ display: 'flex', flexDirection: 'column',alignItems:"center",justifyContent:"center", gap: 12 }}>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setCurrentPage(1);
        }}
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

      {filteredOrders.length === 0
        ? <Empty description="Không có đơn hàng nào" style={{ padding: 40 }} />
        : paginatedOrders.map((order: Order) => (
          <OrderCard key={order.id}
            handleCancelOrder={handleCancelOrder}
            order={order}
            setDetailOpen={setDetailOpen}
            setPaymentOpen={setPaymentOpen}
            setSelectedOrder={setSelectedOrder}
          >
          </OrderCard>
        ))
      }

      {filteredOrders.length > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredOrders.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 16 }}
        />
      )}

      <OrderClientDetailModal 
        detailOpen={detailOpen} 
        selectedOrder={selectedOrder!}
        setDetailOpen={setDetailOpen}
      ></OrderClientDetailModal>

      <PaymentModal 
        handleConfirmPayment={handleConfirmPayment}
        payMethod={payMethod}
        paymentOpen={paymentOpen}
        selectedOrder={selectedOrder!}
        setPayMethod={setPayMethod}
        setPaymentOpen={setPaymentOpen}
      >
      </PaymentModal>
    </div>
  );
};

export default OrderListPage;