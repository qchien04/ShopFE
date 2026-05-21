import { useState } from 'react';
import {
  Tag,
  Button,
  Dropdown,
  Card,
  Image,
  Spin,
  Pagination
} from 'antd';
import {
  EyeOutlined,
  MoreOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  SolutionOutlined
} from '@ant-design/icons';
import type { Order } from '../../../types/entity.type';
import { OrderStatus, PaymentStatus } from '../../../types/entity.type';
import OrderDetailModal from '../../../components/OrderDetailModal';
import { useAdminOrders, useUpdateStatusOrders, useUpdatePaymentStatus } from '../../../hooks/Order/useOrder';
import { getStatusActions, paymentMethodText, paymentStatusColors, paymentStatusText, statusColors, statusText } from './Mapper';
import { Stat } from './Stat';
import { Filter } from './Filter';
import { antdModal } from '../../../utils/antdModal';
import "./OdersPage.scss";


const OrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { mutate: UpdateStatus } = useUpdateStatusOrders();
  const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();
  const { data: orders, isLoading } = useAdminOrders();


  const filteredOrders = orders?.filter(order => {
    const matchSearch =
      order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      order.items.some(item => item.productName.toLowerCase().includes(searchText.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchPaymentStatus = paymentStatusFilter === 'ALL' || order.paymentStatus === paymentStatusFilter;

    return matchSearch && matchStatus && matchPaymentStatus;
  }) || [];

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus, reason?: string, internalNote?: string) => {
    antdModal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: (
        <div>
          <div>
            Chuyển đơn <b>{order.orderNumber}</b> sang{' '}
            <b>"{statusText[newStatus]}"</b>?
          </div>
          {reason && (
            <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
              Lý do: {reason}
            </div>
          )}
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        UpdateStatus({ id: order.id, status: newStatus, reason: reason || "", internalNote: internalNote || "" });
        setDetailModalOpen(false);
        setSelectedOrder(null);
      },
    });
  };

  const handleConfirmPayment = (order: Order) => {
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

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const stats = {
    total: orders?.length,
    pending: orders?.filter(o => o.status === 'PENDING').length,
    processing: orders?.filter(o => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length,
    shipping: orders?.filter(o => o.status === 'SHIPPING').length,
    delivered: orders?.filter(o => o.status === 'DELIVERED').length,
    revenue: orders ? orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0)
      : 0
  };

  // Safe pagination calculation (in case filters shrink the list)
  const totalElements = filteredOrders.length;
  const maxPage = Math.max(1, Math.ceil(totalElements / pageSize));
  const currentPage = page > maxPage ? maxPage : page;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="orders-page">
      <Stat stats={stats}></Stat>

      <Filter
        paymentStatusFilter={paymentStatusFilter}
        searchText={searchText}
        setPaymentStatusFilter={(val) => {
          setPaymentStatusFilter(val);
          setPage(1);
        }}
        setSearchText={(val) => {
          setSearchText(val);
          setPage(1);
        }}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
      />

      <Card className="table-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        {isLoading ? (
          <div className="order-loading-container">
            <Spin size="large" tip="Đang tải danh sách đơn hàng..." />
          </div>
        ) : (
          <div className="order-list-container">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => {
                const statusActions = getStatusActions(order);

                return (
                  <div key={order.id} className="order-row-card">
                    {/* Card Header */}
                    <div className="order-card-header">
                      <div className="header-left">
                        <span className="order-code">#{order.orderNumber}</span>
                        <span className="order-time">
                          <CalendarOutlined /> {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div className="header-right">
                        <Tag className="tag-custom" color={statusColors[order.status]}>
                          {statusText[order.status]}
                        </Tag>
                        <Tag className="tag-custom" color="blue">
                          {paymentMethodText[order.paymentMethod]}
                        </Tag>
                        <Tag className="tag-custom" color={paymentStatusColors[order.paymentStatus as PaymentStatus]}>
                          {paymentStatusText[order.paymentStatus as PaymentStatus]}
                        </Tag>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="order-card-body">
                      {/* Left: Products Preview */}
                      <div className="order-card-items-section">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="item-preview-row">
                            <Image
                              width={48}
                              height={48}
                              className="item-img"
                              src={item.productImage}
                              alt={item.productName}
                              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                            />
                            <div className="item-details">
                              <span className="item-name" title={item.productName}>
                                {item.productName}
                              </span>
                              <span className="item-qty-price">
                                Đơn giá: {item.price.toLocaleString('vi-VN')}₫
                                <span className="qty">x{item.quantity}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 1 && (
                          <span className="more-items-badge">
                            <ShoppingOutlined /> và {order.items.length - 1} sản phẩm khác
                          </span>
                        )}
                      </div>

                      {/* Middle: Pricing summary */}
                      <div className="order-card-summary-section">
                        <div className="summary-row">
                          <span className="label">Khách hàng:</span>
                          <span className="value">{order.customerName || 'N/A'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="label">Điện thoại:</span>
                          <span className="value">{order.customerPhone || 'N/A'}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="summary-row">
                            <span className="label">Giảm giá:</span>
                            <span className="value highlight-green">
                              -{order.discount.toLocaleString('vi-VN')}₫
                              {order.couponCode && ` (${order.couponCode})`}
                            </span>
                          </div>
                        )}
                        <div className="summary-row">
                          <span className="label">Tổng tiền:</span>
                          <span className="value highlight-red">
                            {order.total.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>

                      {/* Right: Note if exists */}
                      {order.note ? (
                        <div className="order-card-note-section">
                          <span className="note-title">
                            <SolutionOutlined /> Ghi chú khách hàng:
                          </span>
                          <span className="note-content">"{order.note}"</span>
                        </div>
                      ) : (
                        <div className="order-card-note-section" style={{ background: '#f5f5f5', borderColor: '#d9d9d9' }}>
                          <span className="note-title" style={{ color: '#8c8c8c' }}>
                            <SolutionOutlined /> Ghi chú:
                          </span>
                          <span className="note-content" style={{ color: '#bfbfbf' }}>Không có ghi chú từ khách hàng.</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="order-card-actions-row">
                      <Button
                        type="primary"
                        className="btn-detail"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(order)}
                      >
                        Xem chi tiết
                      </Button>

                      {order.paymentStatus !== PaymentStatus.PAID && (
                        <Button
                          type="dashed"
                          style={{ borderColor: '#52c41a', color: '#52c41a' }}
                          onClick={() => handleConfirmPayment(order)}
                        >
                          Xác nhận thanh toán
                        </Button>
                      )}

                      {statusActions.length > 0 && (
                        <Dropdown
                          menu={{
                            items: statusActions.map(action => ({
                              key: action.key,
                              label: action.label,
                              icon: action.icon,
                              onClick: () => handleUpdateStatus(order, action.key)
                            }))
                          }}
                        >
                          <Button className="btn-actions" icon={<MoreOutlined />}>
                            Cập nhật trạng thái
                          </Button>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="order-empty-state">
                Không tìm thấy đơn hàng nào phù hợp.
              </div>
            )}

            {/* Pagination */}
            <div className="order-pagination-container">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalElements}
                showSizeChanger
                showTotal={(total) => `Tổng ${total} đơn hàng`}
                onChange={(p, ps) => {
                  setPage(p);
                  setPageSize(ps);
                }}
              />
            </div>
          </div>
        )}
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