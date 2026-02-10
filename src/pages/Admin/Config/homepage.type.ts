export type SectionType = 
  | 'banner'
  | 'featured_products'
  | 'new_products'
  | 'brand_showcase'
  | 'hot_deals'
  | 'category_news';

export interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
  order: number;
  active: boolean;
}

export interface FeaturedSection {
  id: number;
  title: string;
  icon: string;
  color: string;
  link: string;
  active: boolean;
  order: number;
}

export interface ProductSection {
  id: number;
  sectionType: 'new_products' | 'hot_deals' | 'featured_products';
  title: string;
  productIds: number[]; // IDs của sản phẩm được chọn
  categoryIds?: number[]; // Filter theo categories
  maxProducts: number; // Số lượng sản phẩm hiển thị
  active: boolean;
  order: number;
}

export interface BrandSection {
  id: number;
  title: string;
  brandIds: number[]; // IDs của brands được chọn
  maxBrands: number;
  active: boolean;
  order: number;
}

export interface CategorySection {
  id: number;
  title: string;
  categoryIds: number[]; // Categories nổi bật
  maxCategories: number;
  active: boolean;
  order: number;
}

export interface NewsSection {
  id: number;
  title: string;
  newsIds: number[]; // IDs của bài viết
  maxNews: number;
  active: boolean;
  order: number;
}

export interface HomepageSection {
  id: number;
  type: SectionType;
  title: string;
  active: boolean;
  order: number;
  config: any; // Specific config cho từng loại section
}

export interface HomepageConfig {
  id: number;
  name: string; // VD: "Trang chủ mặc định", "Trang chủ Tết 2026"
  isActive: boolean;
  sections: HomepageSection[];
  createdAt: string;
  updatedAt: string;
}






