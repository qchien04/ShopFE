import { useState } from 'react';
import {
  Modal,
  Descriptions,
  Table,
  Steps,
  Timeline,
  Button,
  Space,
  Tag,
  Input,
  message,
  Divider,
  Image
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { Order, OrderItem, OrderStatus } from '../../types/entity.type';

const { TextArea } = Input;

interface Props {
  open: boolean;
  order: Order;
  onClose: () => void;
  onUpdateStatus: (order: Order, newStatus: OrderStatus) => void;
}

const OrderDetailModal = ({ open, order, onClose, onUpdateStatus }: Props) => {
  const [adminNote, setAdminNote] = useState('');

  const statusColors: Record<OrderStatus, string> = {
    PENDING: 'gold',
    CONFIRMED: 'blue',
    PROCESSING: 'cyan',
    SHIPPING: 'purple',
    DELIVERED: 'success',
    CANCELLED: 'error',
    RETURNED: 'warning'
  };

  const statusText: Record<OrderStatus, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    PROCESSING: 'Đang xử lý',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
    RETURNED: 'Đã trả hàng'
  };

  const getStatusStep = (status: OrderStatus): number => {
    const steps: Record<OrderStatus, number> = {
      PENDING: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      SHIPPING: 3,
      DELIVERED: 4,
      CANCELLED: -1,
      RETURNED: -1
    };
    return steps[status];
  };

  const itemColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      width: 300,
      render: (text: string, record: OrderItem) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Image
            width={60}
            height={60}
            src={record.productImage}
            style={{ objectFit: 'cover', borderRadius: 6 }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <small style={{ color: '#999' }}>SKU: {record.productSku}</small>
          </div>
        </div>
      )
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      align: 'right' as const,
      width: 120,
      render: (price: number) => `${price.toLocaleString('vi-VN')}₫`
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center' as const,
      width: 100
    },
    {
      title: 'Thành tiền',
      dataIndex: 'subtotal',
      align: 'right' as const,
      width: 130,
      render: (subtotal: number) => (
        <span style={{ fontWeight: 600, color: '#ff4444' }}>
          {subtotal.toLocaleString('vi-VN')}₫
        </span>
      )
    }
  ];

  const orderTimeline = [
    {
      time: '2026-02-07 10:30',
      status: 'Đơn hàng đã được tạo',
      color: 'blue'
    },
    {
      time: '2026-02-07 10:35',
      status: 'Đã xác nhận đơn hàng',
      color: 'green'
    },
    {
      time: '2026-02-07 11:00',
      status: 'Đang chuẩn bị hàng',
      color: 'cyan'
    },
    {
      time: '2026-02-07 14:00',
      status: 'Đã giao cho đơn vị vận chuyển',
      color: 'purple'
    }
  ];

  const handleQuickAction = (newStatus: OrderStatus) => {
    onUpdateStatus(order, newStatus);
  };

  const handleSaveNote = () => {
    // API call to save admin note
    message.success('Đã lưu ghi chú');
  };

  const currentStep = getStatusStep(order.status);

  return (
    <Modal
      open={open}
      title={
        <div className="modal-header">
          <div>
            <h3>Chi tiết đơn hàng #{order.orderNumber}</h3>
            <Tag color={statusColors[order.status]} style={{ fontSize: 13 }}>
              {statusText[order.status]}
            </Tag>
          </div>
          <small style={{ color: '#999' }}>
            Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
          </small>
        </div>
      }
      onCancel={onClose}
      width={1000}
      footer={null}
      className="order-detail-modal"
    >
      {/* Progress Steps */}
      {currentStep >= 0 && (
        <div className="order-progress">
          <Steps
            current={currentStep}
            items={[
              {
                title: 'Chờ xác nhận',
                icon: <ClockCircleOutlined />
              },
              {
                title: 'Đã xác nhận',
                icon: <CheckCircleOutlined />
              },
              {
                title: 'Đang xử lý',
                icon: <ShoppingOutlined />
              },
              {
                title: 'Đang giao',
                icon: <TruckOutlined />
              },
              {
                title: 'Hoàn thành',
                icon: <CheckCircleOutlined />
              }
            ]}
          />
        </div>
      )}

      {order.status === 'CANCELLED' && (
        <div className="cancelled-notice">
          <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4444' }} />
          <h3>Đơn hàng đã bị hủy</h3>
        </div>
      )}

      <Divider />

      {/* Order Info */}
      <div className="order-info-section">
        <h4>📋 Thông tin đơn hàng</h4>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Mã đơn hàng" span={1}>
            <strong>{order.orderNumber}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={statusColors[order.status]}>
              {statusText[order.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán" span={1}>
            <Tag color="blue" icon={<DollarOutlined />}>
              {order.paymentMethod}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán" span={1}>
            <Tag color={order.paymentStatus === 'PAID' ? 'success' : 'error'}>
              {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú khách hàng" span={2}>
            {order.note || <span style={{ color: '#999' }}>Không có ghi chú</span>}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Customer Info - Mock data */}
      <div className="customer-info-section">
        <h4>👤 Thông tin khách hàng</h4>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Họ tên" span={1}>
            <UserOutlined /> Nguyễn Văn A
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={1}>
            <PhoneOutlined /> 0123 456 789
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
            <EnvironmentOutlined /> 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Order Items */}
      <div className="order-items-section">
        <h4>🛒 Sản phẩm đặt hàng</h4>
        <Table
          bordered
          rowKey="id"
          columns={itemColumns}
          dataSource={order.items}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} align="right">
                  <strong>Tổng cộng:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <strong style={{ fontSize: 16, color: '#ff4444' }}>
                    {order.total.toLocaleString('vi-VN')}₫
                  </strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      {/* Timeline */}
      <div className="order-timeline-section">
        <h4>📅 Lịch sử đơn hàng</h4>
        <Timeline
          items={orderTimeline.map(item => ({
            color: item.color,
            children: (
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>{item.status}</p>
                <small style={{ color: '#999' }}>{item.time}</small>
              </div>
            )
          }))}
        />
      </div>

      {/* Admin Note */}
      <div className="admin-note-section">
        <h4>📝 Ghi chú nội bộ</h4>
        <TextArea
          rows={3}
          placeholder="Thêm ghi chú nội bộ..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
        />
        <Button
          type="primary"
          style={{ marginTop: 8 }}
          onClick={handleSaveNote}
        >
          Lưu ghi chú
        </Button>
      </div>

      {/* Quick Actions */}
      <Divider />
      <div className="quick-actions">
        <Space>
          {order.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleQuickAction('CONFIRMED' as OrderStatus)}
              >
                Xác nhận đơn
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleQuickAction('CANCELLED' as OrderStatus)}
              >
                Hủy đơn
              </Button>
            </>
          )}

          {order.status === 'CONFIRMED' && (
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => handleQuickAction('PROCESSING' as OrderStatus)}
            >
              Bắt đầu xử lý
            </Button>
          )}

          {order.status === 'PROCESSING' && (
            <Button
              type="primary"
              icon={<TruckOutlined />}
              onClick={() => handleQuickAction('SHIPPING' as OrderStatus)}
            >
              Giao hàng
            </Button>
          )}

          {order.status === 'SHIPPING' && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleQuickAction('DELIVERED' as OrderStatus)}
            >
              Đã giao hàng
            </Button>
          )}

          <Button onClick={onClose}>Đóng</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;