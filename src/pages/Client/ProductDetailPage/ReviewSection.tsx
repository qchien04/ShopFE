// components/ReviewSection.tsx
import { useState } from "react";
import { Rate, Input, Button, Avatar, Divider, Empty, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector, type RootState } from "../../../app/store";
import { useAddReview, useReviews } from "../../../hooks/Review";

const { TextArea } = Input;

export default function ReviewSection({ productId }: { productId: number }) {
  const {userAccount:user}= useAppSelector(
      (state: RootState) => state.auth
    );
  const { data, isLoading } = useReviews(productId);
  const { mutate: addReview, isPending } = useAddReview(productId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!rating) return message.warning("Vui lòng chọn số sao");
    if (!comment.trim()) return message.warning("Vui lòng nhập nội dung đánh giá");

    addReview(
      { rating, comment },
      {
        onSuccess: () => {
          message.success("Đánh giá của bạn đang chờ duyệt");
          setRating(0);
          setComment("");
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  };

  return (
    <div style={{ marginTop: 32 }}>
      {/* Tổng quan rating */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#faad14" }}>
            {data?.averageRating ?? 0}
          </div>
          <Rate disabled allowHalf value={data?.averageRating ?? 0} />
          <div style={{ color: "#999", fontSize: 13, marginTop: 4 }}>
            {data?.totalReviews ?? 0} đánh giá
          </div>
        </div>
      </div>

      <Divider />

      {/* Form viết đánh giá */}
      {user ? (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Viết đánh giá của bạn</div>
          <Rate value={rating} onChange={setRating} style={{ marginBottom: 12 }} />
          <TextArea
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            showCount
            style={{ marginBottom: 12 }}
          />
          <Button type="primary" loading={isPending} onClick={handleSubmit}>
            Gửi đánh giá
          </Button>
        </div>
      ) : (
        <div style={{ marginBottom: 24, color: "#999" }}>
          <a href="/login">Đăng nhập</a> để viết đánh giá
        </div>
      )}

      <Divider />

      {/* Danh sách review */}
      {isLoading ? (
        <div>Đang tải...</div>
      ) : data?.reviews?.length === 0 ? (
        <Empty description="Chưa có đánh giá nào" />
      ) : (
        data?.reviews?.map((review: any) => (
          <div key={review.id} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar src={review.userAvatar} icon={<UserOutlined />} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>{review.userName}</span>
                  <span style={{ color: "#999", fontSize: 12 }}>
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <Rate disabled value={review.rating} style={{ fontSize: 13 }} />
                <p style={{ marginTop: 4, marginBottom: 0 }}>{review.comment}</p>
              </div>
            </div>
            <Divider style={{ margin: "16px 0" }} />
          </div>
        ))
      )}
    </div>
  );
}