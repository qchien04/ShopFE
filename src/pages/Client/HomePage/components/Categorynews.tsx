import { Card } from 'antd';
import './Categorynews.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { postApi } from '../../../../api/post.api';
import type { Post, NewsSectionConfig } from '../../../../types/entity.type';

interface Props {
  section?: NewsSectionConfig;
}

const SectionNews = ({ section }: Props) => {

  const [posts, setPosts] = useState<Post[]>([])
  const [popularNews, setPopularNews] = useState<Post[]>([])
  const nav = useNavigate()

  const getPost = async () => {
    try {
      if (section?.postIds && section.postIds.length > 0) {
        const s = await postApi.getByIds(section.postIds);
        setPosts(s);
      } else {
        const s = await postApi.getPre();
        setPosts(s);
      }

      if (section?.popularPostIds && section.popularPostIds.length > 0) {
        const s2 = await postApi.getByIds(section.popularPostIds);
        setPopularNews(s2);
      } else {
        const s2 = await postApi.getPopular();
        setPopularNews(s2);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  }

  useEffect(() => {
    getPost();
  }, [section]);

  return (
    <div className="category-news-section">
      {/* Tin Tức */}
      <section className="news-section">
        <div className="section-header">
          <div className="section-icon"></div>
          <h2 className="section-title">{section?.title || "Tin Tức"}</h2>
          <a href="#" className="view-all-link">
            Xem thêm Tin Tức ›
          </a>
        </div>

        <div className="news-container">
          {/* Main News Grid */}
          <div className="news-grid" style={section?.postPerRow ? { '--cols': section.postPerRow } as React.CSSProperties : undefined}>
            {posts.map((news) => (
              <Card
                onClick={() => nav(`/post/${news.id}`)}
                key={news.id}
                className="news-card"
                cover={
                  <div className="news-image-wrapper">
                    <img src={news.thumbnail} alt={news.title} />
                  </div>
                }
                hoverable
              >
                <h3 className="news-title">{news.title}</h3>
                <p className="news-excerpt">{news.description}</p>
              </Card>
            ))}
          </div>

          {/* Popular News Sidebar */}
          <div className="popular-news">
            <div className="popular-header">
              <span className="popular-icon"></span>
              <h3>MẸO VẶT</h3>
            </div>
            <div className="popular-list">
              {popularNews.map((news) => (
                <div key={news.id} onClick={() => nav(`/post/${news.id}`)} className="popular-item">
                  <img src={news.thumbnail} alt={news.title} />
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

export default SectionNews;