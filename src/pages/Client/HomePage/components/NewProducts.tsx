import { Button } from 'antd';
import './NewProducts.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useState, useEffect } from 'react';
import type { Category } from '../../../../types/categories.type';
import NewProductCard from '../../../../components/NewProductCard/NewProductCard';
import type { Product } from '../../../../types/product.type';
import type { NewProductConfig } from '../../../../types/entity.type';
import { productApi } from '../../../../api/product.api';
import { useNavigate } from 'react-router-dom';


const NewProducts = ({ section }: { section?: NewProductConfig }) => {
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
      // Tìm cấu hình cho category hiện tại trong section config
      const catConfig = section?.categoryOfProduct?.find(c => 
        (selectedCategory === null && c.categoryId === null) || 
        (selectedCategory?.id === c.categoryId)
      );

      if (catConfig && catConfig.productIds?.length) {
        try {
          const resp = await productApi.getByIds(catConfig.productIds);
          setProducts(resp.content);
        } catch(e) {}
      } else {
        setProducts(defaultProducts || []);
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
        {section?.categoryOfProduct?.filter(c => c.categoryId != null).map((catConf) => {
          const cat = categories?.find(c => c.id === catConf.categoryId);
          if (!cat) return null;
          return (
            <button
              key={cat.id}
              className={`category-tab ${cat.id == selectedCategory?.id ? 'active' : ''}`}
              onClick={() => handleChangeCat(cat)}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="products-grid" style={section?.productPerRow ? { '--cols': section.productPerRow } as React.CSSProperties : undefined}>
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