import { Button, Card, Tag } from "antd"
import type { Product } from "../../types/product.type"
import { useNavigate } from "react-router-dom"
import "./HotProduct.scss"
import { ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';

interface Props{
  product:Product,
}

const HotProduct=({product}:Props)=>{
  const nav= useNavigate()
  return <>
     <Card
        onClick={()=>nav(`/products/${product.id}`)}
        key={product.id}
        className="hot-product-card"
        cover={
          <div className="product-image-wrapper">
            {product.featured && (
              <div className="hot-badge">
                <FireOutlined /> HOT
              </div>
            )}
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
            {product.price > 0 && (
              <Tag className="discount-tag" color="red">
                -{Math.round(
                    ((product.price - product.salePrice) * 100) / product.price
                  )}%
              </Tag>
            )}
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
  </>
}

export default HotProduct;