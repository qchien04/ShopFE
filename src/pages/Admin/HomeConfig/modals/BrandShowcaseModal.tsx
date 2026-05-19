import { useState, useEffect } from 'react';
import { Modal, Form, Tabs } from 'antd';
import type { BrandsShowcaseConfig, Brand } from '../../../../types/entity.type';
import type { Product } from '../../../../types/product.type';
import { brandApi } from '../../../../api/brand.api';
import ProductSelectorModal from './ProductSelectorModal';
import BrandSelectorModal from './BrandSelectorModal';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import BrandSelectionTab from './tabs/BrandSelectionTab';

interface Props {
  open: boolean;
  section: BrandsShowcaseConfig | null;
  onCancel: () => void;
  onSave: (section: BrandsShowcaseConfig) => void;
}

const BrandShowcaseModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  const [brandSelectorOpen, setBrandSelectorOpen] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);

  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        brandCount: section.brandCount || 10
      });

      if (section.brandIds?.length) fetchBrands(section.brandIds);
      else setSelectedBrands([]);
    }
  }, [open, section, form]);

  const fetchBrands = async (ids: number[]) => {
    setLoadingBrands(true);
    try {
      const all = await brandApi.getAll();
      const filtered = all.filter(b => ids.includes(b.id!));
      setSelectedBrands(filtered);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...section!,
        ...values,
        brandIds: selectedBrands.map(b => b.id!),
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
        title="🏷️ Cấu hình Thương hiệu nổi bật"
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
                children: <GeneralInfoTab isBrandSection={true} />
              },
              {
                key: 'brands',
                label: `🏷️ Thương hiệu (${selectedBrands.length})`,
                children: (
                  <BrandSelectionTab
                    brands={selectedBrands}
                    loading={loadingBrands}
                    onAdd={() => setBrandSelectorOpen(true)}
                    onRemove={(id) => setSelectedBrands(prev => prev.filter(b => b.id !== id))}
                  />
                )
              }
            ]}
          />
        </Form>
      </Modal>

      <ProductSelectorModal
        open={productSelectorOpen}
        onCancel={() => setProductSelectorOpen(false)}
        onConfirm={(products) => {
          setSelectedProducts(products);
          setProductSelectorOpen(false);
        }}
        initialSelected={selectedProducts.map(p => p.id)}
        initialSelectedProducts={selectedProducts}
        maxProducts={form.getFieldValue('productCount')}
        sectionTitle={form.getFieldValue('title')}
      />

      <BrandSelectorModal
        open={brandSelectorOpen}
        onCancel={() => setBrandSelectorOpen(false)}
        onConfirm={(brands) => {
          setSelectedBrands(brands);
          setBrandSelectorOpen(false);
        }}
        initialSelected={selectedBrands.map(b => b.id!)}
      />
    </>
  );
};

export default BrandShowcaseModal;
