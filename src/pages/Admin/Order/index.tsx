import { useEffect, useState } from 'react';
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
import { useAdminOrders, useUpdateStatusOrders, useUpdatePaymentStatus, useAdminOrdersPaginated } from '../../../hooks/Order/useOrder';
import { getStatusActions, paymentMethodText, paymentStatusColors, paymentStatusText, statusColors, statusText } from './Mapper';
import { Stat } from './Stat';
import { Filter } from './Filter';
import { antdModal } from '../../../utils/antdModal';
import "./OdersPage.scss";
import type { AdminOrderFilter } from '../../../types';
const INITIAL_FILTER: AdminOrderFilter = {
  page: 0,
  pageSize: 5,
  status: 'ALL',
  keyword: '',
  paymentStatus: 'ALL',
  fromDate: null,
  toDate: null,
};

const OrdersPage = () => {
  const [filter, setFilter] = useState<AdminOrderFilter>(INITIAL_FILTER);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const { mutate: UpdateStatus } = useUpdateStatusOrders();
  const { mutate: updatePaymentStatus } = useUpdatePaymentStatus();
  const { data, isLoading } = useAdminOrdersPaginated(filter);

  const orders = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const counts = data?.counts ?? {};

  // Patch một phần filter, tự reset page nếu cần
  const handleFilterChange = (patch: Partial<AdminOrderFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...patch,
      page: patch.page ?? 0,
    }));
  };

  const handleReset = () => setFilter(INITIAL_FILTER);

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus, reason?: string, internalNote?: string) => {
    antdModal.confirm({
      title: 'Cập nhật trạng thái đơn hàng',
      content: (
        <div>
          <div>
            Chuyển đơn <b>{order.orderNumber}</b> sang{' '}
            <b>"{statusText[newStatus]}"</b>?
          </div>``
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
    total: counts['ALL'] ?? 0,
    pending: counts['PENDING'] ?? 0,
    confirmed: counts['CONFIRMED'] ?? 0,
    processing: counts['PROCESSING'] ?? 0,
    shipping: counts['SHIPPING'] ?? 0,
    delivered: counts['DELIVERED'] ?? 0,
    revenue: orders
      .filter(o => o.status === OrderStatus.DELIVERED)
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="orders-page">
      <Stat stats={stats}></Stat>

      <Filter
        filter={filter}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      <Card className="table-card" style={{ border: 'none', background: 'transparent', boxShadow: 'none' }}>
        {isLoading ? (
          <div className="order-loading-container">
            <Spin size="large" tip="Đang tải danh sách đơn hàng..." />
          </div>
        ) : (
          <div className="order-list-container">
            {orders.length > 0 ? (
              orders.map(order => {
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
                current={filter.page + 1}
                pageSize={filter.pageSize}
                total={totalElements}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} / ${total} đơn hàng`
                }
                onChange={(p, ps) =>
                  handleFilterChange({ page: p - 1, pageSize: ps })
                }
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