import { useState } from 'react';
import {
  Modal, Descriptions, Table, Steps, Button,
  Space, Tag, Input, Divider, Image, Alert,
} from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  TruckOutlined, ShoppingOutlined, DollarOutlined,
  UserOutlined, PhoneOutlined, EnvironmentOutlined, WarningOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { Order, OrderItem } from '../../types/entity.type';
import { OrderStatus } from '../../types/entity.type';
import { getStatusActions, getStatusStep, paymentMethodText, paymentStatusColors, paymentStatusText, reasonPlaceholder, requiresReason, statusColors, statusText } from '../../pages/Admin/Order/Mapper';


interface Props {
  open:           boolean;
  order:          Order;
  onClose:        () => void;
  onUpdateStatus: (order: Order, newStatus: OrderStatus, reason?: string, internalNote?:string) => void;
}

const OrderDetailModal = ({ open, order, onClose, onUpdateStatus }: Props) => {
  const [adminNote,     setAdminNote]     = useState(order.internalNote ?? '');
  const [reasonTarget,  setReasonTarget]  = useState<OrderStatus | null>(null);
  const [reason,        setReason]        = useState('');

  const currentStep    = getStatusStep(order.status);
  const statusActions  = getStatusActions(order);
  const isDeliveryFail = order.status === OrderStatus.DELIVERY_FAILED;
  const isCancelled    = order.status === OrderStatus.CANCELLED;
  const isReturned     = order.status === OrderStatus.RETURNED;
  const isTerminal     = isCancelled || isReturned;

  // ── Xử lý action ──────────────────────────────────────────────────────────
  const handleAction = (newStatus: OrderStatus) => {
    if (requiresReason(newStatus)) {
      setReasonTarget(newStatus);
      setReason('');
    } else {
      onUpdateStatus(order, newStatus,reason,adminNote);
    }
  };

  const confirmAction = () => {
    if (!reasonTarget) return;
    onUpdateStatus(order, reasonTarget, reason.trim(),adminNote);
    setReasonTarget(null);
    setReason('');
  };

  const cancelAction = () => {
    setReasonTarget(null);
    setReason('');
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const itemColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      render: (text: string, record: OrderItem) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Image
            width={56} height={56}
            src={record.productImage}
            style={{ objectFit: 'cover', borderRadius: 6 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>SKU: {record.productSku}</div>
            {record.attributes && Object.keys(record.attributes).length > 0 && (
              <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {Object.entries(record.attributes).map(([k, v]) => (
                  <Tag key={k} style={{ fontSize: 11, margin: 0 }}>{k}: {v}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá', dataIndex: 'price', align: 'right' as const, width: 120,
      render: (p: number) => p.toLocaleString('vi-VN') + '₫',
    },
    {
      title: 'SL', dataIndex: 'quantity', align: 'center' as const, width: 60,
    },
    {
      title: 'Thành tiền', dataIndex: 'subtotal', align: 'right' as const, width: 130,
      render: (s: number) => (
        <span style={{ fontWeight: 600, color: '#ff4444' }}>
          {s.toLocaleString('vi-VN')}₫
        </span>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
      title={
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingRight: 32 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              Đơn hàng #{order.orderNumber}
            </div>
            <Tag color={statusColors[order.status]} style={{ fontSize: 12 }}>
              {statusText[order.status]}
            </Tag>
            {isDeliveryFail && order.deliveryAttempts && order.deliveryAttempts > 0 && (
              <Tag color="volcano" style={{ fontSize: 12 }}>
                Thất bại {order.deliveryAttempts} lần
              </Tag>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#999', textAlign: 'right', fontWeight: 400 }}>
            <div>Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</div>
            {order.deliveredAt && (
              <div>Giao lúc: {new Date(order.deliveredAt).toLocaleString('vi-VN')}</div>
            )}
          </div>
        </div>
      }
    >
      <div style={{ maxHeight: '78vh', overflowY: 'auto', paddingRight: 4 }}>

        {/* ── Thanh tiến trình ────────────────────────────────────────────── */}
        {!isTerminal && (
          <div style={{ marginBottom: 8 }}>
            <Steps
              size="small"
              current={currentStep}
              status={isDeliveryFail ? 'error' : 'process'}
              items={[
                { title: 'Chờ xác nhận', icon: <ClockCircleOutlined /> },
                { title: 'Đã xác nhận',  icon: <CheckCircleOutlined /> },
                { title: 'Đang xử lý',   icon: <ShoppingOutlined />    },
                {
                  title: isDeliveryFail ? 'Giao thất bại' : 'Đang giao',
                  icon:  isDeliveryFail ? <WarningOutlined /> : <TruckOutlined />,
                },
                { title: 'Hoàn thành',   icon: <CheckCircleOutlined /> },
              ]}
            />
          </div>
        )}

        {/* ── Banner trạng thái đặc biệt ──────────────────────────────────── */}
        {isDeliveryFail && (
          <Alert
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ marginBottom: 16 }}
            message={
              <span style={{ fontWeight: 500 }}>
                Giao hàng thất bại {order.deliveryAttempts ?? 1} lần
              </span>
            }
            description={order.cancelReason && `Lý do: ${order.cancelReason}`}
          />
        )}

        {isCancelled && (
          <Alert
            type="error"
            showIcon
            icon={<CloseCircleOutlined />}
            style={{ marginBottom: 16 }}
            message="Đơn hàng đã bị hủy"
            description={order.cancelReason && `Lý do: ${order.cancelReason}`}
          />
        )}

        {isReturned && (
          <Alert
            type="warning"
            showIcon
            icon={<RollbackOutlined />}
            style={{ marginBottom: 16 }}
            message="Đơn hàng đã hoàn trả"
            description={order.cancelReason && `Lý do: ${order.cancelReason}`}
          />
        )}

        <Divider style={{ margin: '12px 0' }} />

        {/* ── Thông tin đơn hàng ──────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>📋 Thông tin đơn hàng</div>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã đơn hàng">
              <strong>{order.orderNumber}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColors[order.status]}>{statusText[order.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Thanh toán">
              <Tag color="blue" icon={<DollarOutlined />}>
                {paymentMethodText[order.paymentMethod]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái TT">
              <Tag color={paymentStatusColors[order.paymentStatus]}>
                {paymentStatusText[order.paymentStatus]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <strong style={{ fontSize: 15, color: '#ff4444' }}>
                {order.total.toLocaleString('vi-VN')}₫
              </strong>
              {order.discount > 0 && (
                <span style={{ color: '#52c41a', marginLeft: 12, fontSize: 13 }}>
                  Giảm {order.discount.toLocaleString('vi-VN')}₫
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú KH" span={2}>
              {order.note || <span style={{ color: '#bbb' }}>Không có</span>}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* ── Thông tin khách hàng ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>👤 Thông tin khách hàng</div>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label={<><UserOutlined /> Họ tên</>}>
              {order.customerName}
            </Descriptions.Item>
            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
              {order.customerPhone}
            </Descriptions.Item>
            <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ giao hàng</>} span={2}>
              {order.shippingAddress}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* ── Sản phẩm ─────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>🛒 Sản phẩm đặt hàng</div>
          <Table
            bordered
            rowKey="id"
            size="small"
            columns={itemColumns}
            dataSource={order.items}
            pagination={false}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} align="right">
                    <span style={{ color: '#999' }}>Phí vận chuyển:</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right" colSpan={2}>
                    {order.shippingFee > 0
                      ? order.shippingFee.toLocaleString('vi-VN') + '₫'
                      : <span style={{ color: '#52c41a' }}>Miễn phí</span>
                    }
                    {order.discount > 0 && (
                      <span style={{ color: '#52c41a', marginLeft: 12, fontSize: 13 }}>
                        Giảm {order.discount.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} align="right">
                    <strong>Tổng cộng:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right" colSpan={2}>
                    <strong style={{ fontSize: 15, color: '#ff4444' }}>
                      {order.total.toLocaleString('vi-VN')}₫
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* ── Ghi chú nội bộ ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>📝 Ghi chú nội bộ</div>
          <Input.TextArea
            rows={2}
            placeholder="Ghi chú chỉ admin thấy..."
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        {statusActions.length > 0 && !reasonTarget && (
          <Space wrap>
            {statusActions.map(action => (
              <Button
                key={action.key}
                type={action.danger ? 'default' : 'primary'}
                danger={action.danger}
                icon={action.icon}
                onClick={() => handleAction(action.key)}
              >
                {action.label}
              </Button>
            ))}
          </Space>
        )}

        {/* ── Nhập lý do (hiện sau khi bấm action cần reason) ─────────────── */}
        {reasonTarget && (
          <div style={{
            background: '#fafafa', border: '1px solid #f0f0f0',
            borderRadius: 8, padding: 16,
          }}>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>
              {reasonTarget === OrderStatus.DELIVERY_FAILED && 'Lý do giao thất bại'}
              {reasonTarget === OrderStatus.CANCELLED       && 'Lý do hủy đơn'}
              {reasonTarget === OrderStatus.RETURNED        && 'Lý do hoàn hàng'}
            </div>
            <Input.TextArea
              autoFocus
              rows={3}
              placeholder={reasonPlaceholder[reasonTarget]}
              value={reason}
              onChange={e => setReason(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <Space>
              <Button
                type="primary"
                danger={[OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(reasonTarget)}
                disabled={!reason.trim()}
                onClick={confirmAction}
              >
                Xác nhận
              </Button>
              <Button onClick={cancelAction}>Hủy</Button>
            </Space>
          </div>
        )}

        {/* ── Đóng ─────────────────────────────────────────────────────────── */}
        {!reasonTarget && (
          <Button style={{marginLeft:5, marginTop: statusActions.length > 0 ? 8 : 0 }} onClick={onClose}>
            Đóng
          </Button>
        )}

      </div>
    </Modal>
  );
};

export default OrderDetailModal;