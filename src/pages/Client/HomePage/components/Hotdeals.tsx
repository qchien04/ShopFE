import { FireOutlined } from '@ant-design/icons';
import './Hotdeals.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useState, useEffect } from 'react';
import type { Product } from '../../../../types/product.type';
import type { HotDealsSectionConfig } from '../../../../types/entity.type';
import { productApi } from '../../../../api/product.api';
import DealProduct from '../../../../components/DealProductCard';
import HotProduct from '../../../../components/HotProductCard';


const HotDeals = ({ section }: { section?: HotDealsSectionConfig }) => {
  const { data: defaultProducts } = useProductList<Product[]>({ type: "all" });
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [weeklyProducts, setWeeklyProducts] = useState<Product[]>([]);

  const productPerRow = section?.productPerRow || 3;

  useEffect(() => {
    const fetchHot = async () => {
      if (section && section.productIds && section.productIds.length > 0) {
        try {
          const resp = await productApi.getByIds(section.productIds);
          setHotProducts(resp.content);
        } catch (e) { }
      } else {
        const list = defaultProducts || [];
        setHotProducts(list.slice(0, 6));
      }
    };
    const fetchWeekly = async () => {
      if (section && section.weeklyProductIds && section.weeklyProductIds.length > 0) {
        try {
          const resp = await productApi.getByIds(section.weeklyProductIds);
          setWeeklyProducts(resp.content);
        } catch (e) { }
      } else {
        const list = defaultProducts || [];
        setWeeklyProducts(list.slice(6, 12));
      }
    };
    fetchHot();
    fetchWeekly();
  }, [section, defaultProducts]);

  const topHot = hotProducts;
  const sideDeals = weeklyProducts;

  return (
    <div className="hot-deals-section">
      {/* Sản Phẩm Nổi Bật */}
      {(section?.active ?? true) && (
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

          <div className="products-grid" style={{ '--cols': productPerRow } as React.CSSProperties}>
            {topHot?.map((product) => (
              <HotProduct key={product.id} product={product}></HotProduct>
            ))}
          </div>
        </section>
      )}

      {/* Deal Hot Trong Tuần */}
      <section className="deal-hot">
        <div className="section-header">
          <div className="section-icon"></div>
          <h2 className="section-title">{section?.weeklyTitle || "Deal Hot Trong Tuần"}</h2>
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