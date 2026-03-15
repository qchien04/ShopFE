import { OrderStatus, PaymentStatus, PaymentMethod, type Order } from '../../../types/entity.type';
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  RollbackOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export const statusColors: Record<OrderStatus, string> = {
  PENDING:          'gold',
  CONFIRMED:        'blue',
  PROCESSING:       'cyan',
  SHIPPING:         'purple',
  DELIVERED:        'success',
  DELIVERY_FAILED:  'volcano',   // ← cam đỏ, dễ phân biệt với CANCELLED
  CANCELLED:        'error',
  RETURNED:         'warning',
};

export const statusText: Record<OrderStatus, string> = {
  PENDING:          'Chờ xác nhận',
  CONFIRMED:        'Đã xác nhận',
  PROCESSING:       'Đang xử lý',
  SHIPPING:         'Đang giao',
  DELIVERED:        'Đã giao',
  DELIVERY_FAILED:  'Giao thất bại',
  CANCELLED:        'Đã hủy',
  RETURNED:         'Đã hoàn hàng',
};

export const paymentMethodText: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Chuyển khoản',
  COD:           'Thanh toán khi nhận hàng',
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  UNPAID:   'error',
  PAID:     'success',
  REFUNDED: 'warning',
};

export const paymentStatusText: Record<PaymentStatus, string> = {
  UNPAID:   'Chưa thanh toán',
  PAID:     'Đã thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

// ── Nhãn hiển thị số lần giao thất bại ───────────────────────────────────────
export const deliveryAttemptsText = (attempts: number) => {
  if (attempts === 0) return null;
  return `Đã giao thất bại ${attempts} lần`;
};

// ── Actions theo từng trạng thái ─────────────────────────────────────────────
export const getStatusActions = (order: Order) => {
  const actions: { key: OrderStatus; label: string; icon: React.ReactNode; danger?: boolean }[] = [];

  switch (order.status) {

    case OrderStatus.PENDING:
      actions.push(
        { key: OrderStatus.CONFIRMED, label: 'Xác nhận đơn',  icon: <CheckOutlined />  },
        { key: OrderStatus.CANCELLED, label: 'Hủy đơn',       icon: <CloseOutlined />,  danger: true },
      );
      break;

    case OrderStatus.CONFIRMED:
      actions.push(
        { key: OrderStatus.PROCESSING, label: 'Bắt đầu xử lý', icon: <ClockCircleOutlined /> },
        { key: OrderStatus.CANCELLED,  label: 'Hủy đơn',        icon: <CloseOutlined />,       danger: true },
      );
      break;

    case OrderStatus.PROCESSING:
      actions.push(
        { key: OrderStatus.SHIPPING,  label: 'Giao cho shipper', icon: <TruckOutlined />  },
        { key: OrderStatus.CANCELLED, label: 'Hủy đơn',          icon: <CloseOutlined />, danger: true },
      );
      break;

    case OrderStatus.SHIPPING:
      actions.push(
        { key: OrderStatus.DELIVERED,       label: 'Giao thành công',  icon: <CheckOutlined />    },
        { key: OrderStatus.DELIVERY_FAILED, label: 'Giao thất bại',    icon: <WarningOutlined />, danger: true },
      );
      break;

    case OrderStatus.DELIVERY_FAILED:
      actions.push(
        { key: OrderStatus.SHIPPING,  label: `Giao lại${order.deliveryAttempts ? ` (lần ${order.deliveryAttempts + 1})` : ''}`,
          icon: <TruckOutlined /> },
        { key: OrderStatus.RETURNED,  label: 'Hoàn hàng về kho', icon: <RollbackOutlined />, danger: true },
      );
      break;

    case OrderStatus.DELIVERED:
      actions.push(
        { key: OrderStatus.RETURNED, label: 'Hoàn trả / Đổi hàng', icon: <RollbackOutlined />, danger: true },
      );
      break;

    // CANCELLED, RETURNED — không có action
  }

  return actions;
};

// ── Các trạng thái bắt buộc nhập lý do ───────────────────────────────────────
export const requiresReason = (status: OrderStatus): boolean =>
  [
    OrderStatus.CANCELLED,
    OrderStatus.DELIVERY_FAILED,
    OrderStatus.RETURNED,
  ].includes(status);

// ── Placeholder gợi ý lý do theo trạng thái ──────────────────────────────────
export const reasonPlaceholder: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.CANCELLED]:        'VD: Khách yêu cầu hủy, hết hàng, sai thông tin...',
  [OrderStatus.DELIVERY_FAILED]:  'VD: Không liên lạc được, địa chỉ sai, khách từ chối nhận (bom hàng)...',
  [OrderStatus.RETURNED]:         'VD: Hàng lỗi, sai mẫu, khách đổi ý...',
};

// ── Step index cho thanh tiến trình (DELIVERY_FAILED giữ nguyên step 3) ───────
export const getStatusStep = (status: OrderStatus): number => ({
  PENDING:          0,
  CONFIRMED:        1,
  PROCESSING:       2,
  SHIPPING:         3,
  DELIVERY_FAILED:  3,   // vẫn ở bước "Đang giao", chưa tiến lên
  DELIVERED:        4,
  CANCELLED:        -1,
  RETURNED:         -1,
}[status] ?? -1);