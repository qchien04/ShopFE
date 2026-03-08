import { useState } from 'react';
import {
  Breadcrumb,
  Rate,
  InputNumber,
  Button,
  Image,
  Tabs,
  Tag,
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
import ReviewSection from './ReviewSection';
import { useReviews } from '../../../hooks/Review';
import type { ProductImage, ProductVariant } from '../../../types/product.type';
import { useAddWishlist, useRemoveWishlist, useWishlistCheck } from '../../../hooks/Wishlist/useWishlist';
import { useEffect } from 'react';
import { message } from 'antd';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useProductDetail(Number(id));
  const { data: reviewSummary } = useReviews(Number(id));
  const { mutate: AddToCart } = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: wishlistCheck } = useWishlistCheck(Number(id))
  const { mutate: addWishlist, isPending: adding } = useAddWishlist();
  const { mutate: removeWishlist, isPending: removing } = useRemoveWishlist();

  useEffect(() => {
    if (wishlistCheck?.isInWishlist !== undefined) {
      setIsFavorite(wishlistCheck.isInWishlist);
    }
  }, [wishlistCheck]);

  const handleToggleWishlist = () => {
    if (isFavorite) {
      removeWishlist(Number(id), {
        onSuccess: () => {
          setIsFavorite(false);
          message.success("Đã xóa khỏi yêu thích");
        },
        onError: () => message.error("Có lỗi xảy ra"),
      });
    } else {
      addWishlist(Number(id), {
        onSuccess: () => {
          setIsFavorite(true);
          message.success("Đã thêm vào yêu thích ❤️");
        },
        onError: () => message.error("Có lỗi xảy ra"),
      });
    }
  };
  
  const currentProduct = product;
  if (!currentProduct) return <div>Đang tải...</div>;
  
  const variants = currentProduct.productVariants ?? [];
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId) ?? variants[0] ?? null;

  // ✅ Giá/tồn kho ưu tiên từ variant, fallback về sản phẩm
  const displayPrice = selectedVariant?.price ?? currentProduct.price;
  const displaySalePrice = selectedVariant?.salePrice ?? currentProduct.salePrice;
  const displayStock = selectedVariant?.stockQuantity ?? currentProduct.stockQuantity;
 

  const discountPercent = displaySalePrice
    ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100)
    : 0;

  const handleQuantityChange = (value: any) => {
    if (value >= 1 && value <= displayStock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    AddToCart({
      productVariantId: selectedVariant.id, // ✅ gửi đúng variantId
      quantity,
    });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { product: currentProduct, quantity, variant: selectedVariant });
  };

  const features = [
    { icon: <SafetyCertificateOutlined />, title: 'Ưu Đãi Khi Mua Sỉ', description: 'Lượng - Liên Hệ Hotline' },
    { icon: <TruckOutlined />, title: 'Hình Ảnh Sản Phẩm Thật', description: '' },
    { icon: <DollarOutlined />, title: 'Đơn Trên 500K Được', description: 'Miễn Phí Vận Chuyển' },
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Thông tin sản phẩm',
      children: (
        <div className="product-info-content">
          <div dangerouslySetInnerHTML={{ __html: currentProduct.fullDescription?.replace(/\n/g, "<br />") ?? '' }} />

          {/* ✅ Hiển thị attributes của variant đang chọn */}
          {selectedVariant?.attributes && Object.keys(selectedVariant.attributes).length > 0 && (
            <div className="specifications" style={{ marginTop: 16 }}>
              <h3>Thông số variant</h3>
              <table>
                <tbody>
                  {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-name">{key}</td>
                      <td className="spec-value">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: `Đánh giá (${reviewSummary?.totalReviews ?? 0})`,
      children: <ReviewSection productId={Number(id)} />,
    },
  ];

  const allImages = [
    ...(currentProduct.images ?? []).map((img: ProductImage) => ({
      id: `product-${img.id}`,
      imageUrl: img.imageUrl,
      variantId: null,
    })),
    ...(variants
      .filter((v: ProductVariant) => v.mainImage)
      .map((v: ProductVariant) => ({
        id: `variant-${v.id}`,
        imageUrl: v.mainImage!,
        variantId: v.id,
      }))
    ),
  ];

  const displayImage =
  allImages.find((img) =>
    selectedVariantId
      ? img.variantId === selectedVariantId
      : img.variantId === null && allImages.indexOf(img) === selectedImage
  )?.imageUrl ?? currentProduct.mainImage;
  

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

        <div className="product-main">
          {/* Left: Images */}
          <div className="product-images">
            <div className="main-image">
              <Image
                src={displayImage}
                alt={currentProduct.name}
                preview={{ mask: 'Xem ảnh' }}
              />
              <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                disabled={adding || removing}
              >
                {isFavorite
                  ? <HeartFilled style={{ color: "#ef4444" }} />
                  : <HeartOutlined />
                }
              </button>
            </div>

            <div className="thumbnail-list">
              {allImages.map((img, index) => {
                const isActive = selectedVariantId
                  ? img.variantId === selectedVariantId
                  : img.variantId === null && index === selectedImage;

                return (
                  <div
                    key={img.id}
                    className={`thumbnail ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (img.variantId) {
                        // Click ảnh variant → chọn variant đó
                        setSelectedVariantId(img.variantId);
                        setQuantity(1);
                      } else {
                        // Click ảnh product → bỏ chọn variant
                        setSelectedImage(index);
                        setSelectedVariantId(null);
                      }
                    }}
                  >
                    <img src={img.imageUrl} alt={`${currentProduct.name} ${index + 1}`} />
                    {/* Badge nhỏ phân biệt ảnh variant
                    {img.variantId && (
                      <span style={{
                        position: 'absolute', bottom: 2, right: 2,
                        background: '#1677ff', color: '#fff',
                        fontSize: 9, padding: '1px 4px', borderRadius: 4,
                      }}>
                        {variants.find((v: ProductVariant) => v.id === img.variantId)?.name}
                      </span>
                    )} */}
                  </div>
                );
              })}
            </div>

            <div className="share-buttons">
              <span className="share-label">Chia sẻ</span>
              <button className="share-btn facebook"><FacebookFilled /></button>
              <button className="share-btn twitter"><TwitterCircleFilled /></button>
              <button className="share-btn other"><ShareAltOutlined /></button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-info">
            <h1 className="product-title">{currentProduct.name}</h1>

            <div className="product-rating">
              <Rate disabled allowHalf value={reviewSummary?.averageRating ?? 0} />
              <span className="rating-text">
                {reviewSummary?.averageRating ? `${reviewSummary.averageRating}/5` : 'Chưa có đánh giá'}
              </span>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Mã sản phẩm:</span>
                {/* ✅ Hiển thị SKU của variant nếu có */}
                <span className="meta-value">{selectedVariant?.sku ?? currentProduct.sku}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Thương hiệu:</span>
                <span className="meta-value brand">{currentProduct.brand?.name ?? currentProduct.brandName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tình trạng:</span>
                <span className="meta-value stock">
                  {displayStock > 0 ? (
                    <Tag color="green">Còn hàng ({displayStock})</Tag>
                  ) : (
                    <Tag color="red">Hết hàng</Tag>
                  )}
                </span>
              </div>
            </div>

            {/* Price — cập nhật theo variant */}
            <div className="product-price">
              <span className="current-price">
                {(displaySalePrice ?? displayPrice).toLocaleString('vi-VN')}₫
              </span>
              {displaySalePrice && displayPrice > displaySalePrice && (
                <>
                  <span className="original-price">{displayPrice.toLocaleString('vi-VN')}₫</span>
                  <span className="discount-badge">-{discountPercent}%</span>
                </>
              )}
            </div>

            {/* ✅ Variants từ API thay vì hardcode */}
            {variants.length > 0 && (
              <div className="product-variants">
                <div className="variant-label">Phiên bản:</div>
                <div className="variant-options">
                  {variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      className={`variant-btn ${(selectedVariant?.id ?? variants[0]?.id) === variant.id ? 'active' : ''} ${variant.stockQuantity === 0 ? 'disabled' : ''}`}
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setQuantity(1); // reset quantity khi đổi variant
                      }}
                      disabled={variant.stockQuantity === 0}
                    >
                      {variant.name}
                      {variant.stockQuantity === 0 && <span style={{ fontSize: 10, display: 'block' }}>Hết</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  max={displayStock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  controls={false}
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= displayStock}
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="product-actions">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={displayStock === 0 || !selectedVariant}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="large"
                className="buy-now-btn"
                onClick={handleBuyNow}
                disabled={displayStock === 0}
              >
                Mua ngay
              </Button>
            </div>

            <div className="stock-info">
              <div className="stock-item">
                <span className="icon">👁️</span>
                <span>Có {currentProduct.viewCount ?? 0} lượt xem</span>
              </div>
              <div className="stock-item">
                <span className="icon">🛒</span>
                <span>Đã bán {currentProduct.soldCount ?? 0}</span>
              </div>
            </div>

            <div className="product-features">
              <div className="features-title">Quyền lợi & chính sách:</div>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-content">
                      <div className="feature-title">{feature.title}</div>
                      {feature.description && <div className="feature-desc">{feature.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;