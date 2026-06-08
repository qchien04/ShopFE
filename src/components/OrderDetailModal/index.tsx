import { useState } from 'react';
import {
  Modal, Descriptions, Table, Steps, Button,
  Space, Tag, Input, Divider, Image, Alert, Timeline, Select,
} from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  TruckOutlined, ShoppingOutlined, DollarOutlined,
  UserOutlined, PhoneOutlined, EnvironmentOutlined, WarningOutlined,
  RollbackOutlined, PrinterOutlined,
} from '@ant-design/icons';
import type { Order, OrderItem } from '../../types/entity.type';
import { OrderStatus, PaymentStatus } from '../../types/entity.type';
import { useUpdatePaymentStatus } from '../../hooks/Order/useOrder';
import { antdModal } from '../../utils/antdModal';
import { getStatusActions, getStatusStep, paymentMethodText, paymentStatusColors, paymentStatusText, reasonPlaceholder, requiresReason, statusColors, statusText } from '../../pages/Admin/Order/Mapper';
import GHNShippingModal from '../../pages/Admin/Order/GHNShippingModal';
import { useGHNPrintToken } from '../../hooks/Order/useGHN';
import { Link } from 'react-router-dom';


interface Props {
  open: boolean;
  order: Order;
  onClose: () => void;
  onUpdateStatus: (order: Order, newStatus: OrderStatus, reason?: string, internalNote?: string) => void;
}

