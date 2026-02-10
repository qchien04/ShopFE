import { Card } from 'antd';
import './CategoryNews.scss';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useNavigate } from 'react-router-dom';


interface News {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

const CategoryNews = () => {
  const {data:categories} = useCategoryList();
  const nav=useNavigate()
  const newsArticles: News[] = [
    {
      id: 1,
      title: 'Tết Nguyên Đán 2026 – Nét Đẹp Văn Hóa Truyền Thống Của Người Việt',
      excerpt: 'Có những khoảnh khắc thông thường, dù đi đâu hay làm gì, có những ngày tự ...',
      image: 'https://images.unsplash.com/photo-1482685945432-29a7abf2f466?w=300',
      date: '2026-01-15'
    },
    {
      id: 2,
      title: 'Xu hướng mua sắm Tết 2026: Thiết thực – ưu tiên hàng chất lượng không gian đóng',
      excerpt: 'Có những khoảnh khắc thông thường, dù đi đâu hay làm gì, có những ngày tự ...',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300',
      date: '2026-01-10'
    },
    {
      id: 3,
      title: '11 Tiêu Chuẩn Ổ Cắm Điện Việt Nam Chọn Đúng Để Dùng An Toàn',
      excerpt: 'Có những khoảnh khắc thông thường, dù đi đâu hay làm gì, có những ngày tự ...',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300',
      date: '2026-01-05'
    },
    {
      id: 4,
      title: 'Công Tắc 2 Cực Là Gì? Cấu Tạo, Nguyên Lý Hoạt Động Của Công Tắc 2 Cực',
      excerpt: 'Có những khoảnh khắc thông thường, dù đi đâu hay làm gì, có những ngày tự ...',
      image: 'https://images.unsplash.com/photo-1614963326505-842a3e0c6cff?w=300',
      date: '2025-12-28'
    }
  ];

  const popularNews = [
    {
      id: 5,
      title: 'Mua thiết bị điện tử Tết 2026: Những sai lầm nhiều...',
      image: 'https://images.unsplash.com/photo-1482685945432-29a7abf2f466?w=100'
    },
    {
      id: 6,
      title: 'Thiết bị điện nào cần kiểm tra trước Tết 2026?',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100'
    },
    {
      id: 7,
      title: 'Chất Tẩy Sơn Kim Loại, Nhựa, Tường Hiệu Quả Sau ...',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=100'
    },
    {
      id: 8,
      title: 'Nhôm Tản Nhiệt Là Gì?- Ưu Điểm Và Nhược Điểm Khi...',
      image: 'https://images.unsplash.com/photo-1614963326505-842a3e0c6cff?w=100'
    },
    {
      id: 9,
      title: 'Vi Sao Nhôm Lại Được Chọn Làm Vật Liệu Tản Nhiệt Số...',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100'
    },
    {
      id: 10,
      title: 'D718 transistor hàng KEC - tương đương ma NM hoặc 450 Cái',
      image: 'https://images.unsplash.com/photo-1614963326505-842a3e0c6cff?w=100'
    }
  ];

  return (
    <div className="category-news-section">
      {/* Danh mục nổi bật */}
      <section className="category-grid">
        <div className="section-header">
          <div className="section-icon">🏆</div>
          <h2 className="section-title">Danh mục nổi bật</h2>
          <a href="#" className="view-all-link">
            Xem tất cả →
          </a>
        </div>

        <div className="categories">
          {(categories||[]).slice(0,12).map((category) => (
            <div key={category.id} className="category-item" onClick={()=>nav(`/category/${category.id}`)}>
              <div className="category-icon">{category.icon}</div>
              <img src={category.image} alt={category.name} className="category-image" />
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Tin Tức */}
      <section className="news-section">
        <div className="section-header">
          <div className="section-icon">📰</div>
          <h2 className="section-title">Tin Tức</h2>
          <a href="#" className="view-all-link">
            Xem thêm Tin Tức ›
          </a>
        </div>

        <div className="news-container">
          {/* Main News Grid */}
          <div className="news-grid">
            {newsArticles.map((news) => (
              <Card
                key={news.id}
                className="news-card"
                cover={
                  <div className="news-image-wrapper">
                    <img src={news.image} alt={news.title} />
                  </div>
                }
                hoverable
              >
                <h3 className="news-title">{news.title}</h3>
                <p className="news-excerpt">{news.excerpt}</p>
              </Card>
            ))}
          </div>

          {/* Popular News Sidebar */}
          <div className="popular-news">
            <div className="popular-header">
              <span className="popular-icon">🔥</span>
              <h3>MẸO VẶT</h3>
            </div>
            <div className="popular-list">
              {popularNews.map((news) => (
                <div key={news.id} className="popular-item">
                  <img src={news.image} alt={news.title} />
                  <span className="popular-title">{news.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryNews;