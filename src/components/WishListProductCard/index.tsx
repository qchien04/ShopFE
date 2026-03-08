import { Button, Popconfirm, Tag } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./WishListProduct.module.scss"
import type { Wishlist } from "../../types"
import { useRemoveWishlist } from "../../hooks/Wishlist/useWishlist";
import { DeleteOutlined } from "@ant-design/icons";
import { antdMessage } from "../../utils/antdMessage";

interface Props{
  item:Wishlist,
}

const WishListProduct=({item}:Props)=>{
  const nav= useNavigate()
  const { mutate: remove, isPending: removing } = useRemoveWishlist();

  const handleRemove = (productId: number) => {
    remove(productId, {
      onSuccess: () => antdMessage.success("Đã xóa khỏi wishlist"),
    });
  };

  const discountPercent = item.salePrice
              ? Math.round(((item.price - item.salePrice) / item.price) * 100)
              : 0;
  return (
    <div className={styles.card}>
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className={styles.discountBadge}>-{discountPercent}%</div>
      )}

      {/* Ảnh */}
      <div
        className={styles.imageWrap}
        onClick={() => nav(`/products/${item.productId}`)}
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
          onClick={() => nav(`/products/${item.productId}`)}
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
}

export default WishListProduct;