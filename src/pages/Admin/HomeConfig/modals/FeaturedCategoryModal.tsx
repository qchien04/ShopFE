import { useState, useEffect } from 'react';
import { Modal, Form, Tabs, InputNumber } from 'antd';
import type { FeaturedCategoryConfig } from '../../../../types/entity.type';
import type { Category } from '../../../../types/categories.type';
import { categoryApi } from '../../../../api/categories.api';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import CategorySelectionTab from './tabs/CategorySelectionTab';
import CategorySelectorModal from './CategorySelectorModal';

interface Props {
  open: boolean;
  section: FeaturedCategoryConfig | null;
  onCancel: () => void;
  onSave: (section: FeaturedCategoryConfig) => void;
}

const FeaturedCategoryModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        categoryPerRow: section.categoryPerRow || 10,
      });
      if (section.categoryIds?.length) {
        fetchCategories(section.categoryIds);
      } else {
        setSelectedCategories([]);
      }
    }
  }, [open, section, form]);

  const fetchCategories = async (ids: number[]) => {
    setLoadingCategories(true);
    try {
      const all = await categoryApi.getAll();
      const filtered = all.filter(c => ids.includes(c.id as number));
      setSelectedCategories(filtered);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...section!,
        ...values,
        categoryIds: selectedCategories.map(c => c.id as number),
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
      title="📂 Cấu hình Danh Mục Nổi Bật"
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
              children: (
                <>
                  <GeneralInfoTab isProductSection={true} />
                  
                  <Form.Item
                    name="categoryPerRow"
                    label="Số danh mục trên 1 hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                  >
                    <InputNumber min={2} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </>
              )
            },
            {
              key: 'categories',
              label: `📁 Danh mục hiển thị (${selectedCategories.length})`,
              children: (
                <CategorySelectionTab
                  categories={selectedCategories}
                  loading={loadingCategories}
                  onAdd={() => setSelectorOpen(true)}
                  onRemove={(id) => setSelectedCategories(prev => prev.filter(c => c.id !== id))}
                />
              )
            }
          ]}
        />
      </Form>
    </Modal>

    <CategorySelectorModal
      open={selectorOpen}
      onCancel={() => setSelectorOpen(false)}
      onConfirm={(cats) => {
        setSelectedCategories(cats);
        setSelectorOpen(false);
      }}
      initialSelected={selectedCategories.map(c => c.id as number)}
    />
    </>
  );
};

export default FeaturedCategoryModal;
