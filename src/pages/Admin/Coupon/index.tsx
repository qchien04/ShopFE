import { useState, useEffect } from "react";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  message,
  Popconfirm,
  Spin,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { couponApi } from "../../../api/coupon.api";
import type { Coupon } from "../../../types/entity.type";
import dayjs from "dayjs";
import "./index.scss";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponApi.getAllCoupons();
      setCoupons(data);
    } catch (err) {
      message.error("Lỗi khi tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenModal = (record?: Coupon) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        code: record.code,
        description: record.description,
        discountType: record.discountType,
        discountValue: record.discountValue,
        minOrderValue: record.minOrderValue,
        maxDiscountAmount: record.maxDiscountAmount,
        usageLimit: record.usageLimit,
        active: record.active,
        dates: [dayjs(record.startDate), dayjs(record.endDate)],
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ active: true, discountType: "PERCENTAGE" });
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
      };
      delete payload.dates;

      if (editingId) {
        await couponApi.updateCoupon(editingId, payload);
        message.success("Cập nhật voucher thành công!");
      } else {
        await couponApi.createCoupon(payload);
        message.success("Tạo voucher thành công!");
      }
      handleCloseModal();
      fetchCoupons();
    } catch (err) {
      message.error("Lỗi khi lưu voucher");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await couponApi.deleteCoupon(id);
      message.success("Xóa voucher thành công!");
      fetchCoupons();
    } catch (err) {
      message.error("Lỗi khi xóa voucher");
    }
  };

  const handleToggleActive = async (checked: boolean, record: Coupon) => {
    try {
      const payload = {
        code: record.code,
        description: record.description,
        discountType: record.discountType,
        discountValue: record.discountValue,
        minOrderValue: record.minOrderValue,
        maxDiscountAmount: record.maxDiscountAmount,
        usageLimit: record.usageLimit,
        startDate: record.startDate,
        endDate: record.endDate,
        active: checked,
      };
      await couponApi.updateCoupon(record.id!, payload);
      message.success(`Đã ${checked ? 'kích hoạt' : 'khóa'} voucher ${record.code}!`);
      fetchCoupons();
    } catch (err) {
      message.error("Lỗi khi cập nhật trạng thái voucher");
    }
  };

  // Searching logic
  const filteredCoupons = coupons.filter(coupon => {
    return coupon.code.toLowerCase().includes(searchText.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchText.toLowerCase()));
  });

  // Pagination bounds
  const totalElements = filteredCoupons.length;
  const maxPage = Math.max(1, Math.ceil(totalElements / pageSize));
  const currentPage = page > maxPage ? maxPage : page;
  const paginatedCoupons = filteredCoupons.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: "#1f1f1f" }}>Quản lý Voucher</h2>
        <Space size="middle" wrap>
          <Input.Search
            placeholder="Tìm kiếm mã voucher, mô tả..."
            style={{ width: 280 }}
            size="large"
            enterButton
            allowClear
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => handleOpenModal()} style={{ borderRadius: 8, fontWeight: 600 }}>
            Tạo Voucher mới
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="voucher-loading-container">
          <Spin size="large" tip="Đang tải danh sách voucher..." />
        </div>
      ) : (
        <div className="voucher-list-container">
          {paginatedCoupons.length > 0 ? (
            paginatedCoupons.map((coupon) => {
              const isPercentage = coupon.discountType === "PERCENTAGE";
              const now = dayjs();
              const start = dayjs(coupon.startDate);
              const end = dayjs(coupon.endDate);

              // Expiry calculations
              let expiryClass = "valid";
              let expiryLabel = "Còn hiệu lực";

              if (now.isBefore(start)) {
                expiryClass = "soon";
                expiryLabel = "Chưa diễn ra";
              } else if (now.isAfter(end)) {
                expiryClass = "expired";
                expiryLabel = "Đã hết hạn";
              } else if (end.diff(now, 'day') <= 3) {
                expiryClass = "soon";
                expiryLabel = "Sắp hết hạn";
              }

              // Usage statistics
              const used = coupon.usedCount || 0;
              const limit = coupon.usageLimit || 0;
              const usagePercent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

              return (
                <div key={coupon.id} className="voucher-row-card">
                  {/* Left: Ticket Punch badge */}
                  <div className="ticket-badge-wrapper">
                    <div className={`ticket-badge ${!isPercentage ? "fixed-type" : ""}`}>
                      <span className="ticket-value">
                        {isPercentage ? `${coupon.discountValue}%` : `-${Math.round(coupon.discountValue / 1000)}K`}
                      </span>
                      <span className="ticket-label">
                        GIẢM GIÁ
                      </span>
                    </div>
                  </div>

                  {/* Middle Left: Details */}
                  <div className="voucher-card-info">
                    <div className="code-row">
                      <span className={`voucher-code ${!isPercentage ? "fixed-type" : ""}`}>
                        {coupon.code}
                      </span>
                      {coupon.description && (
                        <span className="voucher-desc" title={coupon.description}>
                          {coupon.description}
                        </span>
                      )}
                    </div>

                    <div className="limits-row">
                      {coupon.minOrderValue > 0 && (
                        <span className="limit-badge">
                          Đơn tối thiểu: <span className="val">{coupon.minOrderValue.toLocaleString("vi-VN")}₫</span>
                        </span>
                      )}
                      {!isPercentage && coupon?.maxDiscountAmount && coupon.maxDiscountAmount > 0 && (
                        <span className="limit-badge">
                          Giảm tối đa: <span className="val">{coupon.maxDiscountAmount.toLocaleString("vi-VN")}₫</span>
                        </span>
                      )}
                      <span className="limit-badge">
                        Mức giảm: <span className="val">{isPercentage ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString("vi-VN")}₫`}</span>
                      </span>
                    </div>

                    {/* Progress limits */}
                    <div className="usage-progress-wrapper">
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar-fill ${!isPercentage ? "fixed-type" : ""}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                      <span className="usage-text">
                        Đã dùng: {used} / {limit > 0 ? limit : "∞"} ({usagePercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Middle Right: Dates & Expiry */}
                  <div className="voucher-card-dates">
                    <span className="date-title">Hạn sử dụng</span>
                    <span className="date-value">
                      <CalendarOutlined style={{ color: "#00c853" }} />
                      {end.format("DD/MM/YYYY HH:mm")}
                    </span>
                    <span className={`expiry-status ${expiryClass}`}>
                      <ClockCircleOutlined /> {expiryLabel}
                    </span>
                  </div>

                  {/* Right-Middle: Status Toggle */}
                  <div className="voucher-card-status-wrapper">
                    <Switch
                      checkedChildren="Bật"
                      unCheckedChildren="Khóa"
                      checked={coupon.active}
                      onChange={(checked) => handleToggleActive(checked, coupon)}
                    />
                  </div>

                  {/* Right: Actions */}
                  <div className="voucher-card-actions">
                    <Button
                      className="btn-edit"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenModal(coupon)}
                    />
                    <Popconfirm
                      title="Bạn có chắc muốn xóa voucher này?"
                      description="Hành động này không thể hoàn tác!"
                      onConfirm={() => handleDelete(coupon.id!)}
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button danger className="btn-delete" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="voucher-empty-state">
              Không tìm thấy voucher nào phù hợp.
            </div>
          )}

          {/* Pagination */}
          <div className="voucher-pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElements}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} voucher`}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
              }}
            />
          </div>
        </div>
      )}

      <Modal
        title={editingId ? "Sửa Voucher" : "Tạo Voucher mới"}
        open={isModalVisible}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="code" label="Mã Voucher (Code)" rules={[{ required: true, message: "Vui lòng nhập mã" }]}>
            <Input placeholder="Nhập mã, ví dụ: TET2026" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả ưu đãi..." />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="discountType" label="Loại giảm giá" style={{ width: 150 }}>
              <Select>
                <Option value="PERCENTAGE">Phần trăm (%)</Option>
                <Option value="FIXED_AMOUNT">Tiền cố định (₫)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="discountValue"
              label="Mức giảm"
              dependencies={['discountType']}
              rules={[
                { required: true, message: "Vui lòng nhập mức giảm" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const type = getFieldValue('discountType');
                    if (type === 'PERCENTAGE' && value > 100) {
                      return Promise.reject(new Error('Phần trăm giảm giá không thể quá 100%'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="minOrderValue" label="Đơn tối thiểu (₫)" style={{ flex: 1 }}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="maxDiscountAmount" label="Giảm tối đa (₫)" style={{ flex: 1 }}>
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Chỉ áp dụng cho %" />
            </Form.Item>
          </Space>

          <Form.Item name="usageLimit" label="Số lượng phát hành" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} min={1} placeholder="Ví dụ: 100" />
          </Form.Item>

          <Form.Item name="dates" label="Thời gian áp dụng" rules={[{ required: true }]}>
            <RangePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="active" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CouponPage;
