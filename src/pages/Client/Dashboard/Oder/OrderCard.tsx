import {
  Card, Typography, Tag, Image,
  Divider, Button,
} from 'antd';
import {DollarOutlined, EyeOutlined} from '@ant-design/icons';
import type { Order } from '../../../../types/entity.type';
import { OrderStatus, PaymentStatus } from '../../../../types/entity.type';
import { paymentStatusMap, statusMap } from './Mapper';

const {Text } = Typography;

interface Props {
  order:Order,
  setSelectedOrder:React.Dispatch<React.SetStateAction<Order|null>>;
  setPaymentOpen:React.Dispatch<React.SetStateAction<boolean>>;
  handleCancelOrder:(order: Order) => void,
  setDetailOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

export const OrderCard=({order,setPaymentOpen,setSelectedOrder,setDetailOpen,handleCancelOrder}:Props)=>{

  return (
    <Card
      key={order.id}
      size="small"
      style={{ borderRadius: 10 ,width:"100%"}}
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
  )


}