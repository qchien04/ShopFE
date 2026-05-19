import { Button } from 'antd';
import './NewProducts.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useState, useEffect } from 'react';
import type { Category } from '../../../../types/categories.type';
import NewProductCard from '../../../../components/NewProductCard/NewProductCard';
import type { Product } from '../../../../types/product.type';
import type { CategoryConfig } from '../../../../types/entity.type';
import { useNavigate } from 'react-router-dom';

const CustomCategory = ({ section }: { section?: CategoryConfig }) => {
  const { data: allCategories } = useCategoryList();
  const nav = useNavigate();

  // Filter categories specified in section config
  const displayCategories = allCategories?.filter(c => section?.categoryIds?.includes(c.id as number)) || [];
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (displayCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(displayCategories[0]);
    }
  }, [displayCategories]);

  const { data: defaultProducts } = useProductList<Product[]>({
    type: 'new', // Assuming we fetch newest for the selected category
    mainCategoryId: selectedCategory?.id
  });

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (defaultProducts) {
      setProducts(defaultProducts);
    }
  }, [defaultProducts, selectedCategory]);

  const handleChangeCat = (cat: Category | null) => {
    setSelectedCategory(cat);
  };

  if (!section?.active || displayCategories.length === 0) return null;

  return (
    <section className="new-products custom-category-section">
      <div className="section-header">
        <div className="section-icon"></div>
        <h2 className="section-title">{section.title}</h2>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${cat.id === selectedCategory?.id ? 'active' : ''}`}
            onClick={() => handleChangeCat(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid" style={section.productPerRow ? { gridTemplateColumns: `repeat(${section.productPerRow}, 1fr)` } : undefined}>
        {products?.map((product) => (
          <NewProductCard key={product.id} product={product}></NewProductCard>
        ))}
      </div>

      {/* View More Button */}
      <div className="view-more">
        {selectedCategory != null &&
          <Button size="large" className="view-more-btn" onClick={() => nav(`category/${selectedCategory?.id}`)}>
            Xem thêm {selectedCategory.name}
          </Button>}
      </div>
    </section>
  );
};

export default CustomCategory;
