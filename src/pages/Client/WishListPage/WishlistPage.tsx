// pages/Customer/WishlistPage.tsx
import { Empty, Spin, Button } from "antd";

import { useNavigate } from "react-router-dom";
import styles from "./WishlistPage.module.scss";
import { useWishlist } from "../../../hooks/Wishlist/useWishlist";
import WishListProduct from "../../../components/WishListProductCard";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { data: items, isLoading } = useWishlist();


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
          {items.map((item: any) => (
            <WishListProduct key={item.id} item={item}></WishListProduct>
          ))}
        </div>
      )}
    </div>
  );
}