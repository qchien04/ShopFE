import { useState, useEffect } from 'react';
import { Modal, Form, Tabs, Select } from 'antd';
import type { NewProductConfig } from '../../../../types/entity.type';
import type { Category } from '../../../../types/categories.type';
import type { Product } from '../../../../types/product.type';
import { productApi } from '../../../../api/product.api';
import { categoryApi } from '../../../../api/categories.api';
import ProductSelectorModal from './ProductSelectorModal';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ProductSelectionTab from './tabs/ProductSelectionTab';

interface Props {
  open: boolean;
  section: NewProductConfig | null;
  onCancel: () => void;
  onSave: (section: NewProductConfig) => void;
}

const NewProductSectionModal = ({ open, section, onCancel, onSave }: Props) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [activeSelectorKey, setActiveSelectorKey] = useState<string | null>(null);

  // Watch the selected categories in the form to render dynamic tabs
  const selectedCategoryIds = Form.useWatch('categoryIds', form) || [];

  useEffect(() => {
    if (open && section) {
      const catIds = section.categoryOfProduct?.map(c => c.categoryId).filter(id => id != null) || [];
      form.setFieldsValue({
        title: section.title,
        active: section.active,
        productPerRow: section.productPerRow || 5,
        categoryIds: catIds
      });

      const fetchAllCategoryProducts = async () => {
        setLoadingProducts(true);
        try {
          const map: Record<string, Product[]> = {};
          if (section.categoryOfProduct) {
            for (const cat of section.categoryOfProduct) {
              const key = cat.categoryId == null ? 'all' : cat.categoryId.toString();
              if (cat.productIds && cat.productIds.length > 0) {
                const resp = await productApi.getByIds(cat.productIds);
                map[key] = resp.content;
              } else {
                map[key] = [];
              }
            }
          }
          setProductsByCategory(map);
        } catch (error) {
          console.error('Failed to fetch products', error);
        } finally {
          setLoadingProducts(false);
        }
      };

      fetchAllCategoryProducts();
      fetchCategories();
    }
  }, [open, section, form]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const resp = await categoryApi.getAll();
      setCategories(resp);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const categoryOfProduct = [];
      // Tab 'Tất cả'
      if (productsByCategory['all']?.length) {
        categoryOfProduct.push({
          categoryId: null as unknown as number,
          productIds: productsByCategory['all'].map(p => p.id)
        });
      } else {
        // Luôn có 1 mục null để đại diện cho tab Tất cả
        categoryOfProduct.push({
          categoryId: null as unknown as number,
          productIds: []
        });
      }

      // Other selected categories
      values.categoryIds.forEach((id: number) => {
        categoryOfProduct.push({
          categoryId: id,
          productIds: productsByCategory[id.toString()]?.map(p => p.id) || []
        });
      });

      onSave({
        ...section!,
        ...values,
        categoryOfProduct
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const removeProduct = (key: string, productId: number) => {
    setProductsByCategory(prev => ({
      ...prev,
      [key]: prev[key]?.filter(p => p.id !== productId) || []
    }));
  };

  if (!section) return null;

  const tabs = [
    {
      key: 'basic',
      label: '🎨 Thông tin chung',
      children: (
        <>
          <GeneralInfoTab isProductSection={true} />
          <Form.Item
            name="categoryIds"
            label="Danh mục hiển thị (Category con)"
            tooltip="Chọn các danh mục để tạo ra các Tab sản phẩm trong section này."
          >
            <Select
              mode="multiple"
              placeholder="Chọn danh mục..."
              loading={loadingCategories}
              options={categories.map(c => ({ label: c.name, value: c.id }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </>
      )
    },
    {
      key: 'tab_all',
      label: '🎁 Tất cả',
      children: (
        <ProductSelectionTab
          products={productsByCategory['all'] || []}
          loading={loadingProducts}
          onAdd={() => setActiveSelectorKey('all')}
          onRemove={(id) => removeProduct('all', id)}
          helpText="Ghim sản phẩm cho tab 'Tất cả'. Nếu bỏ trống sẽ tự động lấy sản phẩm mới nhất."
        />
      )
    }
  ];

  selectedCategoryIds.forEach((id: number) => {
    const cat = categories.find(c => c.id === id);
    if (cat) {
      tabs.push({
        key: `tab_${id}`,
        label: `📁 ${cat.name}`,
        children: (
          <ProductSelectionTab
            products={productsByCategory[id.toString()] || []}
            loading={loadingProducts}
            onAdd={() => setActiveSelectorKey(id.toString())}
            onRemove={(productId) => removeProduct(id.toString(), productId)}
            helpText={`Ghim sản phẩm hiển thị khi người dùng bấm vào tab '${cat.name}'.`}
          />
        )
      });
    }
  });

  return (
    <>
      <Modal
        open={open}
        title="🆕 Cấu hình Sản phẩm mới"
        onCancel={onCancel}
        onOk={handleSave}
        width={800}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Tabs items={tabs} />
        </Form>
      </Modal>

      <ProductSelectorModal
        open={activeSelectorKey !== null}
        onCancel={() => setActiveSelectorKey(null)}
        onConfirm={(products) => {
          if (activeSelectorKey) {
            setProductsByCategory(prev => ({
              ...prev,
              [activeSelectorKey]: products
            }));
          }
          setActiveSelectorKey(null);
        }}
        initialSelected={(productsByCategory[activeSelectorKey || ''] || []).map(p => p.id)}
        initialSelectedProducts={productsByCategory[activeSelectorKey || ''] || []}
        maxProducts={form.getFieldValue('productCount') || 10}
        sectionTitle={form.getFieldValue('title')}
      />
    </>
  );
};

export default NewProductSectionModal;
