import { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Input, Select, InputNumber, DatePicker, Switch, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { couponApi } from "../../../api/coupon.api";
import type { Coupon } from "../../../types/entity.type";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const columns = [
    { title: "Mã", dataIndex: "code", key: "code", render: (text: string) => <strong>{text}</strong> },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
      render: (val: string) => val === "PERCENTAGE" ? "Phần trăm (%)" : "Cố định (₫)"
    },
    {
      title: "Giá trị",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (val: number, record: Coupon) =>
        record.discountType === "PERCENTAGE" ? `${val}%` : `${val.toLocaleString("vi-VN")} ₫`
    },
    {
      title: "Số lượng",
      dataIndex: "usageLimit",
      key: "usageLimit",
      render: (val: number, record: Coupon) => `${record.usedCount || 0} / ${val || "∞"}`
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "endDate",
      key: "endDate",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span style={{ color: active ? 'green' : 'red' }}>{active ? "Hoạt động" : "Đã khóa"}</span>
      )
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Coupon) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id!)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Quản lý Voucher</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Tạo Voucher / Tặng khách hàng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="id"
        loading={loading}
      />

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
