// components/Admin/Homepage/ProductSelectorModal.tsx
import React, { useState } from 'react';
import { 
  Modal, 
  Table, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Image,
  Button,
  message 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { Product } from '../../../types/product.type';
import './ProductSelectorModal.scss';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (selectedProducts: Product[]) => void;
  initialSelected?: number[]; // Product IDs đã chọn trước đó
  maxProducts?: number; // Giới hạn số sản phẩm có thể chọn
  sectionTitle?: string;
}

const ProductSelectorModal = ({
  open,
  onCancel,
  onConfirm,
  initialSelected = [],
  maxProducts = 10,
  sectionTitle = 'Section'
}: Props) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(initialSelected);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Mock data - thay bằng API call thực tế
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Ổ Cắm Điện 6000W',
      sku: '3S-6000W-C',
      slug: 'o-cam-dien-6000w',
      price: 90200,
      salePrice: 41000,
      stockQuantity: 150,
      mainImage: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=150',
      status: 'PUBLISHED',
      brandName: 'SOPOKA',
      viewCount: 1234,
      soldCount: 567,
      shortDescription: 'Ổ cắm chất lượng cao',
      fullDescription: '<p>Mô tả chi tiết</p>',
      category: { id: 1, name: 'Điện gia dụng' }
    },
    // Thêm nhiều sản phẩm khác...
  ];

  const mockCategories = [
    { value: null, label: 'Tất cả danh mục' },
    { value: 1, label: 'Điện gia dụng' },
    { value: 2, label: 'Linh kiện điện tử' },
    { value: 3, label: 'Dây cáp' }
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = !selectedCategory || product.category?.id === selectedCategory;
    return matchSearch && matchCategory;
  });

  const columns: ColumnsType<Product> = [
    {
      title: 'Ảnh',
      dataIndex: 'mainImage',
      width: 80,
      render: (url) => (
        <Image
          width={60}
          height={60}
          src={url}
          style={{ objectFit: 'cover', borderRadius: 6 }}
        />
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 300,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <small style={{ color: '#999' }}>SKU: {record.sku}</small>
        </div>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      width: 150
    },
    {
      title: 'Giá',
      dataIndex: 'salePrice',
      width: 120,
      render: (salePrice, record) => (
        <div>
          <div style={{ color: '#ff4444', fontWeight: 600 }}>
            {salePrice.toLocaleString()}₫
          </div>
          {record.price > salePrice && (
            <small style={{ textDecoration: 'line-through', color: '#999' }}>
              {record.price.toLocaleString()}₫
            </small>
          )}
        </div>
      )
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldCount',
      width: 100,
      align: 'center',
      render: (count) => <Tag color="green">{count}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'PUBLISHED' ? 'success' : 'default'}>
          {status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
        </Tag>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[], newSelectedRows: Product[]) => {
      if (newSelectedRowKeys.length > maxProducts) {
        message.warning(`Chỉ được chọn tối đa ${maxProducts} sản phẩm`);
        return;
      }
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedProducts(newSelectedRows);
    },
    getCheckboxProps: (record: Product) => ({
      disabled: selectedRowKeys.length >= maxProducts && !selectedRowKeys.includes(record.id)
    })
  };

  const handleConfirm = () => {
    if (selectedProducts.length === 0) {
      message.warning('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }
    onConfirm(selectedProducts);
    message.success(`Đã chọn ${selectedProducts.length} sản phẩm`);
  };

  return (
    <Modal
      open={open}
      title={`🎁 Chọn sản phẩm cho "${sectionTitle}"`}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={1200}
      okText="Xác nhận"
      cancelText="Hủy"
      className="product-selector-modal"
    >
      <div className="selector-header">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div className="selection-info">
            <Tag color="blue" style={{ fontSize: 14, padding: '6px 12px' }}>
              Đã chọn: {selectedRowKeys.length}/{maxProducts}
            </Tag>
            {selectedProducts.length > 0 && (
              <Button 
                size="small" 
                onClick={() => {
                  setSelectedRowKeys([]);
                  setSelectedProducts([]);
                }}
              >
                Bỏ chọn tất cả
              </Button>
            )}
          </div>

          <Space style={{ width: '100%' }}>
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              style={{ width: 200 }}
              placeholder="Lọc theo danh mục"
              options={mockCategories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </Space>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredProducts}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} sản phẩm`
        }}
        scroll={{ y: 400 }}
      />

      {selectedProducts.length > 0 && (
        <div className="selected-products-preview">
          <h4>Sản phẩm đã chọn ({selectedProducts.length}):</h4>
          <div className="selected-list">
            {selectedProducts.map((product) => (
              <Tag 
                key={product.id} 
                closable 
                onClose={() => {
                  setSelectedRowKeys(selectedRowKeys.filter(k => k !== product.id));
                  setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
                }}
                style={{ marginBottom: 8, padding: '4px 8px' }}
              >
                {product.name}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProductSelectorModal;