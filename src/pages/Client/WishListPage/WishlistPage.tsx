// pages/Customer/WishlistPage.tsx
import { Empty, Spin, Tag, Button, Popconfirm, message } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./WishlistPage.module.scss";
import { useAddToCart } from "../../../hooks/Cart/useAddToCart";
import { useRemoveWishlist, useWishlist } from "../../../hooks/Wishlist/useWishlist";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useWishlist();
  const { mutate: remove, isPending: removing } = useRemoveWishlist();

  const handleRemove = (productId: number) => {
    remove(productId, {
      onSuccess: () => message.success("Đã xóa khỏi wishlist"),
    });
  };


  if (isLoading) return (
    <div className={styles.loadingWrap}>
      <Spin size="large" />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách yêu thích</h2>
        <span className={styles.count}>{items?.length ?? 0} sản phẩm</span>
      </div>

      {!items?.length ? (
        <div className={styles.emptyWrap}>
          <Empty
            description="Chưa có sản phẩm yêu thích"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button type="primary" onClick={() => navigate("/")}>
            Khám phá sản phẩm
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item: any) => {
            const discountPercent = item.salePrice
              ? Math.round(((item.price - item.salePrice) / item.price) * 100)
              : 0;

            return (
              <div key={item.id} className={styles.card}>
                {/* Discount badge */}
                {discountPercent > 0 && (
                  <div className={styles.discountBadge}>-{discountPercent}%</div>
                )}

                {/* Ảnh */}
                <div
                  className={styles.imageWrap}
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <img
                    src={item.mainImage}
                    alt={item.productName}
                    className={styles.image}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                </div>

                {/* Info */}
                <div className={styles.info}>
                  <div
                    className={styles.name}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    {item.productName}
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.salePrice}>
                      {(item.salePrice ?? item.price).toLocaleString("vi-VN")}₫
                    </span>
                    {item.salePrice && (
                      <span className={styles.originalPrice}>
                        {item.price.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>

                  <Tag
                    color={item.status === "PUBLISHED" ? "green" : "red"}
                    style={{ marginBottom: 12 }}
                  >
                    {item.status === "PUBLISHED" ? "Còn hàng" : "Hết hàng"}
                  </Tag>

                  {/* Actions */}
                  <div className={styles.actions}>
                    <Popconfirm
                      title="Xóa khỏi wishlist?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => handleRemove(item.productId)}
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        block
                        loading={removing}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}