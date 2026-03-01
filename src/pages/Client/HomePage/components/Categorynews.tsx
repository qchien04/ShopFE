import { Card } from 'antd';
import './CategoryNews.scss';
import { useCategoryList } from '../../../../hooks/Category/useCategotyList';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { postApi } from '../../../../api/post.api';
import type { Post } from '../../../../types/entity.type';

const CategoryNews = () => {
  const {data:categories} = useCategoryList();
  
  const [posts,setPosts]=useState<Post[]>([])
  const [popularNews,setPopularNews]=useState<Post[]>([])
  const nav=useNavigate()


  const getPost=async()=>{
    const s=await postApi.getPre();
    const s2=await postApi.getPopular();
    setPosts(s);
    setPopularNews(s2);
  }

  useEffect(()=>{
    getPost();
  },[])

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
            {posts.map((news) => (
              <Card
                onClick={()=>nav(`/post/${news.id}`)}
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
              <span className="popular-icon">🔥</span>
              <h3>MẸO VẶT</h3>
            </div>
            <div className="popular-list">
              {popularNews.map((news) => (
                <div key={news.id} onClick={()=>nav(`/post/${news.id}`)} className="popular-item">
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

export default CategoryNews;