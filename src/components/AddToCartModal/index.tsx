import React, { useState, useEffect } from 'react';
import { Modal, Button, InputNumber, Tag, message } from 'antd';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { Product } from '../../types/product.type';
import './AddToCartModal.scss';
import { useAddToCart } from '../../hooks/Cart/useAddToCart';

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

const AddToCartModal: React.FC<Props> = ({ product, open, onClose }) => {
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const variants = product?.productVariants ?? [];
  const hasVariants = variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      if (hasVariants) {
        const firstAvailable = variants.find(v => v.stockQuantity > 0);
        setSelectedVariantId(firstAvailable ? firstAvailable.id : variants[0]?.id);
      } else {
        setSelectedVariantId(null);
      }
      setQuantity(1);
    }
  }, [open, product]);

  if (!product) return null;

  const selectedVariant = variants.find(v => v.id === selectedVariantId);
  const displayStock = hasVariants ? (selectedVariant?.stockQuantity ?? 0) : product.stockQuantity;
  const displayPrice = hasVariants ? (selectedVariant?.price ?? product.price) : product.price;
  const displaySalePrice = hasVariants ? (selectedVariant?.salePrice ?? product.salePrice) : product.salePrice;
  const displayImage = selectedVariant?.mainImage || product.mainImage;

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0 && value <= displayStock) {
      setQuantity(value);
    }
  };

  // Ensure addToCart payload matches backend expectation.
  const payloadVariantId = hasVariants ? selectedVariantId! : (variants[0]?.id || product.id);

  const handleAdd = () => {
    if (displayStock <= 0) {
      message.error("Sản phẩm đã hết hàng!");
      return;
    }
    if (hasVariants && !selectedVariantId) {
      message.error("Vui lòng chọn phiên bản sản phẩm!");
      return;
    }

    addToCart(
      { productVariantId: payloadVariantId, quantity },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={500}
        className="add-to-cart-modal"
      >
        <div className="modal-content">
        <div className="product-header">
          <img src={displayImage} alt={product.name} className="product-img" />
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price">
              <span className="current-price">{(displaySalePrice || displayPrice).toLocaleString('vi-VN')}₫</span>
              {displaySalePrice && displayPrice > displaySalePrice && (
                <span className="original-price">{displayPrice.toLocaleString('vi-VN')}₫</span>
              )}
            </div>
            <div className="product-stock">
              Kho: {displayStock} {displayStock === 0 ? <Tag color="red">Hết hàng</Tag> : ''}
            </div>
          </div>
        </div>

        {hasVariants && (
          <div className="variants-section">
            <div className="section-title">Phiên bản:</div>
            <div className="variant-options">
              {variants.map(v => (
                <button
                  key={v.id}
                  className={`variant-btn ${selectedVariantId === v.id ? 'active' : ''} ${v.stockQuantity === 0 ? 'disabled' : ''}`}
                  onClick={() => {
                    if (v.stockQuantity > 0) {
                      setSelectedVariantId(v.id);
                      setQuantity(1);
                    }
                  }}
                  disabled={v.stockQuantity === 0}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quantity-section">
          <div className="section-title">Số lượng:</div>
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
              className="quantity-input"
            />
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= displayStock || displayStock === 0}
            >
              <PlusOutlined />
            </button>
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          block
          icon={<ShoppingCartOutlined />}
          onClick={handleAdd}
          loading={isAdding}
          disabled={displayStock === 0 || (hasVariants && !selectedVariantId)}
          className="submit-btn"
        >
          Thêm vào giỏ hàng
        </Button>
      </div>
      </Modal>
    </div>
  );
};

export default AddToCartModal;
