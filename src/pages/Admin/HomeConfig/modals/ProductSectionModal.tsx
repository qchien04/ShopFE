import { useState, useEffect } from 'react';
import { Modal, Form, Tabs } from 'antd';
import type { FeaturedProductConfig } from '../../../../types/entity.type';
import type { Product } from '../../../../types/product.type';
import { productApi } from '../../../../api/product.api';
import ProductSelectorModal from './ProductSelectorModal';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ProductSelectionTab from './tabs/ProductSelectionTab';

interface Props {
  open: boolean;
  section: FeaturedProductConfig | null;
  onCancel: () => void;
  onSave: (section: FeaturedProductConfig) => void;
}

const ProductSectionModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        productCount: section.productCount || 10
      });

      if (section.productIds && section.productIds.length > 0) {
        fetchProducts(section.productIds);
      } else {
        setSelectedProducts([]);
      }
    }
  }, [open, section, form]);

  const fetchProducts = async (ids: number[]) => {
    setLoadingProducts(true);
    try {
      const resp = await productApi.getByIds(ids);
      setSelectedProducts(resp.content);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...section!,
        ...values,
        productIds: selectedProducts.map(p => p.id),
      });
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (!section) return null;

  return (
    <>
      <Modal
        open={open}
        title={`⚙️ Cấu hình: ${section.title}`}
        onCancel={onCancel}
        onOk={handleSave}
        width={800}
        okText="Lưu lại"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Tabs
            items={[
              {
                key: 'basic',
                label: '🎨 Thông tin chung',
                children: <GeneralInfoTab isProductSection={true} />
              },
              {
                key: 'products',
                label: `🎁 Sản phẩm (${selectedProducts.length})`,
                children: (
                  <ProductSelectionTab
                    products={selectedProducts}
                    loading={loadingProducts}
                    onAdd={() => setProductSelectorOpen(true)}
                    onRemove={(id) => setSelectedProducts(prev => prev.filter(p => p.id !== id))}
                    helpText="Những sản phẩm này sẽ được ưu tiên hiển thị ở section này."
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
        maxProducts={form.getFieldValue('productCount') || 10}
        sectionTitle={form.getFieldValue('title')}
      />
    </>
  );
};

export default ProductSectionModal;
