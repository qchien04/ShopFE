import { Card, Tag, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './NewProducts.scss';
import { useProductList } from '../../../../hooks/Product/useProductList';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useState } from 'react';
import type { Category } from '../../../../types/categories.type';
import NewProductCard from '../../../../components/NewProductCard/NewProductCard';


const NewProducts = () => {
  const {data:categories}=useCategoryList();
  const [selectedCategory,setSelectedCategory]= useState<Category|null>(null);
  const { data: products } = useProductList({
    type: 'new',
    params: {
      categoryId: selectedCategory?.id
    }
  });

  const handleChangeCat=(cat:Category|null)=>{
    console.log(cat)
    setSelectedCategory(cat)
  }
  return (
    <section className="new-products">
      <div className="section-header">
        <div className="section-icon">🔥</div>
        <h2 className="section-title">Sản Phẩm Mới</h2>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
            key={0}
            className={`category-tab ${selectedCategory==null ? 'active' : ''}`}
            onClick={()=>handleChangeCat(null)}
          >
            {"Tất cả"}
          </button>
        {categories?.slice(0,6).map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${cat.id==selectedCategory?.id ? 'active' : ''}`}
            onClick={()=>handleChangeCat(cat)}
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
        <Button size="large" className="view-more-btn">
          Xem thêm
        </Button>
      </div>
    </section>
  );
};

export default NewProducts;