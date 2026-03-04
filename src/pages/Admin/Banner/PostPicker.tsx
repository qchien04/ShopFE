import { Checkbox, Empty, Spin, Tag } from "antd";
import type { Post } from "../../../types/entity.type";
import { antdMessage } from "../../../utils/antdMessage";
import {
  PictureOutlined,
} from "@ant-design/icons";
// ─── Post Picker ───────────────────────────────────────────────────────────────
export const PostPicker = ({ posts, loading, selectedIds, onChange, max = 6 }: {
  posts:       Post[]   | undefined;
  loading:     boolean;
  selectedIds: number[];
  onChange:    (ids: number[]) => void;
  max?:        number;
}) => {
  const toggle = (id: number) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      if (selectedIds.length >= max) {
        antdMessage.warning(`Chỉ được chọn tối đa ${max} bài`);
        return;
      }
      onChange([...selectedIds, id]);
    }
  };

  if (loading) return <div className="post-picker__loading"><Spin /></div>;
  if (!posts?.length) return <Empty description="Không có bài viết" />;

  return (
    <div className="post-picker">
      <div className="post-picker__hint">
        Đã chọn <strong>{selectedIds.length}</strong> / {max} bài •
        Click để chọn/bỏ chọn bài hiển thị trang chủ
      </div>
      <div className="post-picker__list">
        {posts.map((post) => {
          const checked = selectedIds.includes(post.id);
          return (
            <div
              key={post.id}
              className={`post-card ${checked ? "post-card--selected" : ""}`}
              onClick={() => toggle(post.id)}
            >
              <Checkbox checked={checked} className="post-card__check" />
              {post.thumbnail
                ? <img src={post.thumbnail} className="post-card__img" alt="" />
                : <div className="post-card__img post-card__img--empty"><PictureOutlined /></div>
              }
              <div className="post-card__body">
                <div className="post-card__title">{post.title}</div>
                {post.description && (
                  <div className="post-card__desc">{post.description}</div>
                )}
                <div className="post-card__meta">
                  <Tag color="blue"  style={{ fontSize: 11 }}>{post.category}</Tag>
                  <Tag color={post.status === "PUBLISHED" ? "green" : "default"} style={{ fontSize: 11 }}>
                    {post.status === "PUBLISHED" ? "Đã đăng" : "Nháp"}
                  </Tag>
                  <span className="post-card__date">
                    {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};