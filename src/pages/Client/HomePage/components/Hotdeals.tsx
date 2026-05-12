import { FireOutlined } from '@ant-design/icons';
import './Hotdeals.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useState, useEffect } from 'react';
import type { Product } from '../../../../types/product.type';
import type { ProductSectionConfig } from '../../../../types/entity.type';
import { productApi } from '../../../../api/product.api';
import DealProduct from '../../../../components/DealProductCard';
import HotProduct from '../../../../components/HotProductCard';


const HotDeals = ({ section }: { section?: ProductSectionConfig }) => {
  const { data: defaultProducts } = useProductList<Product[]>({ type: "featured" });
  const [hotProducts, setHotProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCustom = async () => {
      if (section && section.productIds && section.productIds.length > 0) {
        try {
          const resp = await productApi.getByIds(section.productIds);
          setHotProducts(resp.content.slice(0, section.productCount || 12));
        } catch(e) {}
      } else {
        const list = defaultProducts || [];
        setHotProducts(list.slice(0, section?.productCount || 12));
      }
    };
    fetchCustom();
  }, [section, defaultProducts]);

  const topHot = hotProducts.slice(0, 6);
  const sideDeals = hotProducts.slice(6, 12);

  return (
    <div className="hot-deals-section">
      {/* Sản Phẩm Nổi Bật */}
      <section className="hot-products">
        <div className="section-header">
          <div className="section-icon">
            <FireOutlined style={{ color: '#ff4444' }} />
          </div>
          <h2 className="section-title">{section?.title || "Sản Phẩm Đang Hot"}</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="products-grid">
          {topHot?.map((product) => (
            <HotProduct key={product.id} product={product}></HotProduct>
          ))}
        </div>
      </section>

      {/* Deal Hot Trong Tuần */}
      <section className="deal-hot">
        <div className="section-header">
          <div className="section-icon"></div>
          <h2 className="section-title">Deal Hot Trong Tuần</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="deal-products-list">
          {sideDeals?.map((product) => (
            <DealProduct key={product.id} product={product}></DealProduct>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HotDeals;