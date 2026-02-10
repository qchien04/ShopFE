import React, { useState } from 'react';
import { 
  Breadcrumb, 
  Rate, 
  InputNumber, 
  Button, 
  Image, 
  Tabs,
  Tag
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  PlusOutlined,
  MinusOutlined,
  ShoppingCartOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  ShareAltOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  DollarOutlined
} from '@ant-design/icons';
import './ProductDetailPage.scss';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../../hooks/Product/useProduct';
import { useAddToCart } from '../../../hooks/Cart/useAddToCart';

// interface Props{
//   product:Product;
// }
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {data:product, isLoading} =useProductDetail(Number(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('3 Lỗ Chéo');
  const [isFavorite, setIsFavorite] = useState(false);

  const {mutate:AddToCart}=useAddToCart();


  const handleAddToCart=()=>{
    AddToCart({
      productId:Number(id),
      quantity:quantity,
    })
    setQuantity(0);
  }
  // Mock data nếu không có product
  const defaultProduct = {
    id: 1,
    name: 'Ổ Cắm Điện Siêu Tải Lỗ Cắm Chéo Chịu Tải Cao 6000W Chống Va Đập Chịu Nhiệt Cao (Không Kèm Dây)',
    sku: '3S-6000W-C',
    slug: 'o-cam-dien-sieu-tai',
    price: 90200,
    salePrice: 41000,
    stockQuantity: 150,
    mainImage: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600',
    status: 'PUBLISHED',
    brandName: 'SOPOKA',
    viewCount: 1234,
    soldCount: 567,
    shortDescription: 'Ổ cắm điện siêu tải 6000W với 6 lỗ cắm giữ chặt phích, thiết kế chống cháy nổ an toàn',
    fullDescription: `
      <h3>Ổ CẮM CHÉO CHỊU TẢI 6000W CÂN MỌI LOẠI THIẾT BỊ</h3>
      <p>Ổ cắm siêu tải 6000W có thiết kế tinh tế, phù hợp với nhiều không gian khác nhau như: nhà riêng, văn phòng, công ty, khách sạn... phục vụ cho mục đích sử dụng thiết bị điện như tivi, máy giặt, tủ lạnh, điều hòa nhiệt độ, bàn là và các thiết bị điện khác.</p>
      <ul>
        <li>Phụ trợ tối đa các loại dây cáp có tiết diện lên đến điện áp 220V</li>
        <li>Nhìu bộ phận bảo vệ toàn diện an toàn khi sử dụng</li>
      </ul>
    `,
    images: [
      { id: 1, imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600', isPrimary: true },
      { id: 2, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', isPrimary: false },
      { id: 3, imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600', isPrimary: false },
      { id: 4, imageUrl: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600', isPrimary: false },
      { id: 5, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', isPrimary: false }
    ],
    specifications: [
      { specName: 'Công suất tối đa', specValue: '6000W' },
      { specName: 'Điện áp', specValue: '220V' },
      { specName: 'Dòng điện', specValue: '30A' },
      { specName: 'Kiểu', specValue: 'Ổ cắm điện xoay dây - lỗ cắm chéo' }
    ],
    category: {
      id: 1,
      name: 'ĐIỆN GIA DỤNG'
    }
  };

  const currentProduct = product || defaultProduct;

  const variants = [
    { name: '3 Lỗ Chéo', available: true },
    { name: '4 Lỗ Chéo', available: true },
    { name: '6 Lỗ Chéo', available: true }
  ];

  const features = [
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Ưu Đãi Khi Mua Sỉ',
      description: 'Lượng - Liên Hệ Hotline'
    },
    {
      icon: <TruckOutlined />,
      title: 'Hình Ảnh Sản Phẩm Thật',
      description: ''
    },
    {
      icon: <DollarOutlined />,
      title: 'Đơn Trên 500K Được',
      description: 'Miễn Phí Vận Chuyển'
    }
  ];

  const handleQuantityChange = (value:any) => {
    if (value >= 1 && value <= currentProduct.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { product: currentProduct, quantity, variant: selectedVariant });
  };

  const discountPercent = Math.round(((currentProduct.price - currentProduct.salePrice) / currentProduct.price) * 100);

  const tabItems = [
    {
      key: '1',
      label: 'Thông tin sản phẩm',
      children: (
        <div className="product-info-content">
          <div dangerouslySetInnerHTML={{ __html: currentProduct.fullDescription.replace(/\n/g, "<br />-") }} />
          
          {currentProduct.specifications && currentProduct.specifications.length > 0 && (
            <div className="specifications">
              <h3>Thông số kỹ thuật</h3>
              <table>
                <tbody>
                  {currentProduct.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td className="spec-name">{spec.specName}</td>
                      <td className="spec-value">{spec.specValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="product-detail">
      <div className="product-container">
        {/* Breadcrumb */}
        <Breadcrumb className="product-breadcrumb">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          {currentProduct.category && (
            <Breadcrumb.Item href={`/category/${currentProduct.category.id}`}>
              {currentProduct.category.name}
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{currentProduct.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Main Content */}
        <div className="product-main">
          {/* Left: Images */}
          <div className="product-images">
            <div className="main-image">
              <Image
                src={currentProduct.images?.[selectedImage]?.imageUrl || currentProduct.mainImage}
                alt={currentProduct.name}
                preview={{
                  mask: 'Xem ảnh'
                }}
              />
              <button 
                className="favorite-btn"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <HeartFilled /> : <HeartOutlined />}
              </button>
            </div>

            <div className="thumbnail-list">
              {currentProduct.images && currentProduct.images.map((img, index) => (
                <div
                  key={img.id}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img.imageUrl} alt={`${currentProduct.name} ${index + 1}`} />
                </div>
              ))}
            </div>

            {/* Share buttons */}
            <div className="share-buttons">
              <span className="share-label">Chia sẻ</span>
              <button className="share-btn facebook">
                <FacebookFilled />
              </button>
              <button className="share-btn twitter">
                <TwitterCircleFilled />
              </button>
              <button className="share-btn other">
                <ShareAltOutlined />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info">
            <h1 className="product-title">{currentProduct.name}</h1>

            {/* Rating */}
            <div className="product-rating">
              <Rate disabled defaultValue={0} />
              <span className="rating-text">Viết đánh giá của bạn</span>
            </div>

            {/* Meta Info */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Mã sản phẩm:</span>
                <span className="meta-value">{currentProduct.sku}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Thương hiệu:</span>
                <span className="meta-value brand">{currentProduct.brandName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tình trạng:</span>
                <span className="meta-value stock">Còn hàng</span>
              </div>
            </div>

            {/* Price */}
            <div className="product-price">
              <span className="current-price">{currentProduct.salePrice.toLocaleString('vi-VN')}₫</span>
              {currentProduct.price > currentProduct.salePrice && (
                <>
                  <span className="original-price">{currentProduct.price.toLocaleString('vi-VN')}₫</span>
                  <span className="discount-badge">-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* Variants */}
            <div className="product-variants">
              <div className="variant-label">Kích thước:</div>
              <div className="variant-options">
                {variants.map((variant) => (
                  <button
                    key={variant.name}
                    className={`variant-btn ${selectedVariant === variant.name ? 'active' : ''} ${!variant.available ? 'disabled' : ''}`}
                    onClick={() => variant.available && setSelectedVariant(variant.name)}
                    disabled={!variant.available}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product-quantity">
              <span className="quantity-label">Số lượng:</span>
              <div className="quantity-control">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <MinusOutlined />
                </button>
                <InputNumber
                  min={1}
                  max={currentProduct.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  controls={false}
                />
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= currentProduct.stockQuantity}
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingCartOutlined />}
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button 
                size="large"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
            </div>

            {/* Stock Info */}
            <div className="stock-info">
              <div className="stock-item">
                <span className="icon">👁️</span>
                <span>Có {currentProduct.viewCount || 0} lượt xem sản phẩm</span>
              </div>
              <div className="stock-item">
                <span className="icon">👍</span>
                <span>Có {currentProduct.soldCount || 0} lượt xem sản phẩm</span>
              </div>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="features-title">Quyền lợi & chính sách:</div>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-content">
                      <div className="feature-title">{feature.title}</div>
                      {feature.description && (
                        <div className="feature-desc">{feature.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;