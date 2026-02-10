import { Card, Tag, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './NewProductCard.scss';
import type { Product } from '../../types/product.type';
import { useNavigate } from 'react-router-dom';

interface Props{
  product:Product;
}
const NewProductCard = ({product}:Props) => {
  const nav=useNavigate();
  return (
    <Card
      onClick={()=>nav(`/product/${product.id}`)}
      key={product.id}
      className="product-card"
      cover={
        <div className="product-image-wrapper">
          {product.brand?.logo && (
            <div className="brand-logo">
              <img src={product.brand?.logo} alt="Brand" />
            </div>
          )}
          <img
            alt={product.name}
            src={product.mainImage}
            className="product-image"
          />
          <Tag className="discount-tag" color="red">
            -{Math.round(
              ((product.price - product.salePrice) * 100) / product.price
            )}%
          </Tag>
        </div>
      }
      hoverable
    >
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-pricing">
          <div className="price-row">
            <span className="current-price">
              {product.salePrice.toLocaleString('vi-VN')}₫
            </span>
            <span className="original-price">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </div>

        <div className="product-actions">
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />}
            className="add-to-cart-btn"
            block
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </Card>
       
  );
};

export default NewProductCard;