const OrderDetailModal = ({ open, order, onClose, onUpdateStatus }: Props) => {
  const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();
  const { mutate: printLabel, isPending: isPrinting } = useGHNPrintToken();
  const [adminNote, setAdminNote] = useState(order?.internalNote ?? '');
  const [reasonTarget, setReasonTarget] = useState<OrderStatus | null>(null);
  const [reason, setReason] = useState('');
  const [ghnModalOpen, setGhnModalOpen] = useState(false);

  const handleConfirmPayment = () => {
    antdModal.confirm({
      title: 'Xác nhận thanh toán',
      content: (
        <div>
          Xác nhận đơn hàng <b>{order.orderNumber}</b> đã được thanh toán thành công?
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        updatePaymentStatus({ id: order.id, paymentStatus: PaymentStatus.PAID });
      },
    });
  };

  // Shipper assignment states
  const [carrier, setCarrier] = useState('Giao Hàng Nhanh (GHN)');
  const [shipperName, setShipperName] = useState('');
  const [shipperPhone, setShipperPhone] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const isPhoneValid = (phone: string) => {
    if (!phone) return true;
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  if (!order) return null;

  const currentStep = getStatusStep(order.status);
  const statusActions = getStatusActions(order);
  const isDeliveryFail = order.status === OrderStatus.DELIVERY_FAILED;
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isReturned = order.status === OrderStatus.RETURNED;
  const isTerminal = isCancelled || isReturned;

  // ── Xử lý action ──────────────────────────────────────────────────────────
  const handleAction = (newStatus: OrderStatus) => {
    if (requiresReason(newStatus)) {
      setReasonTarget(newStatus);
      setReason('');
    } else {
      onUpdateStatus(order, newStatus, reason, adminNote);
    }
  };

  const confirmAction = () => {
    if (!reasonTarget) return;
    let finalNote = reason.trim();
    if (reasonTarget === OrderStatus.SHIPPING) {
      finalNote = `ĐVVC: ${carrier} | Shipper: ${shipperName.trim() || 'N/A'} (SĐT: ${shipperPhone.trim() || 'N/A'}) | Mã vận đơn: ${trackingCode.trim() || 'N/A'}`;
    }
    onUpdateStatus(order, reasonTarget, finalNote, adminNote);
    setReasonTarget(null);
    setReason('');
    setShipperName('');
    setShipperPhone('');
    setTrackingCode('');
  };

  const cancelAction = () => {
    setReasonTarget(null);
    setReason('');
    setShipperName('');
    setShipperPhone('');
    setTrackingCode('');
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
            <div style={{ fontWeight: 500 }}>
              <Link to={`/products/${record.productId}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                {text}
              </Link>
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>Slug: {record.productSlug}</div>
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

  return (<>
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
                { title: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
                { title: 'Đang xử lý', icon: <ShoppingOutlined /> },
                {
                  title: isDeliveryFail ? 'Giao thất bại' : 'Đang giao',
                  icon: isDeliveryFail ? <WarningOutlined /> : <TruckOutlined />,
                },
                { title: 'Hoàn thành', icon: <CheckCircleOutlined /> },
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Tag color={paymentStatusColors[order.paymentStatus]} style={{ margin: 0 }}>
                  {paymentStatusText[order.paymentStatus]}
                </Tag>
                {order.paymentStatus !== PaymentStatus.PAID && (
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: 'auto', fontSize: 12, color: '#52c41a', display: 'inline-flex', alignItems: 'center' }}
                    onClick={handleConfirmPayment}
                  >
                    [Xác nhận thanh toán]
                  </Button>
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền" span={2}>
              <strong style={{ fontSize: 15, color: '#ff4444' }}>
                {order.total.toLocaleString('vi-VN')}₫
              </strong>
              {order.discount > 0 && (
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: '#52c41a', fontSize: 13, display: 'block' }}>
                    Giảm {order.discount.toLocaleString('vi-VN')}₫
                    {order.couponCode && ` (${order.couponCode})`}
                  </span>
                  {order.couponDetails && (
                    <span style={{ color: '#999', fontSize: 11, fontStyle: 'italic', display: 'block', marginLeft: 2 }}>
                      * Chi tiết giảm giá: {order.couponDetails}
                    </span>
                  )}
                </div>
              )}
            </Descriptions.Item>
            {/* GHN Info */}
            {order.ghnOrderCode && (
              <Descriptions.Item label=" Vận đơn GHN" span={2}>
                <Space wrap>
                  <Tag color="orange" style={{ fontSize: 13, padding: '2px 10px' }}>
                    {order.ghnOrderCode}
                  </Tag>
                  {order.ghnExpectedDeliveryTime && (
                    <span style={{ fontSize: 12, color: '#666' }}>
                      Dự kiến giao: {new Date(order.ghnExpectedDeliveryTime).toLocaleString('vi-VN')}
                    </span>
                  )}
                  <Button
                    size="small"
                    icon={<PrinterOutlined />}
                    loading={isPrinting}
                    onClick={() => printLabel([order.ghnOrderCode!])}
                  >
                    In nhãn
                  </Button>
                </Space>
              </Descriptions.Item>
            )}
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
                    <span style={{ color: '#999' }}>Phí vận chuyển (Khách trả):</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right" colSpan={2}>
                    {order.shippingFee > 0
                      ? order.shippingFee.toLocaleString('vi-VN') + '₫'
                      : <span style={{ color: '#52c41a' }}>Miễn phí</span>
                    }
                    {order.discount > 0 && (
                      <div style={{ marginTop: 4 }}>
                        <span style={{ color: '#52c41a', fontSize: 13, display: 'block' }}>
                          Giảm {order.discount.toLocaleString('vi-VN')}₫
                          {order.couponCode && ` (${order.couponCode})`}
                        </span>
                        {order.couponDetails && (
                          <span style={{ color: '#999', fontSize: 11, fontStyle: 'italic', display: 'block' }}>
                            * Chi tiết giảm giá: {order.couponDetails}
                          </span>
                        )}
                      </div>
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                {order.actualShippingFee !== undefined && order.actualShippingFee !== null && (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2} align="right">
                      <span style={{ color: '#fa8c16' }}>Phí vận chuyển thực tế (GHN):</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right" colSpan={2}>
                      <span style={{ color: '#fa8c16', fontWeight: 500 }}>
                        {order.actualShippingFee.toLocaleString('vi-VN')}₫
                      </span>
                      {order.actualShippingFee !== order.shippingFee && (
                        <div style={{ fontSize: 11, color: order.actualShippingFee > order.shippingFee ? '#f5222d' : '#52c41a', marginTop: 2 }}>
                          {order.actualShippingFee > order.shippingFee ? 'Lỗ phí ship: ' : 'Lời phí ship: '}
                          {Math.abs(order.actualShippingFee - order.shippingFee).toLocaleString('vi-VN')}₫
                        </div>
                      )}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
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

        {/* ── Lịch sử trạng thái đơn hàng ──────────────────────────────────── */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 500, marginBottom: 12 }}>📜 Lịch sử trạng thái đơn hàng</div>
            <Timeline
              mode="left"
              items={order.statusHistory.map(history => {
                const formattedDate = new Date(history.createdAt).toLocaleString('vi-VN');
                const toStatusText = statusText[history.toStatus] || history.toStatus;
                const toColor = statusColors[history.toStatus] || 'gray';

                const isShippingNote = history.note && history.note.startsWith("ĐVVC: ");
                let parsedNote: React.ReactNode = history.note;

                if (isShippingNote) {
                  const parts = history.note?.split(" | ");
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
                  color: toColor === 'error' ? 'red' : toColor === 'success' ? 'green' : toColor === 'warning' ? 'orange' : 'blue',
                  children: (
                    <div>
                      <strong>
                        Chuyển sang: <Tag color={toColor} style={{ marginLeft: 4 }}>{toStatusText}</Tag>
                      </strong>
                      {history.note && (
                        <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                          {isShippingNote ? parsedNote : <span>Chi tiết: <em>{history.note}</em></span>}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                        Người thực hiện: <span style={{ fontWeight: 500 }}>
                          {history.actionBy === 'SYSTEM'
                            ? 'Hệ thống'
                            : !history.actionBy.startsWith('USER_ID_1')
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
            {statusActions.map(action => {
              // Khi PROCESSING → SHIPPING: thêm nút tạo GHN trước nút manual
              if (action.key === OrderStatus.SHIPPING && order.status === OrderStatus.PROCESSING) {
                return (
                  <Space key="shipping-group">
                    <Button
                      type="primary"
                      icon={<TruckOutlined />}
                      style={{ background: '#f26522', borderColor: '#f26522' }}
                      onClick={() => setGhnModalOpen(true)}
                    >
                      🚚 Tạo vận đơn GHN
                    </Button>
                    <Button
                      icon={<TruckOutlined />}
                      onClick={() => handleAction(action.key)}
                    >
                      Giao thủ công
                    </Button>
                  </Space>
                );
              }
              return (
                <Button
                  key={action.key}
                  type={action.danger ? 'default' : 'primary'}
                  danger={action.danger}
                  icon={action.icon}
                  onClick={() => handleAction(action.key)}
                >
                  {action.label}
                </Button>
              );
            })}
          </Space>
        )}

        {/* ── Nhập lý do hoặc phân công Shipper ─────────────── */}
        {reasonTarget && (
          <div style={{
            background: '#fafafa', border: '1px solid #f0f0f0',
            borderRadius: 8, padding: 16, marginTop: 16
          }}>
            {reasonTarget === OrderStatus.SHIPPING ? (
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TruckOutlined /> PHÂN CÔNG ĐƠN VỊ VẬN CHUYỂN & SHIPPER
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                      Đơn vị vận chuyển <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Select
                      style={{ width: '100%' }}
                      value={carrier}
                      onChange={val => setCarrier(val)}
                      options={[
                        { value: 'Giao Hàng Nhanh (GHN)', label: 'Giao Hàng Nhanh (GHN)' },
                        { value: 'Giao Hàng Tiết Kiệm (GHTK)', label: 'Giao Hàng Tiết Kiệm (GHTK)' },
                        { value: 'Viettel Post', label: 'Viettel Post' },
                        { value: 'Shopee Express', label: 'Shopee Express' },
                        { value: 'GrabExpress', label: 'GrabExpress (Giao nhanh)' },
                        { value: 'Shipper nội bộ', label: 'Shipper nội bộ (Cửa hàng tự giao)' },
                      ]}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                      Mã vận đơn (nếu có)
                    </label>
                    <Input
                      placeholder="VD: GHN987654321"
                      value={trackingCode}
                      onChange={e => setTrackingCode(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                      Tên người giao hàng (Shipper) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Input
                      placeholder="Nhập tên Shipper"
                      value={shipperName}
                      onChange={e => setShipperName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#555', marginBottom: 4 }}>
                      Số điện thoại Shipper <span style={{ color: 'red' }}>*</span>
                    </label>
                    <Input
                      placeholder="Nhập SĐT Shipper (10 chữ số)"
                      maxLength={10}
                      value={shipperPhone}
                      onChange={e => setShipperPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    {shipperPhone && !isPhoneValid(shipperPhone) && (
                      <span style={{ color: 'red', fontSize: 11, display: 'block', marginTop: 2 }}>
                        Số điện thoại phải có đúng 10 chữ số!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>
                  {reasonTarget === OrderStatus.DELIVERY_FAILED && 'Lý do giao thất bại'}
                  {reasonTarget === OrderStatus.CANCELLED && 'Lý do hủy đơn'}
                  {reasonTarget === OrderStatus.RETURNED && 'Lý do hoàn hàng'}
                </div>
                <Input.TextArea
                  autoFocus
                  rows={3}
                  placeholder={reasonPlaceholder[reasonTarget]}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
              </div>
            )}

            <Space>
              <Button
                type="primary"
                danger={[OrderStatus.CANCELLED, OrderStatus.RETURNED].includes(reasonTarget)}
                disabled={
                  reasonTarget === OrderStatus.SHIPPING
                    ? (!shipperName.trim() || !shipperPhone.trim() || !isPhoneValid(shipperPhone))
                    : !reason.trim()
                }
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
          <Button style={{ marginLeft: 5, marginTop: statusActions.length > 0 ? 8 : 0 }} onClick={onClose}>
            Đóng
          </Button>
        )}

      </div>
    </Modal>

    {/* GHN Shipping Modal */}
    {ghnModalOpen && (
      <GHNShippingModal
        open={ghnModalOpen}
        order={order}
        onClose={() => setGhnModalOpen(false)}
      />
    )}
  </>);
};

export default OrderDetailModal;