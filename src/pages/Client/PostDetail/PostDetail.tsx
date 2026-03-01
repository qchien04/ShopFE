// PostDetail.tsx
// Component hiển thị bài viết sau khi đã lưu

import React from 'react';
import { Typography, Tag, Divider, Skeleton } from 'antd';
import { CalendarOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { POST_CONTENT_CSS } from '../../Admin/SEO/SalePostEditor';
import type { Post } from '../../../types/entity.type';

const { Title, Text } = Typography;

// ========================
// Types
// ========================


interface PostDetailProps {
  post: Post;
  loading?: boolean;
}

// ========================
// PostDetail
// ========================
const PostDetail: React.FC<PostDetailProps> = ({ post, loading }) => {
  if (loading) {
    return (
      <div style={{ margin: '32px auto', padding: '0 16px' }}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </div>
    );
  }

  return (
    <article style={{ margin: '32px auto', padding: '0 16px' }}>

      {/* Thumbnail */}
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          style={{
            width: '100%', maxHeight: 420, objectFit: 'cover',
            borderRadius: 12, marginBottom: 28,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          }}
        />
      )}

      {/* Tiêu đề */}
      <Title level={1} style={{ marginBottom: 12, lineHeight: 1.3 }}>
        {post.title}
      </Title>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <Tag color="blue" style={{ fontSize: 13, padding: '2px 10px' }}>{post.category}</Tag>
        <Text type="secondary">
          <CalendarOutlined style={{ marginRight: 4 }} />
          {dayjs(post.updatedAt).format('DD/MM/YYYY HH:mm')}
        </Text>
        {post.tags?.map((tag) => (
          <Tag key={tag} icon={<TagOutlined />} color="default">{tag}</Tag>
        ))}
      </div>

      {/* Mô tả ngắn */}
      {post.description && (
        <Text
          type="secondary"
          style={{ fontSize: 16, display: 'block', marginBottom: 20, fontStyle: 'italic', lineHeight: 1.7 }}
        >
          {post.description}
        </Text>
      )}

      <Divider style={{ margin: '16px 0 24px' }} />

      {/* === NỘI DUNG CHÍNH ===
          Render HTML từ editor, class post-content để apply style */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <style>{POST_CONTENT_CSS}</style>
    </article>
  );
};

export default PostDetail;
