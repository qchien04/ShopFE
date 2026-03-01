import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import './post.scss';

interface Post {
  id: number;
  title: string;
  description?: string;
  thumbnail: string;
  createdAt: string;
  author?: string;
}

const PostsPage = () => {
  // Featured post (bài đầu lớn)
  const featuredPost: Post = {
    id: 1,
    title: 'Tết Năm Nay Rất Khác Lạ! Khi Tết Không Còn Chỉ Là Niềm Vui Mà Là Bài Toán Cuộc Sống',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
    createdAt: '17/02/2026',
    author: 'Quang Minh'
  };

  // List posts (4 bài nhỏ horizontal)
  const listPosts: Post[] = [
    {
      id: 2,
      title: 'Phích Cắm Điện Là Gì? Phân Loại, Ứng Dụng Và Cách Chọn Phích Cắm Điện An Toàn',
      description: 'Trong hệ thống điện dân dụng và công nghiệp, phích cắm điện là một chi tiết nhỏ nhưng lại giữ vai trò cực kỳ quan trọ...',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300',
      createdAt: '16/01/2026'
    },
    {
      id: 3,
      title: 'Ổ Cắm Điện Là Gì? Cấu Tạo, Phân Loại Và Cách Chọn Ổ Cắm Điện',
      description: 'Ổ cắm điện là một thiết bị thường những rất quan trọng, xuất hiện ở hầu hết mọi không gian sống từ nhà ở, văn phòng, c...',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      createdAt: '16/01/2026'
    },
    {
      id: 4,
      title: 'Ốc Vít Nhôm M4 Là Gì? Các Kích Thước Ốc Vít M4 Phổ Biến',
      description: 'Trong thị công điện tử, cơ khí hay, lắp ráp DIY hay sửa chữa thiết bị, ốc vít nhôm M4 là chi tiết nhỏ nhưng quyết đi...',
      thumbnail: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300',
      createdAt: '09/01/2026'
    },
    {
      id: 5,
      title: 'Sài Gòn Sáng 09/01/2026 Sẽ Lạnh 16°C Hiếm Hoi',
      description: 'Sáng ngày 09/01/2026, TP. Hồ Chí Minh sẽ gặp nhiệt độ mát khoảng 16°C là một con số đủ khiến nhiều người phải...',
      thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300',
      createdAt: '09/01/2026'
    }
  ];

  // Sidebar: TIN NỔI BẬT
  const hotNews = [
    'Tết Năm Nay Rất Khác Lạ! Khi Tết Không Còn Chỉ Là Niềm Vui Mà Là Bài Toán Cuộc Sống',
    'Tết Nguyên Đán 2026 – Nét Đẹp Văn Hoá Truyền Thống Của Người Việt',
    'Danh sách nâng cấp điện trong nhà giúp đón Tết 2026 an toàn và tiện nghi.',
    'Xu hướng mua sắm Tết 2026: Thiết thực – ưu tiên nâng cấp không gian sống.',
    '11 Tiêu Chuẩn Ổ Cắm Điện Việt Nam Chọn Đúng Để Dùng An Toàn',
    'Công Tắc 2 Cực Là Gì? Cấu Tạo, Nguyên Lý Hoạt Động Của Công Tắc 2 Cực'
  ];

  // Sidebar: MẸO VẶT
  const meoVatFeatured = {
    id: 10,
    title: 'Tết Năm Nay Rất Khác Lạ! Khi Tết Không Còn Chỉ Là Niềm Vui Mà Là Bài Toán Cuộc Sống',
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400'
  };

  const meoVatGrid = [
    {
      id: 11,
      title: 'Tết Nguyên Đán 2026 – Nét Đẹp Văn Hoá Truyền Thống Của Người Việt',
      thumbnail: 'https://images.unsplash.com/photo-1548263594-a71ea65a8ad3?w=250'
    },
    {
      id: 12,
      title: 'Danh sách nâng cấp điện trong nhà giúp đón Tết 2026 an toàn và tiện nghi.',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=250'
    },
    {
      id: 13,
      title: 'Xu hướng mua sắm Tết 2026: Thiết thực – ưu tiên nâng cấp không gian sống.',
      thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=250'
    },
    {
      id: 14,
      title: '11 Tiêu Chuẩn Ổ Cắm Điện Việt Nam Chọn Đúng Để Dùng An Toàn',
      thumbnail: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=250'
    }
  ];

  return (
    <div className="tips-page-layout">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> &gt; </span>
          <span>Tin tức</span>
        </div>

        <Row gutter={24}>
          {/* Main Content - Left */}
          <Col xs={24} lg={16}>
            <div className="main-content22">
              {/* Featured Post - Large */}
              <Link to={`/tin-tuc/${featuredPost.id}`} className="featured-post">
                <div className="featured-image">
                  <img src={featuredPost.thumbnail} alt={featuredPost.title} />
                </div>
                <div className="featured-info">
                  <h3>{featuredPost.title}</h3>
                  <div className="post-meta">
                    <span>{featuredPost.createdAt}</span>
                    {featuredPost.author && (
                      <>
                        <span className="separator"> - </span>
                        <span>{featuredPost.author}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>

              {/* List Posts */}
              <div className="list-posts">
                {listPosts.map((post) => (
                  <Link to={`/tin-tuc/${post.id}`} key={post.id} className="list-post-item">
                    <div className="post-thumbnail">
                      <img src={post.thumbnail} alt={post.title} />
                    </div>
                    <div className="post-info">
                      <h5>{post.title}</h5>
                      {post.description && (
                        <p className="description">{post.description}</p>
                      )}
                      <div className="post-date">
                        {post.createdAt}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Col>

          {/* Sidebar - Right */}
          <Col xs={24} lg={8}>
            <div className="sidebar">
              {/* TIN NỔI BẬT */}
              <div className="sidebar-section">
                <div className="section-title">TIN NỔI BẬT</div>
                <div className="hot-news-list">
                  {hotNews.map((title, index) => (
                    <Link to={`/tin-tuc/${index + 20}`} key={index} className="hot-news-item">
                      <div className="news-number">{index + 1}</div>
                      <div className="news-title">{title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* MẸO VẶT */}
              <div className="sidebar-section meovat-section">
                <div className="section-title">MẸO VẶT</div>
                
                {/* Featured */}
                <Link to={`/meo-vat/${meoVatFeatured.id}`} className="meovat-featured">
                  <img src={meoVatFeatured.thumbnail} alt={meoVatFeatured.title} />
                  <div className="meovat-featured-title">
                    {meoVatFeatured.title}
                  </div>
                </Link>

                {/* Grid 2x2 */}
                <div className="meovat-grid">
                  {meoVatGrid.map((post) => (
                    <Link to={`/meo-vat/${post.id}`} key={post.id} className="meovat-grid-item">
                      <img src={post.thumbnail} alt={post.title} />
                      <div className="meovat-grid-title">{post.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PostsPage;