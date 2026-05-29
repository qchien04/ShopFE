import { Card, Button, Tag } from 'antd';
import {
  ShoppingCartOutlined,
} from '@ant-design/icons';

import styles from './fproductcard.module.scss';
import type { Product } from '../../types/product.type';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddToCartModal from '../AddToCartModal';

interface Props {
  product: Product;
}
const FeaturedProductCard = ({ product }: Props) => {
  const nav = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Card key={product.id} hoverable className={styles['product-card']} onClick={() => nav(`/products/${product.id}`)}>
      <div className={styles['image-wrapper']}>
        <img src={product.mainImage} alt={product.name} />

        <Tag color="red" className={styles['discount-tag']}>
          -{Math.round(
            ((product.price - product.salePrice) * 100) / product.price
          )}%
        </Tag>
      </div>

      <div className={styles['card-body']}>
        <div className={styles['product-name']} title={product.name}>
          {product.name}
        </div>

        <div className={styles['price-row']}>
          <span className={styles['price-new']}>
            {product.salePrice.toLocaleString()}đ
          </span>
          <span className={styles['price-old']}>
            {product.price.toLocaleString()}đ
          </span>
        </div>

        {product.stockQuantity <= 0 && (
          <div className={styles['sold-out']}>Hết hàng</div>
        )}
      </div>

      <Button
        type="primary"
        shape="circle"
        className={styles['cart-btn']}
        icon={<ShoppingCartOutlined />}
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      />
      <AddToCartModal
        product={product}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
};

export default FeaturedProductCard;
