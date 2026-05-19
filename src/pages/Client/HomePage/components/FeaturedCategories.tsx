import './FeaturedCategories.scss';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import type { FeaturedCategoryConfig } from '../../../../types/entity.type';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = ({ section }: { section?: FeaturedCategoryConfig }) => {
  const { data: allCategories } = useCategoryList();
  const nav = useNavigate();

  if (!section?.active || !section.categoryIds || section.categoryIds.length === 0) return null;

  // Filter categories specified in section config
  const displayCategories = allCategories?.filter(c => section.categoryIds.includes(c.id as number)) || [];

  if (displayCategories.length === 0) return null;

  const perRow = section.categoryPerRow || 10;

  return (
    <div className="featured-categories-section">
      <section className="category-grid">
        <div className="section-header">
          <div className="section-icon"></div>
          <h2 className="section-title">{section.title || "Danh mục nổi bật"}</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="categories" style={{ gridTemplateColumns: `repeat(${perRow}, 1fr)` }}>
          {displayCategories.map((category) => (
            <div key={category.id} className="category-item" onClick={() => nav(`/category/${category.id}`)}>
              <div className="category-image-wrapper">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="category-image" />
                ) : (
                  <div className="category-placeholder-icon">
                    {category.icon || "📦"}
                  </div>
                )}
              </div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FeaturedCategories;
