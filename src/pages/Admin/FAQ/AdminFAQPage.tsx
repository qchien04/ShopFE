import { useState, useEffect, useCallback } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space,
  Popconfirm, Tag, Typography, Tooltip, Empty, Spin, InputNumber,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  QuestionCircleOutlined, SearchOutlined, ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { faqApi, type FAQItem, type FAQPayload } from '../../../api/faq.api';
import { antdMessage } from '../../../utils/antdMessage';
import './AdminFAQPage.scss';

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORIES = ['Đặt hàng', 'Thanh toán', 'Vận chuyển', 'Đổi trả & Bảo hành', 'Tài khoản', 'Chatbot AI'];

const CATEGORY_COLOR: Record<string, string> = {
  'Đặt hàng': 'blue',
  'Thanh toán': 'gold',
  'Vận chuyển': 'cyan',
  'Đổi trả & Bảo hành': 'orange',
  'Tài khoản': 'purple',
  'Chatbot AI': 'green',
};

const AdminFAQPage = () => {
  const [data, setData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // ── Fetch ─────────────────────────────────────────────────
  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await faqApi.getAll();
      setData(result);
    } catch {
      antdMessage.error('Không thể tải danh sách FAQ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFAQs(); }, [fetchFAQs]);

  // ── Derived filtered list ─────────────────────────────────
  const filtered = data.filter((item) => {
    const matchCat = !filterCategory || item.category === filterCategory;
    const q = searchText.toLowerCase();
    const matchSearch = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // ── CRUD handlers ─────────────────────────────────────────
  const openCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (item: FAQItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await faqApi.delete(id);
      antdMessage.success('Đã xóa câu hỏi thành công');
      setData((prev) => prev.filter((i) => i.id !== id));
    } catch {
      antdMessage.error('Xóa thất bại, vui lòng thử lại');
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields() as FAQPayload;
    setSubmitting(true);
    try {
      if (editingItem) {
        const updated = await faqApi.update(editingItem.id, values);
        setData((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
        antdMessage.success('Cập nhật câu hỏi thành công');
      } else {
        const created = await faqApi.create(values);
        setData((prev) => [...prev, created]);
        antdMessage.success('Thêm câu hỏi mới thành công');
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      antdMessage.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Table columns ─────────────────────────────────────────
  const columns: ColumnsType<FAQItem> = [
    {
      title: '#',
      dataIndex: 'displayOrder',
      width: 56,
      render: (_: unknown, __: FAQItem, index: number) => (
        <Text type="secondary" style={{ fontSize: 12 }}>{index + 1}</Text>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 180,
      render: (cat: string) => (
        <Tag color={CATEGORY_COLOR[cat] || 'default'} style={{ borderRadius: 20, fontWeight: 600 }}>
          {cat}
        </Tag>
      ),
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      render: (q: string) => (
        <Text strong style={{ fontSize: 13.5 }}>{q}</Text>
      ),
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'answer',
      render: (a: string) => (
        <Tooltip title={a} placement="topLeft">
          <Text
            type="secondary"
            style={{ fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
          >
            {a}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'displayOrder',
      width: 80,
      align: 'center',
      render: (v: number) => <Text type="secondary">{v}</Text>,
    },
    {
      title: 'Thao tác',
      width: 110,
      align: 'center',
      render: (_: unknown, record: FAQItem) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              id={`faq-edit-${record.id}`}
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              style={{ color: '#00a647' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa câu hỏi này?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button
                id={`faq-delete-${record.id}`}
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-faq">
      {/* ── Page Header ── */}
      <div className="admin-faq__header">
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchFAQs} loading={loading}>
            Tải lại
          </Button>
          <Button
            id="faq-create-btn"
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={openCreate}
            className="admin-faq__add-btn"
          >
            Thêm câu hỏi
          </Button>
        </Space>
      </div>

      {/* ── Stats row ── */}
      <div className="admin-faq__stats">
        {CATEGORIES.map((cat) => {
          const count = data.filter((i) => i.category === cat).length;
          return (
            <div
              key={cat}
              className={`admin-faq__stat-card ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            >
              <Tag color={CATEGORY_COLOR[cat]} style={{ borderRadius: 20, marginBottom: 4 }}>{cat}</Tag>
              <span className="admin-faq__stat-count">{count}</span>
              <span className="admin-faq__stat-label">câu hỏi</span>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="admin-faq__filters">
        <Input
          id="faq-admin-search"
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 360 }}
          size="large"
        />
        <Select
          id="faq-filter-category"
          placeholder="Lọc theo danh mục"
          allowClear
          value={filterCategory || undefined}
          onChange={(v) => setFilterCategory(v ?? '')}
          style={{ width: 220 }}
          size="large"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <Text type="secondary" style={{ fontSize: 13, alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} / {data.length} câu hỏi
        </Text>
      </div>

      {/* ── Table ── */}
      <div className="admin-faq__table-wrap">
        <Spin spinning={loading}>
          <Table
            id="faq-admin-table"
            rowKey="id"
            dataSource={filtered}
            columns={columns}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Tổng ${total} câu hỏi`,
            }}
            locale={{ emptyText: <Empty description="Chưa có câu hỏi nào" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
            rowClassName="admin-faq__row"
          />
        </Spin>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="admin-faq__modal-icon">
              <QuestionCircleOutlined />
            </span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>
              {editingItem ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
            </span>
          </div>
        }
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleSubmit}
        okText={editingItem ? 'Lưu thay đổi' : 'Thêm mới'}
        cancelText="Hủy"
        width={640}
        destroyOnClose
        centered
        confirmLoading={submitting}
        okButtonProps={{
          id: 'faq-modal-submit',
          size: 'large',
          style: { background: '#00c853', borderColor: '#00c853', fontWeight: 600 },
        }}
        cancelButtonProps={{ size: 'large' }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="category"
            label={<span style={{ fontWeight: 600 }}>Danh mục</span>}
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              id="faq-form-category"
              placeholder="Chọn danh mục câu hỏi"
              size="large"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </Form.Item>

          <Form.Item
            name="question"
            label={<span style={{ fontWeight: 600 }}>Câu hỏi</span>}
            rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
          >
            <Input
              id="faq-form-question"
              placeholder="Nhập câu hỏi thường gặp..."
              size="large"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="answer"
            label={<span style={{ fontWeight: 600 }}>Câu trả lời</span>}
            rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
          >
            <TextArea
              id="faq-form-answer"
              placeholder="Nhập câu trả lời chi tiết, rõ ràng..."
              rows={5}
              showCount
              maxLength={2000}
              style={{ fontSize: 14 }}
            />
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label={<span style={{ fontWeight: 600 }}>Thứ tự hiển thị</span>}
            initialValue={0}
          >
            <InputNumber
              id="faq-form-order"
              min={0}
              max={999}
              style={{ width: '100%' }}
              size="large"
              placeholder="0 = hiển thị trước"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminFAQPage;
