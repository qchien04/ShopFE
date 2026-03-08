import { FireOutlined } from '@ant-design/icons';
import './Hotdeals.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import type { Product } from '../../../../types/product.type';
import DealProduct from '../../../../components/DealProductCard';
import HotProduct from '../../../../components/HotProductCard';


const HotDeals = () => {
  const {data:hotProducts}=useProductList<Product[]>({type:"featured"})
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
            <HotProduct product={product}></HotProduct>
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
            <DealProduct product={product}></DealProduct>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HotDeals;