import { Row, Col } from 'antd';
import { Link, useSearchParams } from 'react-router-dom';
import './post.scss';
import { useEffect, useState } from 'react';
import { postApi } from '../../../api/post.api';
import type { Post } from '../../../types/entity.type';

const PostsPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");


  const [hotNews,setHotNews]=useState<Post[]>([]);
  const [meoVat,setMeoVat]=useState<Post[]>([]);
  const [mainTypePostList,setMainTypePostList]=useState<Post[]>([]);

  const getPopularPost= async()=>{
    const post=await postApi.getPopular();
    setHotNews(post)
  }

  const getMeoVatFeatured= async()=>{
    const post=await postApi.getAll({category:"meo-vat",page:0,size:5});
    setMeoVat(post.content)
  }

  const getMainTypePostList= async()=>{
    if(type){
      const post=await postApi.getAll({category:type,page:0,size:5});
      setMainTypePostList(post.content)
    }else{
      const post=await postApi.getAll({page:0,size:5});
      setMainTypePostList(post.content)
    }
    
  }

  useEffect(() => {
    getPopularPost();
    getMeoVatFeatured();
    getMainTypePostList();
  }, []);

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
              <Link to={`/post/${mainTypePostList[0]?.id}`} className="featured-post">
                <div className="featured-image">
                  <img src={mainTypePostList[0]?.thumbnail} alt={mainTypePostList[0]?.title} />
                </div>
                <div className="featured-info">
                  <h3>{mainTypePostList[0]?.title}</h3>
                  <div className="post-meta">
                    <span>{mainTypePostList[0]?.createdAt}</span>
                      <>
                        <span className="separator"> - </span>
                        <span>Admin</span>
                      </>
                  </div>
                </div>
              </Link>

              {/* List Posts */}
              <div className="list-posts">
                {mainTypePostList.slice(1).map((post) => (
                  <Link to={`/post/${post.id}`} key={post.id} className="list-post-item">
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
                  {hotNews.map((item, index) => (
                    <Link to={`/post/${index + 20}`} key={index} className="hot-news-item">
                      <div className="news-number">{index + 1}</div>
                      <div className="news-title">{item.title}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* MẸO VẶT */}
              <div className="sidebar-section meovat-section">
                <div className="section-title">MẸO VẶT</div>
                
                {/* Featured */}
                <Link to={`/post/${meoVat[0]?.id}`} className="meovat-featured">
                  <img src={meoVat[0]?.thumbnail} alt={meoVat[0]?.title} />
                  <div className="meovat-featured-title">
                    {meoVat[0]?.title}
                  </div>
                </Link>

                {/* Grid 2x2 */}
                <div className="meovat-grid">
                  {meoVat.slice(1,5).map((post) => (
                    <Link to={`/post/${post.id}`} key={post.id} className="meovat-grid-item">
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