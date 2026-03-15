import { OrderStatus, PaymentStatus, PaymentMethod } from '../../../../types/entity.type';
import {
  ShoppingCartOutlined, ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, TruckOutlined, BankOutlined, WalletOutlined
} from '@ant-design/icons';

export const statusMap: Record<OrderStatus, { color: string; label: string; icon: React.ReactNode }> = {
  [OrderStatus.PENDING]:    { color: 'gold',    label: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
  [OrderStatus.CONFIRMED]:  { color: 'blue',    label: 'Đã xác nhận',  icon: <CheckCircleOutlined /> },
  [OrderStatus.PROCESSING]: { color: 'cyan',    label: 'Đang xử lý',   icon: <ShoppingCartOutlined /> },
  [OrderStatus.SHIPPING]:   { color: 'purple',  label: 'Đang giao',    icon: <TruckOutlined /> },
  [OrderStatus.DELIVERED]:  { color: 'success', label: 'Đã giao',      icon: <CheckCircleOutlined /> },
  [OrderStatus.CANCELLED]:  { color: 'error',   label: 'Đã hủy',       icon: <CloseCircleOutlined /> },
  [OrderStatus.DELIVERY_FAILED]:  { color: 'warning',   label: 'Giao thất bại',       icon: <CloseCircleOutlined /> },
  [OrderStatus.RETURNED]:   { color: 'warning', label: 'Đã trả hàng',  icon: <CloseCircleOutlined /> },
};

export const paymentStatusMap: Record<PaymentStatus, { color: string; label: string }> = {
  [PaymentStatus.UNPAID]:   { color: 'error',   label: 'Chưa TT' },
  [PaymentStatus.PAID]:     { color: 'success', label: 'Đã TT' },
  [PaymentStatus.REFUNDED]: { color: 'warning', label: 'Hoàn tiền' },
};

export const paymentMethodMap: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  [PaymentMethod.BANK_TRANSFER]: { label: 'Chuyển khoản', icon: <BankOutlined /> },
  [PaymentMethod.COD]:           { label: 'COD',          icon: <WalletOutlined /> },
};