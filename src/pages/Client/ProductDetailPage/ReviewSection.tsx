import { useState } from "react";
import { Rate, Input, Button, Avatar, Empty, message, Spin } from "antd";
import {
  MessageOutlined,
  StarFilled,
  SendOutlined,
  CheckCircleFilled,
  EditOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useAppSelector, type RootState } from "../../../app/store";
import { useAddReview, useReviews } from "../../../hooks/Review";

const { TextArea } = Input;

export default function ReviewSection({ productId }: { productId: number }) {
  const { userAccount: user } = useAppSelector(
    (state: RootState) => state.auth
  );

  const { data, isLoading } = useReviews(productId);
  const { mutate: addReview, isPending } = useAddReview(productId);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = () => {
    if (!rating) return message.warning("Vui lòng chọn số sao đánh giá!");
    if (!comment.trim()) return message.warning("Vui lòng viết nhận xét của bạn!");

    addReview(
      { rating, comment },
      {
        onSuccess: () => {
          message.success("Cảm ơn bạn đã gửi đánh giá! ❤️");
          setRating(5);
          setComment("");
          setShowForm(false);
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
        },
      }
    );
  };

  const reviews = data?.reviews || [];
  const total = reviews.length;

  // Star breakdown calculation
  const breakdownCounts = [0, 0, 0, 0, 0]; // 1 to 5 stars
  reviews.forEach((r: any) => {
    const star = Math.round(r.rating || 5);
    if (star >= 1 && star <= 5) {
      breakdownCounts[star - 1]++;
    }
  });

  const breakdownPercent = breakdownCounts.map(count =>
    total > 0 ? Math.round((count / total) * 100) : 0
  );

  return (
    <div className="product-reviews-section">
      {/* Grand Rating Overview Dashboard */}
      <div className="reviews-dashboard">
        <div className="dashboard-grid">

          {/* Column 1: Score Circle */}
          <div className="dashboard-col score-col">
            <div className="rating-score-circle">
              <span className="score-big">{data?.averageRating ? data.averageRating.toFixed(1) : "0.0"}</span>
              <span className="score-out-of">/ 5.0</span>
            </div>
            <div className="score-stars">
              <Rate disabled allowHalf value={data?.averageRating ?? 0} style={{ fontSize: 16 }} />
            </div>
            <div className="score-caption">
              <strong>{total}</strong> nhận xét thực tế
            </div>
          </div>

          {/* Column 2: Rating breakdown Progress Bars */}
          <div className="dashboard-col progress-col">
            {[5, 4, 3, 2, 1].map((starIndex) => {
              const percent = breakdownPercent[starIndex - 1];
              const count = breakdownCounts[starIndex - 1];
              return (
                <div key={starIndex} className="breakdown-row">
                  <span className="star-label">{starIndex} sao</span>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="percent-label">{percent}%</span>
                  <span className="count-label">({count})</span>
                </div>
              );
            })}
          </div>

          {/* Column 3: Call to Action to Write Review */}
          <div className="dashboard-col action-col">
            <div className="cta-box">
              <StarFilled className="cta-star-icon" />
              <h4>Chia sẻ cảm nhận của bạn</h4>
              <p>Ý kiến của bạn giúp hàng ngàn người mua sắm khác đưa ra quyết định đúng đắn!</p>

              <Button
                type="primary"
                icon={showForm ? <CloseOutlined /> : <EditOutlined />}
                onClick={() => {
                  if (!user) {
                    message.warning("Vui lòng đăng nhập để viết đánh giá!");
                    return;
                  }
                  setShowForm(!showForm);
                }}
                className={`btn-toggle-form ${showForm ? "active-cancel" : ""}`}
              >
                {showForm ? "Hủy viết đánh giá" : "Viết đánh giá sản phẩm"}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Expandable Submission Form Card */}
      {showForm && user && (
        <div className="review-write-card animate-slide-down">
          <div className="card-header">
            <h4><MessageOutlined /> Đánh giá của bạn về sản phẩm này</h4>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setShowForm(false)}
              style={{ color: "#8c8c8c" }}
            />
          </div>

          <div className="form-body">
            <div className="rating-select-row">
              <span className="label">Mức độ hài lòng:</span>
              <Rate value={rating} onChange={setRating} style={{ fontSize: 26 }} />
              <span className="rating-desc">
                {rating === 5 ? "Rất hài lòng 😍" :
                  rating === 4 ? "Hài lòng 😊" :
                    rating === 3 ? "Bình thường 😐" :
                      rating === 2 ? "Không hài lòng 🙁" : "Rất tệ 😡"}
              </span>
            </div>

            <div className="textarea-row">
              <TextArea
                rows={4}
                placeholder="Nhận xét chi tiết về chất lượng sản phẩm, giao hàng, đóng gói... (Nhập tối thiểu 10 ký tự)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                showCount
                style={{ borderRadius: 12, padding: 16, fontSize: 14 }}
              />
            </div>

            <div className="submit-row">
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={isPending}
                onClick={handleSubmit}
                className="btn-submit-review"
              >
                Gửi đánh giá công khai
              </Button>
            </div>
          </div>
        </div>
      )}

      {!user && !showForm && (
        <div className="review-login-required">
          Vui lòng <a href="/login">Đăng nhập</a> tài khoản để gửi nhận xét và đánh giá cho sản phẩm này.
        </div>
      )}

      <div className="reviews-divider" />

      {/* Customer Comments List */}
      <div className="comments-section-header">
        <h3>Ý kiến khách hàng ({total})</h3>
      </div>

      {isLoading ? (
        <div className="reviews-loading">
          <Spin tip="Đang tải các đánh giá..." size="large" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty">
          <Empty description="Chưa có đánh giá nào cho sản phẩm này. Hãy mua và viết đánh giá đầu tiên!" />
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review: any) => {
            const userChar = (review.userName || "U").charAt(0).toUpperCase();
            const dateStr = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString("vi-VN") + " " + new Date(review.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
              : "Chưa rõ ngày";
            return (
              <div key={review.id} className="client-review-item">

                {/* Header Row */}
                <div className="review-item-header">
                  <div className="user-profile">
                    <Avatar src={review.userAvatar} className="user-avatar">
                      {userChar}
                    </Avatar>
                    <div className="user-info">
                      <span className="user-name">
                        {review.userName || "Người mua ẩn danh"}
                      </span>
                      <span className="verified-badge">
                        <CheckCircleFilled /> Đã mua hàng
                      </span>
                    </div>
                  </div>

                  <div className="meta-right">
                    <div className="stars-box">
                      <Rate disabled value={review.rating || 5} style={{ fontSize: 13 }} />
                    </div>
                    <span className="review-date">{dateStr}</span>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="review-item-body">
                  <p className="comment-text">
                    {review.comment || "Sản phẩm chất lượng tốt, đóng gói kỹ càng, giao hàng nhanh."}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}