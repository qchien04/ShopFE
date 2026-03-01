
import { postApi } from '../../../api/post.api';
import type { Post, PostPayload } from '../../../types/entity.type';
import SalePostEditor from './SalePostEditor';
import axios from 'axios';

const CreatePostPage: React.FC = () => {
  const handleSave = async (data: PostPayload): Promise<void> => {
    postApi.create(data)
  };

  return <SalePostEditor onSave={handleSave} />;
};


export default CreatePostPage;

// // Edit mode:
// const EditPostPage: React.FC<{ post: Post }> = ({ post }) => {
//   const handleSave = async (data: PostPayload): Promise<void> => {
//     await axios.put(`/api/posts/${post.id}`, data);
//   };

//   return (
//     <SalePostEditor
//       onSave={handleSave}
//       initialData={{
//         title: post.title,
//         category: post.category,
//         content: post.content,
//         thumbnail: post.thumbnail,
//         tags: post.tags,
//       }}
//     />
//   );
// };