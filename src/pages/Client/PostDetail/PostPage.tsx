
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostDetail from './PostDetail';
import type { Post } from '../../../types/entity.type';
import { postApi } from '../../../api/post.api';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);


  const getPost= async(id:number)=>{
    const post=await postApi.getById(id);
    setPost(post)
    setLoading(false)
  }
  useEffect(() => {
    if(id) {
      getPost(Number(id))
    }
  }, [id]);

  if (!post) return <PostDetail post={post!} loading={loading} />;
  return <PostDetail post={post} loading={loading} />;
};

export default PostDetailPage;