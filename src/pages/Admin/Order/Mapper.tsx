import { OrderStatus,PaymentStatus, PaymentMethod, type Order} from '../../../types/entity.type';
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  TruckOutlined
} from '@ant-design/icons';
export const statusColors: Record<OrderStatus, string> = {
  PENDING: 'gold',
  CONFIRMED: 'blue',
  PROCESSING: 'cyan',
  SHIPPING: 'purple',
  DELIVERED: 'success',
  CANCELLED: 'error',
  RETURNED: 'warning'
};

export  const statusText: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
  RETURNED: 'Đã trả hàng'
};

export  const paymentMethodText: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Chuyển khoản',
  COD: 'Thanh toán khi nhận hàng'
};

export  const paymentStatusColors: Record<PaymentStatus, string> = {
  UNPAID: 'error',
  PAID: 'success',
  REFUNDED: 'warning'
};

export const paymentStatusText: Record<PaymentStatus, string> = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền'
};


export const getStatusActions = (order: Order) => {
  const actions: { key: OrderStatus; label: string; icon: any }[] = [];

  switch (order.status) {
    case OrderStatus.PENDING:
      actions.push(
        { key: OrderStatus.CONFIRMED, label: 'Xác nhận', icon: <CheckOutlined /> },
        { key: OrderStatus.CANCELLED, label: 'Hủy đơn', icon: <CloseOutlined /> }
      );
      break;
    case OrderStatus.CONFIRMED:
      actions.push(
        { key: OrderStatus.PROCESSING, label: 'Xử lý', icon: <ClockCircleOutlined /> },
        { key: OrderStatus.CANCELLED, label: 'Hủy đơn', icon: <CloseOutlined /> }
      );
      break;
    case OrderStatus.PROCESSING:
      actions.push(
        { key: OrderStatus.SHIPPING, label: 'Giao hàng', icon: <TruckOutlined /> }
      );
      break;
    case OrderStatus.SHIPPING:
      actions.push(
        { key: OrderStatus.DELIVERED, label: 'Đã giao', icon: <CheckOutlined /> }
      );
      break;
    case OrderStatus.DELIVERED:
      actions.push(
        { key: OrderStatus.RETURNED, label: 'Hoàn trả', icon: <CloseOutlined /> }
      );
      break;
  }

  return actions;
};