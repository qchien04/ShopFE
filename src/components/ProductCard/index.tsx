import { Card, Tag, Button } from 'antd';
import {
  ShoppingCartOutlined,
} from '@ant-design/icons';

import styles from './productcard.module.scss';
import type { Product } from '../../types/product.type';

const { Meta } = Card;
interface Props {
  product: Product;
}
const ProductCard = ({ product }:Props) => {
  return (
    <Card
      hoverable
      className={styles.productCard}
      cover={
        <div className={styles.imageWrapper}>
          <img src={product.mainImage} alt={product.name} />

            <Tag color="red" className={styles.discountTag}>
              -{(product.price-product.salePrice)*100/product.price}%
            </Tag>
        </div>
      }
      actions={[
        <Button
          key="setting"
          type="text"
          shape="circle"
          icon={<ShoppingCartOutlined />}
        />
      ]}
    >
      <Meta
        title={
          <div className={styles.productName} title={product.name}>
            {product.name}
          </div>
        }
        description={
          <div className={styles.priceRow}>
            <span className={styles.priceNew}>
              {product.price.toLocaleString()}đ
            </span>

            {product.price && (
              <span className={styles.priceOld}>
                {product.salePrice.toLocaleString()}đ
              </span>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
