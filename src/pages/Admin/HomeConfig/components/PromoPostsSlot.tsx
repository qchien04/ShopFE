// PromoPostsSlot.tsx
import { useState, useMemo } from "react";
import { Modal, Input, Spin, Tag, Checkbox, Button, List, Avatar, Typography } from "antd";
import {
  TagsOutlined,
  CloseOutlined,
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import "./PromopostsSlot.scss";
import type { Post } from "../../../../types/entity.type";

const { Text } = Typography;

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

const PromoPostsSlot = ({
  posts = [],
  loading,
  selected,
  onChange,
  max = 10,
}: PromoPostsSlotProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    posts.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    ), [posts, search]
  );

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
    <div className="promo-manager-v2">
      <div className="promo-manager-v2__current">
        <div className="section-header">
          <div className="title-group">
            <TagsOutlined />
            <span>Bài viết đang hiển thị ({selected.length}/{max})</span>
          </div>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
          >
            Thêm bài viết
          </Button>
        </div>

        <div className="promo-grid">
          {selected.length === 0 ? (
            <div className="empty-state" onClick={() => setOpen(true)}>
              <div className="empty-icon"><FileTextOutlined /></div>
              <p>Chưa có bài viết khuyến mãi nào</p>
              <Button type="dashed">Bấm để chọn bài viết</Button>
            </div>
          ) : (
            selected.map((item) => (
              <div key={item.id} className="promo-card-inline">
                <div className="promo-card-inline__icon">
                  <FileTextOutlined />
                </div>
                <div className="promo-card-inline__content">
                  <div className="field-group">
                    <Text strong className="field-label">Nhãn hiển thị:</Text>
                    <Input
                      variant="borderless"
                      value={item.label}
                      onChange={(e) => setField(item.id, "label", e.target.value)}
                      placeholder="Tên hiển thị trên web"
                      className="inline-input"
                    />
                  </div>
                  <div className="field-group">
                    <Text type="secondary" className="field-label">Đường dẫn:</Text>
                    <Input
                      variant="borderless"
                      value={item.link}
                      onChange={(e) => setField(item.id, "link", e.target.value)}
                      placeholder="/post/123"
                      className="inline-input link-input"
                    />
                  </div>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => remove(item.id)}
                  className="btn-remove"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={open}
        title={
          <div className="modal-title-custom">
            <SearchOutlined />
            <span>Chọn bài viết khuyến mãi</span>
            <Tag color="blue" style={{ marginLeft: 8 }}>{selected.length}/{max}</Tag>
          </div>
        }
        onCancel={() => { setOpen(false); setSearch(""); }}
        footer={[
          <Button key="close" type="primary" onClick={() => setOpen(false)}>Xong</Button>
        ]}
        width={600}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm bài viết..."
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input-modern"
          style={{ marginBottom: 16 }}
        />

        <div className="posts-selection-list" style={{ maxHeight: 400, overflowY: 'auto' }}>
          <Spin spinning={loading}>
            <List
              dataSource={filtered}
              renderItem={(post) => {
                const checked = !!selected.find((s) => s.id === post.id);
                const disabled = !checked && selected.length >= max;
                return (
                  <List.Item
                    className={`selectable-post-item ${checked ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
                    onClick={() => !disabled && toggle(post)}
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer', padding: '12px' }}
                  >
                    <Checkbox checked={checked} disabled={disabled} />
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title={post.title}
                      description={post.category && <Tag color="blue" style={{ fontSize: 10 }}>{post.category}</Tag>}
                      style={{ marginLeft: 12 }}
                    />
                  </List.Item>
                );
              }}
            />
          </Spin>
        </div>
      </Modal>
    </div>
  );
};

export default PromoPostsSlot;