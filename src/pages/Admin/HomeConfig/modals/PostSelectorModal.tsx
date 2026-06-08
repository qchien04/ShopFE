import { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { PostPicker } from '../components/PostPicker';
import { postApi } from '../../../../api/post.api';
import { useQuery } from '@tanstack/react-query';
import type { Post } from '../../../../types/entity.type';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (selectedPosts: Post[]) => void;
  initialSelected?: number[];
  initialSelectedPosts?: Post[];
  maxPosts?: number;
  sectionTitle?: string;
}

const PostSelectorModal = ({
  open,
  onCancel,
  onConfirm,
  initialSelected = [],
  initialSelectedPosts = [],
  maxPosts,
  sectionTitle = 'Tin Tức'
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>(initialSelectedPosts);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  // Cập nhật state khi modal mở
  useEffect(() => {
    if (open) {
      setSelectedIds(initialSelected);
      setSelectedPosts(initialSelectedPosts);
    }
  }, [open, initialSelected, initialSelectedPosts]);

  const { data: allPosts, isLoading } = useQuery({
    queryKey: ['admin-posts-all', page, pageSize, searchText],
    queryFn: () => postApi.getAll({ page: page - 1, size: pageSize, keyword: searchText }),
  });

  const handleToggle = (ids: number[]) => {
    setSelectedIds(ids);
    // Cập nhật selectedPosts dựa trên ids mới và posts đang có
    if (allPosts?.content) {
      setSelectedPosts(prev => {
        const combined = [...prev, ...allPosts.content];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique.filter(p => ids.includes(p.id));
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedPosts);
  };

  return (
    <Modal
      open={open}
      title={`Chọn bài viết cho "${sectionTitle}"`}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={1000}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm bài viết theo tiêu đề..."
          onSearch={setSearchText}
          style={{ width: 400 }}
          allowClear
        />
      </div>

      <PostPicker
        posts={allPosts?.content}
        loading={isLoading}
        selectedIds={selectedIds}
        onChange={handleToggle}
        max={maxPosts}
        page={page}
        pageSize={pageSize}
        total={allPosts?.totalElements}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
      />
    </Modal>
  );
};

export default PostSelectorModal;
