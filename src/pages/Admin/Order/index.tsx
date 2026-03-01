import { useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Modal,
  Dropdown,
  message,
  DatePicker,
  Statistic,
  Card,
  Row,
  Col,
  Image
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PrinterOutlined,
  DownloadOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TruckOutlined
} from '@ant-design/icons';
import type { Order } from '../../../types/entity.type';
import { OrderStatus,PaymentStatus, PaymentMethod} from '../../../types/entity.type';
import OrderDetailModal from '../../../components/OrderDetailModal';
import { useAdminOrders } from '../../../hooks/Order/useOrder';

const { RangePicker } = DatePicker;

const OrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const {data:orders}=useAdminOrders();
  // Mock data - thay bằng API call
  // const mockOrders: Order[] = [
  //   {
  //     id: 1,
  //     orderNumber: 'ORD-2026-0001',
  //     items: [
  //       {
  //         id: 1,
  //         productId: 1,
  //         productName: 'Ổ cắm điện 6000W',
  //         productSku: '3S-6000W-C',
  //         productImage: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=100',
  //         quantity: 2,
  //         price: 41000,
  //         subtotal: 82000
  //       }
  //     ],
  //     total: 82000,
  //     status: 'PENDING' as OrderStatus,
  //     paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
  //     paymentStatus: 'UNPAID' as PaymentStatus,
  //     note: 'Giao giờ hành chính',
  //     createdAt: '2026-02-07T10:30:00Z'
  //   },
  //   {
  //     id: 2,
  //     orderNumber: 'ORD-2026-0002',
  //     items: [
  //       {
  //         id: 2,
  //         productId: 2,
  //         productName: 'Biến áp 19V 5A',
  //         productSku: 'BT-19V-5A',
  //         productImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100',
  //         quantity: 1,
  //         price: 194000,
  //         subtotal: 194000
  //       }
  //     ],
  //     total: 194000,
  //     status: 'CONFIRMED' as OrderStatus,
  //     paymentMethod: 'MOMO' as PaymentMethod,
  //     paymentStatus: 'PAID' as PaymentStatus,
  //     note: '',
  //     createdAt: '2026-02-07T09:15:00Z'
  //   },
  //   {
  //     id: 3,
  //     orderNumber: 'ORD-2026-0003',
  //     items: [
  //       {
  //         id: 3,
  //         productId: 3,
  //         productName: 'Cuộn cảm 1.8mm',
  //         productSku: 'CC-1.8MM',
  //         productImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100',
  //         quantity: 5,
  //         price: 196000,
  //         subtotal: 980000
  //       }
  //     ],
  //     total: 980000,
  //     status: 'SHIPPING' as OrderStatus,
  //     paymentMethod: 'VNPAY' as PaymentMethod,
  //     paymentStatus: 'PAID' as PaymentStatus,
  //     note: 'Ship nhanh',
  //     createdAt: '2026-02-06T14:20:00Z'
  //   },
  //   {
  //     id: 4,
  //     orderNumber: 'ORD-2026-0004',
  //     items: [
  //       {
  //         id: 4,
  //         productId: 4,
  //         productName: 'Tụ điện 100uF',
  //         productSku: 'TD-100UF',
  //         productImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100',
  //         quantity: 10,
  //         price: 15000,
  //         subtotal: 150000
  //       }
  //     ],
  //     total: 150000,
  //     status: 'DELIVERED' as OrderStatus,
  //     paymentMethod: 'ZALOPAY' as PaymentMethod,
  //     paymentStatus: 'PAID' as PaymentStatus,
  //     note: '',
  //     createdAt: '2026-02-05T11:00:00Z'
  //   }
  // ];

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

  const paymentMethodText: Record<PaymentMethod, string> = {
    BANK_TRANSFER: 'Chuyển khoản',
    COD: 'Thanh toán khi nhận hàng'
  };

  const paymentStatusColors: Record<PaymentStatus, string> = {
    UNPAID: 'error',
    PAID: 'success',
    REFUNDED: 'warning'
  };

  const paymentStatusText: Record<PaymentStatus, string> = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    REFUNDED: 'Đã hoàn tiền'
  };

  const filteredOrders = orders?.filter(order => {
    const matchSearch = 
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchPaymentStatus = paymentStatusFilter === 'ALL' || order.paymentStatus === paymentStatusFilter;

    return matchSearch && matchStatus && matchPaymentStatus;
  });

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    Modal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: `Bạn có chắc muốn chuyển đơn hàng ${order.orderNumber} sang trạng thái "${statusText[newStatus]}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        // API call here
        message.success(`Đã cập nhật trạng thái đơn hàng ${order.orderNumber}`);
      }
    });
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

   const getStatusActions = (order: Order) => {
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


  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderNumber',
      fixed: 'left',
      render: (text) => (
        <span style={{ fontWeight: 600, color: '#1890ff' }}>{text}</span>
      )
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      render: (items) => (
        <div className="order-items-preview">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="item-row">
              <Image width={80}
                height={80} 
                src={item.productImage} 
                alt={item.productName} 
              />
              <div className="item-info">
                <span className="item-name">{item.productName}</span>
                <span className="item-quantity">x{item.quantity}</span>
              </div>
            </div>
          ))}
          {items.length > 1 && (
            <span className="more-items">+{items.length - 1} sản phẩm khác</span>
          )}
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      align: 'right',
      render: (total) => (
        <span style={{ fontWeight: 700, color: '#ff4444', fontSize: 15 }}>
          {total.toLocaleString('vi-VN')}₫
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      filters: Object.entries(statusText).map(([key, value]) => ({
        text: value,
        value: key
      })),
      render: (status: OrderStatus) => (
        <Tag color={statusColors[status]} style={{ fontWeight: 500 }}>
          {statusText[status]}
        </Tag>
      )
    },
    {
      title: 'Thanh toán',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Tag color="blue">{paymentMethodText[record.paymentMethod]}</Tag>
          </div>
          <Tag color={paymentStatusColors[record.paymentStatus as PaymentStatus]}>
            {paymentStatusText[record.paymentStatus as PaymentStatus]}
          </Tag>
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      render: (date) => (
        <div>
          <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
          <small style={{ color: '#999' }}>
            {new Date(date).toLocaleTimeString('vi-VN')}
          </small>
        </div>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      ellipsis: true
    },
    {
      title: 'Thao tác',
      fixed: 'right',
      render: (_, record) => {
        const statusActions = getStatusActions(record);

        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            >
              Chi tiết
            </Button>

            {statusActions.length > 0 && (
              <Dropdown
                menu={{
                  items: statusActions.map(action => ({
                    key: action.key,
                    label: action.label,
                    icon: action.icon,
                    onClick: () => handleUpdateStatus(record, action.key)
                  }))
                }}
              >
                <Button size="small" icon={<MoreOutlined />} />
              </Dropdown>
            )}
          </Space>
        );
      }
    }
  ];

  // Statistics
  const stats = {
    total: orders?.length,
    pending: orders?.filter(o => o.status === 'PENDING').length,
    processing: orders?.filter(o => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length,
    shipping: orders?.filter(o => o.status === 'SHIPPING').length,
    delivered: orders?.filter(o => o.status === 'DELIVERED').length,
    revenue: orders?orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0)
      :0
  };

  return (
    <div className="orders-page">
      {/* Statistics Cards */}
      <Row gutter={16} className="stats-row">
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              prefix={<EditOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang giao"
              value={stats.shipping}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã giao"
              value={stats.delivered}
              prefix={<CheckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filters-card">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input.Search
              placeholder="Tìm kiếm mã đơn, sản phẩm..."
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />

            <Select
              style={{ width: 160 }}
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                ...Object.entries(statusText).map(([key, value]) => ({
                  value: key,
                  label: value
                }))
              ]}
            />

            <Select
              style={{ width: 160 }}
              placeholder="Thanh toán"
              value={paymentStatusFilter}
              onChange={setPaymentStatusFilter}
              options={[
                { value: 'ALL', label: 'Tất cả' },
                ...Object.entries(paymentStatusText).map(([key, value]) => ({
                  value: key,
                  label: value
                }))
              ]}
            />

            <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
          </Space>

          <Space>
            <Button icon={<DownloadOutlined />}>
              Xuất Excel
            </Button>
            <Button type="primary" icon={<PrinterOutlined />}>
              In đơn hàng
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Table */}
      <Card className="table-card">
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          scroll={{ x: 1219 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`
          }}
        />
      </Card>

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          open={detailModalOpen}
          order={selectedOrder}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default OrdersPage;