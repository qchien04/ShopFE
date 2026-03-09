import { useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Dropdown,
  Card,
  Image
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {EyeOutlined,MoreOutlined,} from '@ant-design/icons';
import type { Order } from '../../../types/entity.type';
import { OrderStatus,PaymentStatus} from '../../../types/entity.type';
import OrderDetailModal from '../../../components/OrderDetailModal';
import { useAdminOrders, useUpdateStatusOrders } from '../../../hooks/Order/useOrder';
import { getStatusActions, paymentMethodText, paymentStatusColors, paymentStatusText, statusColors, statusText } from './Mapper';
import { Stat } from './Stat';
import { Filter } from './Filter';
import { antdModal } from '../../../utils/antdModal';


const OrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  const {mutate:UpdateStatus}=useUpdateStatusOrders();
  const {data:orders}=useAdminOrders();


  const filteredOrders = orders?.filter(order => {
    const matchSearch = 
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchPaymentStatus = paymentStatusFilter === 'ALL' || order.paymentStatus === paymentStatusFilter;

    return matchSearch && matchStatus && matchPaymentStatus;
  });

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    antdModal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: `Bạn có chắc muốn chuyển đơn hàng ${order.orderNumber} sang trạng thái "${statusText[newStatus]}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        UpdateStatus({id:order.id,status:newStatus});
        setSelectedOrder(null);
        setDetailModalOpen(false);
      }
    });
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
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
      <Stat stats={stats}></Stat>

      <Filter 
        paymentStatusFilter={paymentStatusFilter}
        searchText={searchText}
        setPaymentStatusFilter={setPaymentStatusFilter}
        setSearchText={setSearchText}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
      >

      </Filter>

      <Card className="table-card">
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filteredOrders}
          scroll={{ x: 1219 }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`
          }}
        />
      </Card>

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