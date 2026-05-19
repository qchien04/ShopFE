import { Rate, Button, Tabs, Popconfirm, Spin, Input, message } from "antd";
import { DeleteOutlined, CheckOutlined, CloseOutlined, CommentOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAdminReviews, useDeleteReview, useApproveReview, useRejectReview } from "../../../hooks/Admin";
import "./ReviewManagePage.scss";

export default function ReviewManagePage() {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading } = useAdminReviews(status as any, page);
  const { mutate: remove, isPending: deleting } = useDeleteReview();
  const { mutate: approve, isPending: approving } = useApproveReview();
  const { mutate: reject, isPending: rejecting } = useRejectReview();

  const handleApprove = (id: number) => {
    approve(id, {
      onSuccess: () => {
        message.success("Đã hiển thị đánh giá công khai!");
      },
      onError: () => {
        message.error("Lỗi khi khôi phục đánh giá");
      }
    });
  };

  const handleReject = (id: number) => {
    reject(id, {
      onSuccess: () => {
        message.success("Đã ẩn đánh giá này khỏi cửa hàng!");
      },
      onError: () => {
        message.error("Lỗi khi ẩn đánh giá");
      }
    });
  };

  const handleDelete = (id: number) => {
    remove(id, {
      onSuccess: () => {
        message.success("Đã xóa đánh giá vĩnh viễn!");
      },
      onError: () => {
        message.error("Lỗi khi xóa đánh giá");
      }
    });
  };

  // Filter local data if search text is present
  const rawReviews = data?.content || [];
  const filteredReviews = rawReviews.filter((review: any) => {
    const searchLower = searchText.toLowerCase();
    const matchProduct = (review.productName || "").toLowerCase().includes(searchLower);
    const matchUser = (review.userName || "").toLowerCase().includes(searchLower);
    const matchComment = (review.comment || "").toLowerCase().includes(searchLower);
    return matchProduct || matchUser || matchComment;
  });

  return (
    <div style={{ padding: 24, background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: "#1f1f1f" }}>Quản lý Đánh giá & Bình luận</h2>

        <Input.Search
          placeholder="Tìm sản phẩm, người dùng, nội dung..."
          style={{ width: 320 }}
          size="large"
          enterButton
          allowClear
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <Tabs
        activeKey={status}
        onChange={(key) => {
          setStatus(key as any);
          setPage(0);
        }}
        items={[
          { key: "APPROVED", label: "Đã duyệt / Công khai" },
          { key: "REJECTED", label: "Đã ẩn" },
        ]}
        style={{ marginBottom: 16 }}
      />

      {isLoading ? (
        <div className="review-loading-container">
          <Spin size="large" tip="Đang tải danh sách đánh giá..." />
        </div>
      ) : (
        <div>
          <div className="review-list-container">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review: any) => {
                const userFallbackChar = (review.userName || "U").charAt(0).toUpperCase();
                const reviewDate = review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("vi-VN") + " " + new Date(review.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
                  : "Chưa rõ thời gian";

                return (
                  <div key={review.id} className="review-row-card">
                    {/* User profile section */}
                    <div className="review-card-user">
                      <div className="user-avatar-wrapper">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt={review.userName} onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }} />
                        ) : (
                          <span className="avatar-fallback">{userFallbackChar}</span>
                        )}
                      </div>
                      <h4 className="user-fullname" title={review.userName}>
                        {review.userName || "Khách ẩn danh"}
                      </h4>
                      <span className="review-date">{reviewDate}</span>
                    </div>

                    {/* Content Section */}
                    <div className="review-card-content">
                      <div className="product-title-badge">
                        <CommentOutlined />
                        <span>Sản phẩm: {review.productName || "Không xác định"}</span>
                      </div>

                      <div className="rating-row">
                        <Rate disabled value={review.rating || 5} style={{ fontSize: 14 }} />
                        <span style={{ fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>
                          ({review.rating || 5}/5 sao)
                        </span>
                      </div>

                      <div className="comment-bubble">
                        <p className="comment-text">
                          "{review.comment || "Không có nội dung đánh giá."}"
                        </p>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="review-card-actions">
                      {status === "APPROVED" && (
                        <Button
                          className="btn-reject"
                          icon={<CloseOutlined />}
                          loading={rejecting}
                          onClick={() => handleReject(review.id)}
                        >
                          Ẩn
                        </Button>
                      )}

                      {status === "REJECTED" && (
                        <Button
                          className="btn-approve"
                          icon={<CheckOutlined />}
                          loading={approving}
                          onClick={() => handleApprove(review.id)}
                        >
                          Hiện lại
                        </Button>
                      )}

                      <Popconfirm
                        title="Bạn có chắc chắn muốn xóa đánh giá này?"
                        description="Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn!"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(review.id)}
                      >
                        <Button
                          className="btn-delete"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deleting}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="review-empty-state">
                Không tìm thấy đánh giá nào phù hợp.
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.totalElements !== undefined && data.totalElements > 0 && (
            <div className="review-pagination-container">
              <span style={{ fontSize: 13, color: "#8c8c8c", lineHeight: "32px" }}>
                Tổng cộng: <strong>{data.totalElements}</strong> đánh giá
              </span>

              <div style={{ marginLeft: "auto", display: "inline-block" }}>
                <Spin spinning={isLoading} size="small">
                  <Button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    style={{ marginRight: 8, borderRadius: 6 }}
                  >
                    Trang trước
                  </Button>
                  <span style={{ margin: "0 12px", fontWeight: 600 }}>
                    Trang {page + 1} / {Math.ceil(data.totalElements / 10)}
                  </span>
                  <Button
                    disabled={(page + 1) * 10 >= data.totalElements}
                    onClick={() => setPage(p => p + 1)}
                    style={{ marginLeft: 8, borderRadius: 6 }}
                  >
                    Trang sau
                  </Button>
                </Spin>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
