// PromoPostsSlot.tsx
import { useState } from "react";
import { Modal, Input, Spin, Tag, Tooltip, Empty, Checkbox } from "antd";
import {
  EditOutlined,
  TagsOutlined,
  CloseOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { Post } from "../../../types/entity.type";
import "./Promopostsslot.scss";

// ─── Type ─────────────────────────────────────────────────────────────────────

export interface PromoPost {
  id: number;
  label: string; 
  link: string;
}

interface PromoPostsSlotProps {
  posts: Post[] | undefined;
  loading: boolean;
  selected: PromoPost[];
  onChange: (items: PromoPost[]) => void;
  max?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PromoPostsSlot = ({
  posts = [],
  loading,
  selected,
  onChange,
  max = 10,
}: PromoPostsSlotProps) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");

  const getPost = (id: number) => posts.find((p) => p.id === id);

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  // Chọn mới → tự điền label = title, link = /post/id
  const toggle = (post: Post) => {
    const exists = selected.find((s) => s.id === post.id);
    if (exists) {
      onChange(selected.filter((s) => s.id !== post.id));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, { id: post.id, label: post.title, link: `/post/${post.id}` }]);
    }
  };

  const remove = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange(selected.filter((s) => s.id !== id));
  };

  const setField = (id: number, key: "label" | "link", val: string) =>
    onChange(selected.map((s) => (s.id === id ? { ...s, [key]: val } : s)));

  return (
    <>
      {/* ── Slot trên canvas ── */}
      <div className="promo-posts-slot" onClick={() => setOpen(true)}>
        <div className="promo-posts-slot__header">
          <span className="promo-posts-slot__title">
            <TagsOutlined /> Bài viết khuyến mãi
          </span>
          <span className="promo-posts-slot__edit-hint">
            <EditOutlined /> Chỉnh sửa
          </span>
        </div>

        <div className="promo-posts-slot__chips">
          {selected.length === 0 ? (
            <span className="promo-posts-slot__empty-hint">
              <PlusOutlined /> Chưa có bài viết — click để chọn
            </span>
          ) : (
            <>
              {selected.map((item) => (
                <Tooltip key={item.id} title={item.link} placement="top">
                  <Tag
                    className="promo-chip"
                    closable
                    onClose={(e) => remove(item.id, e as unknown as React.MouseEvent)}
                    closeIcon={<CloseOutlined style={{ fontSize: 10 }} />}
                  >
                    <span className="promo-chip__label">
                      {item.label || getPost(item.id)?.title}
                    </span>
                  </Tag>
                </Tooltip>
              ))}
              <Tag className="promo-chip promo-chip--add">
                <PlusOutlined /> Thêm
              </Tag>
            </>
          )}
        </div>

        <div className="promo-posts-slot__footer">
          {selected.length}/{max} bài đã chọn
        </div>
      </div>

      {/* ── Modal ── */}
      <Modal
        open={open}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TagsOutlined style={{ color: "#10b981" }} />
            <span>Chọn &amp; cấu hình bài viết khuyến mãi</span>
            <Tag color="green">{selected.length}/{max} đã chọn</Tag>
          </div>
        }
        onCancel={() => { setOpen(false); setSearch(""); }}
        footer={null}
        width={720}
        styles={{ body: { padding: "12px 24px 24px" } }}
      >

        {/* ── Phần 1: Bài đã chọn → chỉnh label & link ── */}
        {selected.length > 0 && (
          <div className="promo-modal-config">
            <div className="promo-modal-config__heading">✅ Bài đã chọn — chỉnh label &amp; link</div>

            {/* Column header */}
            <div className="promo-config-header">
              <span style={{ width: 20 }}>#</span>
              <span style={{ flex: 1 }}>Label hiển thị</span>
              <span style={{ flex: 1.2 }}>Đường dẫn</span>
              <span style={{ width: 24 }} />
            </div>

            {selected.map((item, idx) => (
              <div key={item.id} className="promo-config-row">
                <span className="promo-config-row__num">{idx + 1}</span>
                <Input
                  size="small"
                  value={item.label}
                  onChange={(e) => setField(item.id, "label", e.target.value)}
                  placeholder="Label hiển thị"
                  className="promo-config-row__label"
                />
                <Input
                  size="small"
                  value={item.link}
                  onChange={(e) => setField(item.id, "link", e.target.value)}
                  placeholder="/duong-dan"
                  className="promo-config-row__link"
                />
                <button className="promo-config-row__del" onClick={() => remove(item.id)}>
                  <CloseOutlined />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Phần 2: Chọn từ danh sách ── */}
        <div className="promo-modal-config__heading" style={{ marginTop: selected.length > 0 ? 16 : 0 }}>
          📋 Chọn thêm từ danh sách
        </div>

        <Input
          prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          placeholder="Tìm theo tiêu đề..."
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 8 }}
        />

        <Spin spinning={loading}>
          {filtered.length === 0 && !loading ? (
            <Empty description="Không tìm thấy bài viết" />
          ) : (
            <div className="promo-modal-list">
              {filtered.map((post) => {
                const checked  = !!selected.find((s) => s.id === post.id);
                const disabled = !checked && selected.length >= max;
                return (
                  <div
                    key={post.id}
                    className={`promo-modal-item ${checked ? "promo-modal-item--checked" : ""} ${disabled ? "promo-modal-item--disabled" : ""}`}
                    onClick={() => !disabled && toggle(post)}
                  >
                    <Checkbox checked={checked} disabled={disabled} />
                    <div className="promo-modal-item__info">
                      <span className="promo-modal-item__title">{post.title}</span>
                      {post.category && (
                        <Tag color="blue" style={{ fontSize: 11 }}>{post.category}</Tag>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Spin>
      </Modal>
    </>
  );
};

export default PromoPostsSlot;