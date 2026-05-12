import { Button } from 'antd';
import './NewProducts.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useState, useEffect } from 'react';
import type { Category } from '../../../../types/categories.type';
import NewProductCard from '../../../../components/NewProductCard/NewProductCard';
import type { Product } from '../../../../types/product.type';
import type { ProductSectionConfig } from '../../../../types/entity.type';
import { productApi } from '../../../../api/product.api';
import { useNavigate } from 'react-router-dom';


const NewProducts = ({ section }: { section?: ProductSectionConfig }) => {
  const { data: categories } = useCategoryList();
  const nav = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const { data: defaultProducts } = useProductList<Product[]>({
    type: 'new',
    mainCategoryId: selectedCategory?.id
  });

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCustom = async () => {
      // If we are filtering by category in the UI tab, we ALWAYS fetch from default defaultProducts
      // because specific productIds might not match the tab. 
      // To strictly follow admin's pinned products, if selectedCategory is ALL (null), we show pinned if available.
      if (selectedCategory == null && section && section.productIds && section.productIds.length > 0) {
        try {
          const resp = await productApi.getByIds(section.productIds);
          setProducts(resp.content.slice(0, section.productCount || 10));
        } catch(e) {}
      } else {
        const list = defaultProducts || [];
        setProducts(list.slice(0, section?.productCount || list.length));
      }
    };
    fetchCustom();
  }, [section, defaultProducts, selectedCategory]);

  const handleChangeCat = (cat: Category | null) => {
    setSelectedCategory(cat)
  }
  return (
    <section className="new-products">
      <div className="section-header">
        <div className="section-icon"></div>
        <h2 className="section-title">{section?.title || "Sản Phẩm Mới"}</h2>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          key={0}
          className={`category-tab ${selectedCategory == null ? 'active' : ''}`}
          onClick={() => handleChangeCat(null)}
        >
          {"Tất cả"}
        </button>
        {categories?.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${cat.id == selectedCategory?.id ? 'active' : ''}`}
            onClick={() => handleChangeCat(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products?.map((product) => (
          <NewProductCard key={product.id} product={product}></NewProductCard>
        ))}
      </div>

      {/* View More Button */}
      <div className="view-more">
        {selectedCategory != null &&
          <Button size="large" className="view-more-btn" onClick={() => nav(`category/${selectedCategory?.id}`)}>
            Xem thêm
          </Button>}
      </div>
    </section>
  );
};

export default NewProducts;