import { Card, Tag, Button } from 'antd';
import { ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';
import './HotDeals.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useNavigate } from 'react-router-dom';


const HotDeals = () => {
  const {data:hotProducts}=useProductList({type:"featured"})
  const nav=useNavigate();
  return (
    <div className="hot-deals-section">
      {/* Sản Phẩm Nổi Bật */}
      <section className="hot-products">
        <div className="section-header">
          <div className="section-icon">
            <FireOutlined style={{ color: '#ff4444' }} />
          </div>
          <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="products-grid">
          {hotProducts?.map((product) => (
            <Card
              onClick={()=>nav(`/product/${product.id}`)}
              key={product.id}
              className="product-card"
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
          ))}
        </div>
      </section>

      {/* Deal Hot Trong Tuần */}
      <section className="deal-hot">
        <div className="section-header">
          <div className="section-icon">✅</div>
          <h2 className="section-title">Deal Hot Trong Tuần</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="deal-products-list">
          {hotProducts?.map((product) => (
            <div key={product.id} className="deal-product-card" onClick={()=>nav(`/product/${product.id}`)}>
              <div className="deal-image">
                <img src={product.mainImage} alt={product.name} />
                {product.price > 0 && (
                  <Tag className="deal-discount-tag" color="red">
                   -{Math.round(
                      ((product.price - product.salePrice) * 100) / product.price
                    )}%
                  </Tag>
                )}
              </div>
              <div className="deal-info">
                <h4 className="deal-name">{product.name}</h4>
                <div className="deal-pricing">
                  <span className="deal-price">
                    {product.salePrice.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="deal-original-price">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HotDeals;