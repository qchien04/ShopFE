import { Button, Descriptions, Image, Modal, Steps, Tag, Typography, Timeline } from "antd"
import { OrderStatus, PaymentStatus, type Order } from '../../../../types/entity.type';
import { statusMap } from "./Mapper";
import { TruckOutlined } from '@ant-design/icons';

const paymentStatusMap: Record<PaymentStatus, { color: string; label: string }> = {
  [PaymentStatus.UNPAID]: { color: 'error', label: 'Chưa TT' },
  [PaymentStatus.PAID]: { color: 'success', label: 'Đã TT' },
  [PaymentStatus.REFUNDED]: { color: 'warning', label: 'Hoàn tiền' },
};
const { Text } = Typography;

interface Props {
  detailOpen: boolean,
  selectedOrder: Order,
  setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCancelOrder: (order: Order) => void;
}

const OrderClientDetailModal = ({ detailOpen, selectedOrder, setDetailOpen, handleCancelOrder }: Props) => {
  const getOrderProgress = (status: OrderStatus) =>
    [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.DELIVERED]
      .indexOf(status);

  return (

    <Modal
      open={detailOpen}
      title={<Text strong>Đơn hàng #{selectedOrder?.orderNumber}</Text>}
      onCancel={() => setDetailOpen(false)}
      footer={
        selectedOrder?.status !== OrderStatus.CANCELLED &&
          selectedOrder?.status !== OrderStatus.DELIVERED &&
          selectedOrder?.status !== OrderStatus.RETURNED ? [
          <Button key="cancel" danger onClick={() => {
            handleCancelOrder(selectedOrder);
            setDetailOpen(false);
          }}>
            Hủy đơn hàng
          </Button>,
          <Button key="close" onClick={() => setDetailOpen(false)}>
            Đóng
          </Button>
        ] : [
          <Button key="close" onClick={() => setDetailOpen(false)}>
            Đóng
          </Button>
        ]
      }
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong style={{ color: '#e53935' }}>{selectedOrder.total.toLocaleString('vi-VN')}₫</Text>
                  {selectedOrder.discount > 0 && (
                    <Tag color="success" style={{ margin: 0 }}>
                      Giảm {selectedOrder.discount.toLocaleString('vi-VN')}₫
                      {selectedOrder.couponCode && ` (${selectedOrder.couponCode})`}
                    </Tag>
                  )}
                </div>
                {selectedOrder.couponDetails && (
                  <Text style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>
                    * Chi tiết mã: {selectedOrder.couponDetails}
                  </Text>
                )}
              </div>
            </Descriptions.Item>
            {selectedOrder.note && (
              <Descriptions.Item label="Ghi chú" span={2}>{selectedOrder.note}</Descriptions.Item>
            )}
          </Descriptions>

          {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
            <div style={{ padding: '8px 4px' }}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Lịch sử trạng thái đơn hàng</Text>
              <Timeline
                mode="left"
                items={selectedOrder.statusHistory.map(history => {
                  const toStatusObj = statusMap[history.toStatus] || { label: history.toStatus, color: 'gray' };
                  const formattedDate = new Date(history.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  let dotColor = 'blue';
                  if (toStatusObj.color === 'error') dotColor = 'red';
                  else if (toStatusObj.color === 'success') dotColor = 'green';
                  else if (toStatusObj.color === 'warning') dotColor = 'orange';

                  const isShippingNote = history.note && history.note.startsWith("ĐVVC: ");
                  let parsedNote: React.ReactNode = history.note;

                  if (isShippingNote) {
                    const parts = history?.note?.split(" | ");
                    const dvvc = parts?.[0]?.replace("ĐVVC: ", "") || 'N/A';
                    const shipper = parts?.[1]?.replace("Shipper: ", "") || 'N/A';
                    const mavandon = parts?.[2]?.replace("Mã vận đơn: ", "") || 'N/A';

                    parsedNote = (
                      <div style={{
                        marginTop: 6,
                        padding: '10px 14px',
                        background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
                        border: '1px solid #b7eb8f',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#237804',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TruckOutlined style={{ fontSize: 14 }} /> Thông tin giao hàng & Shipper:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                          <div><strong>Đơn vị:</strong> {dvvc}</div>
                          <div><strong>Mã vận đơn:</strong> <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>{mavandon}</Tag></div>
                          <div style={{ gridColumn: 'span 2', marginTop: 2 }}>
                            <strong>Shipper:</strong> {shipper}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return {
                    label: formattedDate,
                    color: dotColor,
                    children: (
                      <div>
                        <Text strong style={{ fontSize: 13 }}>
                          Trạng thái: <Tag color={toStatusObj.color} style={{ marginLeft: 4 }}>{toStatusObj.label}</Tag>
                        </Text>
                        {history.note && (
                          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                            {isShippingNote ? parsedNote : <span>Chi tiết: <em>{history.note}</em></span>}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                          Người thực hiện: <span style={{ fontWeight: 500 }}>
                            {history.actionBy === 'SYSTEM'
                              ? 'Hệ thống'
                              : history.actionBy.startsWith('USER_ID_')
                                ? 'Khách hàng'
                                : 'Quản trị viên'}
                          </span>
                        </div>
                      </div>
                    ),
                  };
                })}
              />
            </div>
          )}

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