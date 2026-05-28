import { Button, Descriptions, Image, Modal, Steps, Tag, Typography, Timeline, Alert } from "antd"
import { Link } from "react-router-dom"
import { OrderStatus, PaymentStatus, type Order } from '../../../../types/entity.type';
import { statusMap } from "./Mapper";
import { TruckOutlined, PhoneOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

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
  handleConfirmReceived: (order: Order) => void;
}

// Parse shipping note: "ĐVVC: GHN | Shipper: Nguyễn Văn A | Mã vận đơn: GHN12345"
function parseShippingNote(note: string) {
  const parts = note.split(" | ");
  return {
    dvvc: parts[0]?.replace("ĐVVC: ", "") || "N/A",
    shipper: parts[1]?.replace("Shipper: ", "") || "N/A",
    maVanDon: parts[2]?.replace("Mã vận đơn: ", "") || "N/A",
  };
}

const OrderClientDetailModal = ({ detailOpen, selectedOrder, setDetailOpen, handleCancelOrder, handleConfirmReceived }: Props) => {
  const getOrderProgress = (status: OrderStatus) =>
    [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPING, OrderStatus.DELIVERED]
      .indexOf(status);

  // Find latest SHIPPING note with carrier info
  const shippingHistory = selectedOrder?.statusHistory?.find(
    h => h.toStatus === OrderStatus.SHIPPING && h.note?.startsWith("ĐVVC: ")
  );
  const shippingInfo = shippingHistory ? parseShippingNote(shippingHistory.note!) : null;

  const isShipping = selectedOrder?.status === OrderStatus.SHIPPING;
  const isDelivered = selectedOrder?.status === OrderStatus.DELIVERED;
  const isActive = selectedOrder?.status !== OrderStatus.CANCELLED
    && selectedOrder?.status !== OrderStatus.DELIVERED
    && selectedOrder?.status !== OrderStatus.RETURNED;

  const footerButtons = [];

  if (isShipping) {
    footerButtons.push(
      <Button
        key="confirm"
        type="primary"
        icon={<CheckCircleOutlined />}
        style={{ background: '#00b96b', borderColor: '#00b96b' }}
        onClick={() => { handleConfirmReceived(selectedOrder); setDetailOpen(false); }}
      >
        Đã nhận được hàng
      </Button>
    );
  }

  if (isActive) {
    footerButtons.push(
      <Button key="cancel" danger onClick={() => { handleCancelOrder(selectedOrder); setDetailOpen(false); }}>
        Hủy đơn hàng
      </Button>
    );
  }

  footerButtons.push(
    <Button key="close" onClick={() => setDetailOpen(false)}>Đóng</Button>
  );

  return (
    <Modal
      open={detailOpen}
      title={<Text strong>Đơn hàng #{selectedOrder?.orderNumber}</Text>}
      onCancel={() => setDetailOpen(false)}
      footer={footerButtons}
      width="min(720px, 95vw)"
      style={{ top: 20 }}
    >
      {selectedOrder && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Progress Steps */}
          <Steps
            current={getOrderProgress(selectedOrder.status)}
            size="small"
            responsive
            status={selectedOrder.status === OrderStatus.CANCELLED || selectedOrder.status === OrderStatus.RETURNED ? 'error' : undefined}
            items={[
              { title: 'Đặt hàng' },
              { title: 'Xác nhận' },
              { title: 'Xử lý' },
              { title: 'Giao hàng' },
              { title: 'Hoàn thành' },
            ]}
          />

          {/* ── Shipping Info Banner (Shopee-style) ── */}
          {isShipping && (
            <div style={{
              background: 'linear-gradient(135deg, #e6f7ff 0%, #f0fff4 100%)',
              border: '1px solid #91d5ff',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <TruckOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                <Text strong style={{ color: '#1890ff', fontSize: 14 }}>Đơn hàng đang trên đường giao đến bạn</Text>
              </div>

              {shippingInfo ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 13 }}>
                  <div><Text type="secondary">Đơn vị vận chuyển:</Text> <Text strong>{shippingInfo.dvvc}</Text></div>
                  <div>
                    <Text type="secondary">Mã vận đơn:</Text>{" "}
                    <Tag color="blue" style={{ marginLeft: 4, fontSize: 12 }}>{shippingInfo.maVanDon}</Tag>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <Text type="secondary">Shipper phụ trách:</Text> <Text strong>{shippingInfo.shipper}</Text>
                  </div>
                </div>
              ) : (
                <Text type="secondary" style={{ fontSize: 12 }}>Chưa có thông tin shipper. Vui lòng liên hệ shop để được hỗ trợ.</Text>
              )}

              {/* Contact carrier shortcuts */}
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {shippingInfo?.dvvc && shippingInfo.dvvc !== 'N/A' && (
                  <Button
                    size="small"
                    icon={<PhoneOutlined />}
                    onClick={() => {
                      const carrierHotlines: Record<string, string> = {
                        'GHN': '1900636677',
                        'GHTK': '19006152',
                        'Viettel Post': '18008095',
                        'Vietnam Post': '1800545481',
                        'J&T Express': '19001088',
                        'Ninja Van': '19006091',
                      };
                      const phone = carrierHotlines[shippingInfo.dvvc];
                      if (phone) window.open(`tel:${phone}`);
                      else Modal.info({
                        title: 'Liên hệ đơn vị vận chuyển',
                        content: `Vui lòng tự tra cứu hotline của ${shippingInfo.dvvc} để được hỗ trợ.`,
                      });
                    }}
                  >
                    Liên hệ ĐVVC
                  </Button>
                )}
                <Button
                  size="small"
                  icon={<WarningOutlined />}
                  danger
                  onClick={() => {
                    Modal.warning({
                      title: 'Chưa nhận được hàng?',
                      content: (
                        <div style={{ paddingTop: 8 }}>
                          <p style={{ margin: 0, marginBottom: 8 }}>Nếu bạn chưa nhận được hàng, vui lòng:</p>
                          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 2 }}>
                            <li>Kiểm tra lại mã vận đơn với shipper</li>
                            <li>Liên hệ hotline ĐVVC để tra cứu</li>
                            <li>Nhắn tin cho shop qua phần Chat để được hỗ trợ</li>
                          </ol>
                          <p style={{ margin: 0, marginTop: 8, fontSize: 12, color: '#999' }}>
                            ⚠️ Không nhấn "Đã nhận được hàng" nếu chưa thực sự nhận được đơn.
                          </p>
                        </div>
                      ),
                      okText: 'Đã hiểu',
                    });
                  }}
                >
                  Chưa nhận được?
                </Button>
              </div>
            </div>
          )}

          {/* ── Delivered confirmation banner ── */}
          {isDelivered && (
            <Alert
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              message="Đơn hàng đã hoàn thành"
              description="Bạn đã xác nhận nhận hàng thành công. Cảm ơn bạn đã tin tưởng mua sắm tại shop!"
              style={{ borderRadius: 8 }}
            />
          )}

          {/* Descriptions */}
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
                    * Chi tiết giảm giá: {selectedOrder.couponDetails}
                  </Text>
                )}
              </div>
            </Descriptions.Item>
            {selectedOrder.note && (
              <Descriptions.Item label="Ghi chú" span={2}>{selectedOrder.note}</Descriptions.Item>
            )}
          </Descriptions>

          {/* Status History Timeline */}
          {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
            <div style={{ padding: '8px 4px' }}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Lịch sử trạng thái</Text>
              <Timeline
                mode="left"
                items={selectedOrder.statusHistory.map(history => {
                  const toStatusObj = statusMap[history.toStatus] || { label: history.toStatus, color: 'gray' };
                  const formattedDate = new Date(history.createdAt).toLocaleString('vi-VN', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                  });

                  let dotColor = 'blue';
                  if (toStatusObj.color === 'error') dotColor = 'red';
                  else if (toStatusObj.color === 'success') dotColor = 'green';
                  else if (toStatusObj.color === 'warning') dotColor = 'orange';

                  const isShippingNote = history.note && history.note.startsWith("ĐVVC: ");
                  let parsedNote: React.ReactNode = history.note;

                  if (isShippingNote) {
                    const info = parseShippingNote(history.note!);
                    parsedNote = (
                      <div style={{
                        marginTop: 6, padding: '10px 14px',
                        background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
                        border: '1px solid #b7eb8f', borderRadius: 8,
                        fontSize: 12, color: '#237804',
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TruckOutlined style={{ fontSize: 14 }} /> Thông tin giao hàng & Shipper:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                          <div><strong>Đơn vị:</strong> {info.dvvc}</div>
                          <div><strong>Mã vận đơn:</strong> <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>{info.maVanDon}</Tag></div>
                          <div style={{ gridColumn: 'span 2', marginTop: 2 }}>
                            <strong>Shipper:</strong> {info.shipper}
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
                              : history.actionBy?.startsWith('USER_ID_')
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

          {/* Products */}
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Sản phẩm</Text>
            {selectedOrder.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: 10, background: '#fafafa', borderRadius: 8 }}>
                <Image src={item.productImage} width={56} height={56} style={{ objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} preview={false} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item.productId}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1890ff' }}>
                    {item.productName}
                  </Link>
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