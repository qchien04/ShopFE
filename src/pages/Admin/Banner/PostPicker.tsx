import { Checkbox, Empty, Spin, Tag, Tooltip, Button } from "antd";
import type { Post } from "../../../types/entity.type";
import { antdMessage } from "../../../utils/antdMessage";
import {
  PictureOutlined,
  CopyOutlined,
  EditOutlined,
} from "@ant-design/icons";

// ─── Post Picker ───────────────────────────────────────────────────────────────
export const PostPicker = ({ posts, loading, selectedIds, onChange, max = 6, renderActions }: {
  posts:          Post[]   | undefined;
  loading:        boolean;
  selectedIds:    number[];
  onChange:       (ids: number[]) => void;
  max?:           number;
  renderActions?: (post: Post) => React.ReactNode;
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

  const copyLink = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation(); // không trigger toggle khi click copy
    const link = `${window.location.origin}/post/${post.id}`; // điều chỉnh path nếu cần
    navigator.clipboard.writeText(link).then(() => {
      antdMessage.success(`Đã copy link: ${post.title}`);
    });
  };

  const openEdit = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation(); // không trigger toggle khi click edit
    window.open(`/admin/posts/${post.id}/edit`, "_blank"); // điều chỉnh path nếu cần
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

              {/* ── Actions: copy link + edit ── */}
              <div className="post-card__actions" onClick={(e) => e.stopPropagation()}>
                {renderActions
                  ? renderActions(post)
                  : (
                    <>
                      <Tooltip title="Copy link bài viết">
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={(e) => copyLink(e, post)}
                        />
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa bài viết">
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          icon={<EditOutlined />}
                          onClick={(e) => openEdit(e, post)}
                        />
                      </Tooltip>
                    </>
                  )
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};