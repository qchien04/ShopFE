import { useState, useEffect } from "react";
import {
  Button, Space, Modal, Form, Input, Select, InputNumber,
  DatePicker, Switch, message, Popconfirm, Tag, Tooltip,
  Spin, Divider,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  ThunderboltOutlined, GiftOutlined, FireOutlined,
  TagsOutlined, StarOutlined, CarOutlined,
} from "@ant-design/icons";
import { promotionApi } from "../../../api/promotion.api";
import { categoryApi } from "../../../api/categories.api";
import { brandApi } from "../../../api/brand.api";
import type { Promotion, PromotionType, OrderTier, FlashSaleItem, Brand } from "../../../types/entity.type";
import dayjs from "dayjs";
import "./index.scss";
import type { Category } from "../../../types/categories.type";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const TYPE_CONFIG: Record<PromotionType, { label: string; icon: React.ReactNode; color: string }> = {
  FLASH_SALE: { label: "Flash Sale", icon: <ThunderboltOutlined />, color: "#ff4d4f" },
  ORDER_TIER: { label: "Giảm theo bậc đơn", icon: <TagsOutlined />, color: "#722ed1" },
  CATEGORY_DISCOUNT: { label: "Giảm theo danh mục", icon: <StarOutlined />, color: "#52c41a" },
  BRAND_DISCOUNT: { label: "Giảm theo thương hiệu", icon: <FireOutlined />, color: "#1677ff" },
  FREE_SHIPPING: { label: "Miễn phí vận chuyển", icon: <CarOutlined />, color: "#eb2f96" },
};

const PromotionPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<PromotionType>("ORDER_TIER");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form] = Form.useForm();

  // Dynamic tier rows
  const [tiers, setTiers] = useState<OrderTier[]>([{ minOrderValue: 0, discountValue: 0, discountType: "PERCENTAGE" }]);
  // Flash sale items (basic - just productId & discountPercent)
  const [flashItems, setFlashItems] = useState<FlashSaleItem[]>([{ productId: 0, discountPercent: 10 }]);

  const fetch = async () => {
    setLoading(true);
    try {
      setPromotions(await promotionApi.getAllPromotions());
      const [cats, brds] = await Promise.all([
        categoryApi.getAll(),
        brandApi.getAll()
      ]);
      setCategories(cats);
      setBrands(brds);
    }
    catch { message.error("Lỗi khi tải danh sách promotion"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ active: true, type: "ORDER_TIER", discountType: "PERCENTAGE" });
    setSelectedType("ORDER_TIER");
    setTiers([{ minOrderValue: 0, discountValue: 0, discountType: "PERCENTAGE" }]);
    setFlashItems([{ productId: 0, discountPercent: 10 }]);
    setIsModalOpen(true);
  };

  const openEdit = (p: Promotion) => {
    setEditingId(p.id);
    setSelectedType(p.type);
    form.setFieldsValue({
      ...p,
      dates: [dayjs(p.startDate), dayjs(p.endDate)],
    });
    setTiers(p.orderTiers || [{ minOrderValue: 0, discountValue: 0, discountType: "PERCENTAGE" }]);
    setFlashItems(p.flashSaleItems || [{ productId: 0, discountPercent: 10 }]);
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      const payload: Partial<Promotion> = {
        ...values,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
        orderTiers: selectedType === "ORDER_TIER" ? tiers : undefined,
        flashSaleItems: selectedType === "FLASH_SALE" ? flashItems : undefined,
      };
      delete (payload as any).dates;

      if (editingId) {
        await promotionApi.updatePromotion(editingId, payload);
        message.success("Cập nhật promotion thành công!");
      } else {
        await promotionApi.createPromotion(payload);
        message.success("Tạo promotion thành công!");
      }
      setIsModalOpen(false);
      fetch();
    } catch { message.error("Lỗi khi lưu promotion"); }
  };

  const handleDelete = async (id: number) => {
    try { await promotionApi.deletePromotion(id); message.success("Đã xóa!"); fetch(); }
    catch { message.error("Lỗi khi xóa"); }
  };

  const handleToggle = async (id: number) => {
    try { await promotionApi.togglePromotion(id); fetch(); }
    catch { message.error("Lỗi khi cập nhật trạng thái"); }
  };

  const now = dayjs();

  return (
    <div className="promotion-page">
      <div className="promotion-header">
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreate}>
          Tạo Promotion
        </Button>
      </div>

      {loading ? (
        <div className="loading-wrap"><Spin size="large" /></div>
      ) : (
        <div className="promotion-list">
          {promotions.length === 0 && (
            <div className="empty-state">
              <GiftOutlined className="empty-icon" />
              <p>Chưa có promotion nào. Hãy tạo promotion đầu tiên!</p>
            </div>
          )}
          {promotions.map((p) => {
            const cfg = TYPE_CONFIG[p.type];
            const isExpired = now.isAfter(dayjs(p.endDate));
            const isNotStarted = now.isBefore(dayjs(p.startDate));
            const isActive = p.active && !isExpired && !isNotStarted;
            const usagePercent = p.usageLimit ? Math.round(((p.usedCount || 0) / p.usageLimit) * 100) : 0;

            return (
              <div key={p.id} className={`promo-card ${isActive ? "active" : "inactive"}`}>
                <div className="promo-card-left" style={{ background: cfg.color }}>
                  <span className="promo-type-icon">{cfg.icon}</span>
                  <span className="promo-type-label">{cfg.label}</span>
                </div>

                <div className="promo-card-body">
                  <div className="promo-name-row">
                    <span className="promo-name">{p.name}</span>
                    {p.priority != null && (
                      <Tag color="gold">Ưu tiên: {p.priority}</Tag>
                    )}
                    <Tag color={isExpired ? "red" : isNotStarted ? "blue" : isActive ? "green" : "default"}>
                      {isExpired ? "Hết hạn" : isNotStarted ? "Chưa bắt đầu" : isActive ? "Đang diễn ra" : "Tắt"}
                    </Tag>
                  </div>

                  {p.description && <p className="promo-desc">{p.description}</p>}

                  <div className="promo-meta">
                    <span>🕐 {dayjs(p.startDate).format("DD/MM/YYYY HH:mm")} → {dayjs(p.endDate).format("DD/MM/YYYY HH:mm")}</span>
                    {p.usageLimit && (
                      <span>📊 {p.usedCount || 0}/{p.usageLimit} lượt ({usagePercent}%)</span>
                    )}
                  </div>

                  {/* Usage progress bar */}
                  {p.usageLimit && (
                    <div className="usage-bar">
                      <div className="usage-fill" style={{ width: `${usagePercent}%`, background: cfg.color }} />
                    </div>
                  )}

                  {/* Type-specific summary */}
                  {p.type === "ORDER_TIER" && p.orderTiers && (
                    <div className="tier-summary">
                      {p.orderTiers.map((t, i) => (
                        <Tag key={i} color="purple">
                          Từ {t.minOrderValue.toLocaleString("vi-VN")}₫ → Giảm {t.discountValue}{t.discountType === "PERCENTAGE" ? "%" : "₫"}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {p.type === "CATEGORY_DISCOUNT" && p.discountValue != null && (
                    <Tag color="green">Giảm {p.discountValue}{p.discountType === "PERCENTAGE" ? "%" : "₫"} danh mục</Tag>
                  )}
                  {p.type === "BRAND_DISCOUNT" && p.discountValue != null && (
                    <Tag color="blue">Giảm {p.discountValue}{p.discountType === "PERCENTAGE" ? "%" : "₫"} thương hiệu</Tag>
                  )}
                  {p.type === "FREE_SHIPPING" && (
                    <Tag color="pink">🚚 Miễn phí vận chuyển</Tag>
                  )}
                  {p.type === "FLASH_SALE" && p.flashSaleItems && (
                    <Tag color="red">⚡ {p.flashSaleItems.length} sản phẩm flash sale</Tag>
                  )}
                </div>

                <div className="promo-card-actions">
                  <Tooltip title={p.active ? "Tắt" : "Bật"}>
                    <Switch checked={p.active} onChange={() => handleToggle(p.id)} size="small" />
                  </Tooltip>
                  <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(p)} />
                  <Popconfirm title="Xóa promotion này?" onConfirm={() => handleDelete(p.id)} okText="Xóa" cancelText="Hủy">
                    <Button icon={<DeleteOutlined />} size="small" danger />
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <Modal
        title={editingId ? "Chỉnh sửa Promotion" : "Tạo Promotion mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={720}
        okText={editingId ? "Cập nhật" : "Tạo"}
        className="promotion-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Tên Promotion" rules={[{ required: true }]}>
            <Input placeholder="VD: Flash Sale Cuối Tuần" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả ngắn về chương trình..." />
          </Form.Item>

          <Space style={{ width: "100%", display: "flex" }}>
            <Form.Item name="type" label="Loại khuyến mãi" style={{ flex: 1 }} rules={[{ required: true }]}>
              <Select onChange={(v) => setSelectedType(v as PromotionType)}>
                {(Object.keys(TYPE_CONFIG) as PromotionType[]).map((t) => (
                  <Option key={t} value={t}>
                    {TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="priority" label="Ưu tiên" style={{ width: 100 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Space style={{ width: "100%", display: "flex" }}>
            <Form.Item name="dates" label="Thời gian áp dụng" rules={[{ required: true }]} style={{ flex: 1 }}>
              <RangePicker showTime style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="usageLimit" label="Giới hạn lượt" style={{ width: 140 }}>
              <InputNumber min={1} placeholder="Không giới hạn" style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Divider>Cấu hình theo loại</Divider>

          {/* ── ORDER TIER ── */}
          {selectedType === "ORDER_TIER" && (
            <div className="tier-config">
              <div className="tier-header">
                <span>Bậc giảm giá theo giá trị đơn hàng</span>
                <Button size="small" onClick={() => setTiers([...tiers, { minOrderValue: 0, discountValue: 0, discountType: "PERCENTAGE" }])}>
                  + Thêm bậc
                </Button>
              </div>
              {tiers.map((tier, i) => (
                <div key={i} className="tier-row">
                  <InputNumber
                    style={{ flex: 1 }} min={0} addonBefore="Đơn từ" addonAfter="₫"
                    value={tier.minOrderValue}
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    onChange={(v) => { const n = [...tiers]; n[i].minOrderValue = v || 0; setTiers(n); }}
                  />
                  <InputNumber
                    style={{ width: 100 }} min={0}
                    value={tier.discountValue}
                    onChange={(v) => { const n = [...tiers]; n[i].discountValue = v || 0; setTiers(n); }}
                  />
                  <Select
                    style={{ width: 100 }} value={tier.discountType}
                    onChange={(v) => { const n = [...tiers]; n[i].discountType = v; setTiers(n); }}
                  >
                    <Option value="PERCENTAGE">%</Option>
                    <Option value="FIXED_AMOUNT">₫</Option>
                  </Select>
                  {tiers.length > 1 && (
                    <Button danger size="small" onClick={() => setTiers(tiers.filter((_, j) => j !== i))}>Xóa</Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── FLASH SALE ── */}
          {selectedType === "FLASH_SALE" && (
            <div className="tier-config">
              <div className="tier-header">
                <span>Sản phẩm Flash Sale</span>
                <Button size="small" onClick={() => setFlashItems([...flashItems, { productId: 0, discountPercent: 10 }])}>
                  + Thêm sản phẩm
                </Button>
              </div>
              {flashItems.map((item, i) => (
                <div key={i} className="tier-row">
                  <InputNumber
                    style={{ width: 130 }} min={1} placeholder="Product ID"
                    value={item.productId || undefined}
                    onChange={(v) => { const n = [...flashItems]; n[i].productId = v || 0; setFlashItems(n); }}
                  />
                  <InputNumber
                    style={{ width: 120 }} min={1} max={100} addonAfter="% giảm"
                    value={item.discountPercent}
                    onChange={(v) => { const n = [...flashItems]; n[i].discountPercent = v || 0; setFlashItems(n); }}
                  />
                  <InputNumber
                    style={{ width: 120 }} min={1} placeholder="Giới hạn SL"
                    value={item.stockLimit}
                    onChange={(v) => { const n = [...flashItems]; n[i].stockLimit = v || undefined; setFlashItems(n); }}
                  />
                  {flashItems.length > 1 && (
                    <Button danger size="small" onClick={() => setFlashItems(flashItems.filter((_, j) => j !== i))}>Xóa</Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── CATEGORY / BRAND DISCOUNT ── */}
          {["CATEGORY_DISCOUNT", "BRAND_DISCOUNT"].includes(selectedType) && (
            <>
              {selectedType === "CATEGORY_DISCOUNT" && (
                <Form.Item name="applyCategoryIds" label="Chọn danh mục áp dụng" rules={[{ required: true }]}>
                  <Select mode="multiple" placeholder="Chọn các danh mục...">
                    {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                  </Select>
                </Form.Item>
              )}
              {selectedType === "BRAND_DISCOUNT" && (
                <Form.Item name="applyBrandIds" label="Chọn thương hiệu áp dụng" rules={[{ required: true }]}>
                  <Select mode="multiple" placeholder="Chọn các thương hiệu...">
                    {brands.map(b => <Option key={b.id!} value={b.id}>{b.name}</Option>)}
                  </Select>
                </Form.Item>
              )}
              <Space style={{ width: "100%", display: "flex" }}>
                <Form.Item name="discountValue" label="Mức giảm" style={{ flex: 1 }} rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="discountType" label="Loại" style={{ width: 130 }} rules={[{ required: true }]}>
                  <Select>
                    <Option value="PERCENTAGE">Phần trăm (%)</Option>
                    <Option value="FIXED_AMOUNT">Số tiền (₫)</Option>
                  </Select>
                </Form.Item>
              </Space>
            </>
          )}

          {/* ── FREE SHIPPING min order ── */}
          {selectedType === "FREE_SHIPPING" && (
            <div className="tier-config">
              <div className="tier-header"><span>Điều kiện miễn phí ship</span></div>
              <div className="tier-row">
                <InputNumber
                  style={{ flex: 1 }} min={0} addonBefore="Đơn tối thiểu" addonAfter="₫"
                  placeholder="0 = không giới hạn"
                  value={tiers[0]?.minOrderValue}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  onChange={(v) => setTiers([{ minOrderValue: v || 0, discountValue: 0, discountType: "FIXED_AMOUNT" }])}
                />
              </div>
            </div>
          )}

          <Form.Item name="active" label="Trạng thái" valuePropName="checked" style={{ marginTop: 16 }}>
            <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionPage;
