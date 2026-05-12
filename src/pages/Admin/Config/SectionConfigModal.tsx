// components/Admin/Homepage/SectionConfigModal.tsx
import { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Button,
  message,
  Tabs,
  Table
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProductSectionConfig } from '../../../types/entity.type';
import ProductSelectorModal from './Productselectormodal';
import BrandSelectorModal from './BrandSelectorModal';
import { productApi } from '../../../api/product.api';
import { brandApi } from '../../../api/brand.api';
import type { Product } from '../../../types/product.type';
import type { Brand } from '../../../types/entity.type';

interface Props {
  open: boolean;
  section: ProductSectionConfig | null;
  onCancel: () => void;
  onSave: (section: ProductSectionConfig, brandIds?: number[]) => void;
  currentBrandIds?: number[];
}

const SectionConfigModal = ({ open, section, onCancel, onSave, currentBrandIds }: Props) => {
  const [form] = Form.useForm();
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  const [brandSelectorOpen, setBrandSelectorOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

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
      
      if (currentBrandIds && currentBrandIds.length > 0) {
        fetchBrands(currentBrandIds);
      } else {
        setSelectedBrands([]);
      }
    }
  }, [open, section, form, currentBrandIds]);

  const fetchBrands = async (ids: number[]) => {
    setLoadingBrands(true);
    try {
      // Vì brandApi.getAll() trả về tất cả, ta filter lại hoặc dùng getById nếu có
      const all = await brandApi.getAll();
      const filtered = all.filter(b => ids.includes(b.id!));
      setSelectedBrands(filtered);
    } catch (error) {
      console.error('Failed to fetch brands', error);
    } finally {
      setLoadingBrands(false);
    }
  };

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

  if (!section) return null;

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...section,
        ...values,
        productIds: selectedProducts.map(p => p.id)
      }, selectedBrands.map(b => b.id!));
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleProductSelect = (products: Product[]) => {
    setSelectedProducts(products);
    setProductSelectorOpen(false);
  };

  // Ẩn tab Ghim sản phẩm cho các Section không phải là product-list (ví dụ: category_news, brand_showcase)
  const isProductSection = ['featured_products', 'new_products', 'hot_deals'].includes(section.id);
  const isBrandSection = section.id === 'brand_showcase';

  return (
    <>
      <Modal
        open={open}
        title={`⚙️ Cấu hình: ${section.title || 'Section'}`}
        onCancel={onCancel}
        onOk={handleSave}
        width={800}
        okText="Lưu lại"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Tabs
            items={[
              {
                key: 'basic',
                label: '🎨 Thông tin chung',
                children: (
                  <div style={{ paddingTop: 16 }}>
                    <Form.Item
                      name="title"
                      label="Tiêu đề section"
                      rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                      <Input placeholder="VD: Sản Phẩm Bán Chạy" />
                    </Form.Item>

                    <Form.Item
                      name="active"
                      label="Cho phép hiển thị"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>

                    {isProductSection && (
                        <Form.Item
                            name="productCount"
                            label="Số lượng sản phẩm hiển thị trên trang chủ"
                            initialValue={10}
                            help="Nếu bạn chỉ ghim 3 sản phẩm, hệ thống sẽ tự động bù thêm sản phẩm mới để đủ số lượng này."
                        >
                            <InputNumber min={1} max={30} style={{ width: '100%' }} />
                        </Form.Item>
                    )}
                  </div>
                )
              },
              ...(isProductSection ? [{
                key: 'products',
                label: `🎁 Ghim sản phẩm (${selectedProducts.length})`,
                children: (
                  <div className="product-selection-tab" style={{ paddingTop: 16 }}>
                    <div style={{ marginBottom: 16, color: '#666' }}>
                      💡 Những sản phẩm bạn chọn ở đây sẽ được ưu tiên hiển thị đầu tiên trong danh sách.
                    </div>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setProductSelectorOpen(true)}
                      block
                      style={{ marginBottom: 16 }}
                    >
                      Bấm để chọn/thay đổi sản phẩm
                    </Button>

                    {selectedProducts.length > 0 && (
                        <Table
                            size="small"
                            dataSource={selectedProducts}
                            rowKey="id"
                            pagination={false}
                            loading={loadingProducts}
                            scroll={{ y: 300 }}
                            columns={[
                                {
                                    title: 'Ảnh',
                                    dataIndex: 'mainImage',
                                    width: 70,
                                    render: (img) => <img src={img} width={40} style={{ borderRadius: 4 }} />
                                },
                                {
                                    title: 'Tên sản phẩm',
                                    dataIndex: 'name',
                                    ellipsis: true
                                },
                                {
                                    title: 'Giá',
                                    dataIndex: 'salePrice',
                                    width: 120,
                                    render: (val) => <span style={{color: 'red'}}>{val?.toLocaleString()}₫</span>
                                },
                                {
                                    title: 'Gỡ ghim',
                                    width: 80,
                                    align: 'center',
                                    render: (_, record) => (
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<DeleteOutlined />} 
                                            onClick={() => setSelectedProducts(prev => prev.filter(p => p.id !== record.id))}
                                        />
                                    )
                                }
                            ]}
                        />
                    )}
                  </div>
                )
              }] : []),
              ...(isBrandSection ? [{
                key: 'brands',
                label: `🏷️ Ghim thương hiệu (${selectedBrands.length})`,
                children: (
                  <div className="brand-selection-tab" style={{ paddingTop: 16 }}>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setBrandSelectorOpen(true)}
                      block
                      style={{ marginBottom: 16 }}
                    >
                      Bấm để chọn/thay đổi thương hiệu
                    </Button>

                    {selectedBrands.length > 0 && (
                      <Table
                        size="small"
                        dataSource={selectedBrands}
                        rowKey="id"
                        pagination={false}
                        loading={loadingBrands}
                        scroll={{ y: 300 }}
                        columns={[
                          {
                            title: 'Logo',
                            dataIndex: 'logo',
                            width: 80,
                            render: (img) => <img src={img} width={40} style={{ borderRadius: 4 }} />
                          },
                          {
                            title: 'Tên thương hiệu',
                            dataIndex: 'name',
                            ellipsis: true
                          },
                          {
                            title: 'Gỡ ghim',
                            width: 80,
                            align: 'center',
                            render: (_, record) => (
                              <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />} 
                                onClick={() => setSelectedBrands(prev => prev.filter(b => b.id !== record.id))}
                              />
                            )
                          }
                        ]}
                      />
                    )}
                  </div>
                )
              }] : [])
            ]}
          />
        </Form>
      </Modal>

      {isProductSection && (
          <ProductSelectorModal
            open={productSelectorOpen}
            onCancel={() => setProductSelectorOpen(false)}
            onConfirm={handleProductSelect}
            initialSelected={selectedProducts.map(p => p.id)}
            maxProducts={form.getFieldValue('productCount') || 10}
            sectionTitle={form.getFieldValue('title')}
          />
      )}

      {isBrandSection && (
        <BrandSelectorModal
          open={brandSelectorOpen}
          onCancel={() => setBrandSelectorOpen(false)}
          onConfirm={(brands) => {
            setSelectedBrands(brands);
            setBrandSelectorOpen(false);
          }}
          initialSelected={selectedBrands.map(b => b.id!)}
        />
      )}
    </>
  );
};

export default SectionConfigModal;