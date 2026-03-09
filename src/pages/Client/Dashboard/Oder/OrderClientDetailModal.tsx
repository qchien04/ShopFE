import { Descriptions, Image, Modal, Steps, Tag, Typography } from "antd"
import { OrderStatus, PaymentStatus, type Order } from '../../../../types/entity.type';
import { statusMap } from "./Mapper";

const paymentStatusMap: Record<PaymentStatus, { color: string; label: string }> = {
  [PaymentStatus.UNPAID]:   { color: 'error',   label: 'Chưa TT' },
  [PaymentStatus.PAID]:     { color: 'success', label: 'Đã TT' },
  [PaymentStatus.REFUNDED]: { color: 'warning', label: 'Hoàn tiền' },
};
const { Text } = Typography;

interface Props {
  detailOpen:boolean,
  selectedOrder:Order,
  setDetailOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderClientDetailModal=({detailOpen,selectedOrder,setDetailOpen}:Props)=>{
  const getOrderProgress = (status: OrderStatus) =>
  [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.DELIVERED]
    .indexOf(status);

  return(

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
  )
}

export default OrderClientDetailModal;