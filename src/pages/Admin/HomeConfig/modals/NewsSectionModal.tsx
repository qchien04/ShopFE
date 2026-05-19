import { useState, useEffect } from 'react';
import { Modal, Form, Tabs } from 'antd';
import type { NewsSectionConfig, Post } from '../../../../types/entity.type';
import { postApi } from '../../../../api/post.api';
import PostSelectorModal from './PostSelectorModal';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import PostSelectionTab from './tabs/PostSelectionTab';

interface Props {
  open: boolean;
  section: NewsSectionConfig | null;
  onCancel: () => void;
  onSave: (section: NewsSectionConfig) => void;
}

const NewsSectionModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [postSelectorOpen, setPostSelectorOpen] = useState(false);
  const [popularSelectorOpen, setPopularSelectorOpen] = useState(false);

  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [selectedPopularPosts, setSelectedPopularPosts] = useState<Post[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        postPerRow: section.postPerRow || 3
      });

      if (section.postIds?.length) fetchPosts(section.postIds, false);
      else setSelectedPosts([]);

      if (section.popularPostIds?.length) fetchPosts(section.popularPostIds, true);
      else setSelectedPopularPosts([]);
    }
  }, [open, section, form]);

  const fetchPosts = async (ids: number[], isPopular: boolean) => {
    if (isPopular) setLoadingPopular(true);
    else setLoadingPosts(true);
    try {
      const resp: any = await postApi.getByIds(ids);
      const posts = Array.isArray(resp) ? resp : (resp?.content || []);
      if (isPopular) setSelectedPopularPosts(posts);
      else setSelectedPosts(posts);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoadingPopular(false);
      setLoadingPosts(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...section!,
        ...values,
        postIds: selectedPosts.map(p => p.id),
        popularPostIds: selectedPopularPosts.map(p => p.id),
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (!section) return null;

  return (
    <>
      <Modal
        open={open}
        title="🗞️ Cấu hình Tin tức"
        onCancel={onCancel}
        onOk={handleSave}
        width={800}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: 'basic',
                label: '🎨 Thông tin chung',
                children: <GeneralInfoTab isNewsSection={true} />
              },
              {
                key: 'posts',
                label: `🗞️ Tin tức mới (${selectedPosts.length})`,
                children: (
                  <PostSelectionTab
                    posts={selectedPosts}
                    loading={loadingPosts}
                    onAdd={() => setPostSelectorOpen(true)}
                    onRemove={(id) => setSelectedPosts(prev => prev.filter(p => p.id !== id))}
                    helpText="Chọn tối đa 6 bài viết hiển thị ở mục Tin Tức mới."
                  />
                )
              },
              {
                key: 'popular',
                label: `🔥 Mẹo vặt / Phổ biến (${selectedPopularPosts.length})`,
                children: (
                  <PostSelectionTab
                    posts={selectedPopularPosts}
                    loading={loadingPopular}
                    onAdd={() => setPopularSelectorOpen(true)}
                    onRemove={(id) => setSelectedPopularPosts(prev => prev.filter(p => p.id !== id))}
                    helpText="Chọn các bài viết hiển thị ở cột bên phải."
                  />
                )
              }
            ]}
          />
        </Form>
      </Modal>

      <PostSelectorModal
        open={postSelectorOpen}
        onCancel={() => setPostSelectorOpen(false)}
        onConfirm={(posts) => {
          setSelectedPosts(posts);
          setPostSelectorOpen(false);
        }}
        initialSelected={selectedPosts.map(p => p.id)}
        initialSelectedPosts={selectedPosts}
        maxPosts={6}
        sectionTitle="Tin Tức Mới"
      />

      <PostSelectorModal
        open={popularSelectorOpen}
        onCancel={() => setPopularSelectorOpen(false)}
        onConfirm={(posts) => {
          setSelectedPopularPosts(posts);
          setPopularSelectorOpen(false);
        }}
        initialSelected={selectedPopularPosts.map(p => p.id)}
        initialSelectedPosts={selectedPopularPosts}
        maxPosts={6}
        sectionTitle="Mẹo Vặt / Phổ Biến"
      />
    </>
  );
};

export default NewsSectionModal;
