import { useState } from 'react';
import {
  Spin, Empty, Button, Tabs, Modal, message
} from 'antd';
import {
  ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, TruckOutlined,
} from '@ant-design/icons';
import { useMyOrders, useCancelOrder, useConfirmReceivedOrder } from '../../../../hooks/Order/useOrder';
import type { Order } from '../../../../types/entity.type';
import { OrderStatus, PaymentMethod } from '../../../../types/entity.type';
import { paymentApi } from '../../../../api/payment.api';
import OrderClientDetailModal from './OrderClientDetailModal';
import { PaymentModal } from './PaymentModal';
import { OrderCard } from './OrderCard';
import { Pagination } from 'antd';

const TAB_ITEMS = [
  { key: 'ALL', icon: null, label: 'Tất cả' },
  { key: OrderStatus.PENDING, icon: <ClockCircleOutlined />, label: 'Chờ xác nhận' },
  { key: OrderStatus.PROCESSING, icon: <ShoppingCartOutlined />, label: 'Đang xử lý' },
  { key: OrderStatus.SHIPPING, icon: <TruckOutlined />, label: 'Đang giao' },
  { key: OrderStatus.DELIVERED, icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
  { key: OrderStatus.CANCELLED, icon: <CloseCircleOutlined />, label: 'Đã hủy' },
];


const OrderListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const [activeTab, setActiveTab] = useState('ALL');

  const { data, isLoading } = useMyOrders(currentPage - 1, pageSize, activeTab);
  const { mutate: cancelOrder } = useCancelOrder();
  const { mutate: confirmReceived } = useConfirmReceivedOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>(PaymentMethod.BANK_TRANSFER);

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Spin size="large" />
      <p style={{ marginTop: 12, color: '#999' }}>Đang tải đơn hàng...</p>
    </div>
  );

  const orders = data?.content || [];
  const counts = data?.counts || { ALL: 0, PENDING: 0, PROCESSING: 0, SHIPPING: 0, DELIVERED: 0, CANCELLED: 0 };
  const totalElements = data?.totalElements || 0;

  if (totalElements === 0 && activeTab === 'ALL') return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Empty description="Bạn chưa có đơn hàng nào">
        <Button type="primary" href="/" style={{ background: '#00b96b', borderColor: '#00b96b' }}>
          Mua sắm ngay
        </Button>
      </Empty>
    </div>
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
      onOk: () => {
        cancelOrder({ id: order.id, reason: "Khách hàng hủy đơn" });
      },
    });
  };

  const handleConfirmReceived = (order: Order) => {
    Modal.confirm({
      title: 'Xác nhận đã nhận hàng',
      icon: null,
      content: (
        <div style={{ paddingTop: 8 }}>
          <p style={{ margin: 0, marginBottom: 8 }}>Xác nhận bạn đã nhận được đơn hàng <strong>#{order.orderNumber}</strong>?</p>
          <p style={{ margin: 0, fontSize: 12, color: '#f5a623' }}>⚠️ Chỉ xác nhận khi bạn đã nhận được hàng. Sau khi xác nhận, đơn hàng sẽ hoàn thành và không thể khiếu nại giao hàng.</p>
        </div>
      ),
      okText: '✓ Đã nhận được hàng',
      cancelText: 'Chưa nhận',
      okButtonProps: { style: { background: '#00b96b', borderColor: '#00b96b' } },
      onOk: () => { confirmReceived({ id: order.id }); },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: 12 }}>

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

      {orders.length === 0
        ? <Empty description="Không có đơn hàng nào" style={{ padding: 40 }} />
        : orders.map((order: Order) => (
          <OrderCard key={order.id}
            handleCancelOrder={handleCancelOrder}
            handleConfirmReceived={handleConfirmReceived}
            order={order}
            setDetailOpen={setDetailOpen}
            setPaymentOpen={setPaymentOpen}
            setSelectedOrder={setSelectedOrder}
          >
          </OrderCard>
        ))
      }

      {totalElements > pageSize && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalElements}
          onChange={(page) => setCurrentPage(page)}
          style={{ marginTop: 16 }}
        />
      )}

      <OrderClientDetailModal
        detailOpen={detailOpen}
        selectedOrder={selectedOrder!}
        setDetailOpen={setDetailOpen}
        handleCancelOrder={handleCancelOrder}
        handleConfirmReceived={handleConfirmReceived}
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