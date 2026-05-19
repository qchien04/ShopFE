import { useState, useEffect } from 'react';
import { Modal, Form, Tabs } from 'antd';
import type { HotDealsSectionConfig } from '../../../../types/entity.type';
import type { Product } from '../../../../types/product.type';
import { productApi } from '../../../../api/product.api';
import ProductSelectorModal from './ProductSelectorModal';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ProductSelectionTab from './tabs/ProductSelectionTab';

interface Props {
  open: boolean;
  section: HotDealsSectionConfig | null;
  onCancel: () => void;
  onSave: (section: HotDealsSectionConfig) => void;
}

const HotDealsSectionModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [mainSelectorOpen, setMainSelectorOpen] = useState(false);
  const [weeklySelectorOpen, setWeeklySelectorOpen] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedWeeklyProducts, setSelectedWeeklyProducts] = useState<Product[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingWeeklyProducts, setLoadingWeeklyProducts] = useState(false);

  useEffect(() => {
    if (open && section) {
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        productPerRow: section.productPerRow || 4,
        weeklyTitle: section.weeklyTitle || 'Deal Hot Trong Tuần'
      });

      if (section.productIds?.length) fetchProducts(section.productIds, false);
      else setSelectedProducts([]);

      if (section.weeklyProductIds?.length) fetchProducts(section.weeklyProductIds, true);
      else setSelectedWeeklyProducts([]);
    }
  }, [open, section, form]);

  const fetchProducts = async (ids: number[], isWeekly: boolean) => {
    if (isWeekly) setLoadingWeeklyProducts(true);
    else setLoadingProducts(true);
    try {
      const resp = await productApi.getByIds(ids);
      if (isWeekly) setSelectedWeeklyProducts(resp.content);
      else setSelectedProducts(resp.content);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoadingWeeklyProducts(false);
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
        weeklyProductIds: selectedWeeklyProducts.map(p => p.id),
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
        title="🔥 Cấu hình Hot Deals & Deal Tuần"
        onCancel={onCancel}
        onOk={handleSave}
        width={900}
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
                children: <GeneralInfoTab isProductSection={true} hasWeeklySection={true} />
              },
              {
                key: 'main_products',
                label: `🔥 Hot Products (${selectedProducts.length})`,
                children: (
                  <ProductSelectionTab
                    products={selectedProducts}
                    loading={loadingProducts}
                    onAdd={() => setMainSelectorOpen(true)}
                    onRemove={(id) => setSelectedProducts(prev => prev.filter(p => p.id !== id))}
                    helpText="Hiển thị ở cột bên TRÁI của section Hot Deals."
                  />
                )
              },
              {
                key: 'weekly_products',
                label: `📅 Deal Tuần (${selectedWeeklyProducts.length})`,
                children: (
                  <ProductSelectionTab
                    products={selectedWeeklyProducts}
                    loading={loadingWeeklyProducts}
                    onAdd={() => setWeeklySelectorOpen(true)}
                    onRemove={(id) => setSelectedWeeklyProducts(prev => prev.filter(p => p.id !== id))}
                    helpText="Hiển thị ở cột bên PHẢI (Deal Hot Trong Tuần)."
                  />
                )
              }
            ]}
          />
        </Form>
      </Modal>

      <ProductSelectorModal
        open={mainSelectorOpen}
        onCancel={() => setMainSelectorOpen(false)}
        onConfirm={(products) => {
          setSelectedProducts(products);
          setMainSelectorOpen(false);
        }}
        initialSelected={selectedProducts.map(p => p.id)}
        initialSelectedProducts={selectedProducts}
        sectionTitle={form.getFieldValue('title')}
      />

      <ProductSelectorModal
        open={weeklySelectorOpen}
        onCancel={() => setWeeklySelectorOpen(false)}
        onConfirm={(products) => {
          setSelectedWeeklyProducts(products);
          setWeeklySelectorOpen(false);
        }}
        initialSelected={selectedWeeklyProducts.map(p => p.id)}
        initialSelectedProducts={selectedWeeklyProducts}
        sectionTitle={form.getFieldValue('weeklyTitle')}
      />
    </>
  );
};

export default HotDealsSectionModal;
