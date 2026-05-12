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
  message 
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '../../../types/product.type';
import { useProductList } from '../../../hooks/Product/useProductList';
import type { PageResponse } from '../../../types/response.type';
import { useCategoryList } from '../../../hooks/Category/useCategotyList';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (selectedProducts: Product[]) => void;
  initialSelected?: number[]; 
  maxProducts?: number; 
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
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(initialSelected);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: categories } = useCategoryList();
  
  const { data, isLoading } = useProductList<PageResponse<Product>>({
    type: "all",
    page: page - 1,
    size: pageSize,
    keyword: searchText,
    mainCategoryId: selectedCategory
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
            {salePrice?.toLocaleString()}₫
          </div>
          {record.price > salePrice && (
            <small style={{ textDecoration: 'line-through', color: '#999' }}>
              {record.price?.toLocaleString()}₫
            </small>
          )}
        </div>
      )
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      width: 100,
      align: 'center',
      render: (count) => <Tag color={count > 0 ? "green" : "red"}>{count}</Tag>
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
      
      setSelectedProducts(prev => {
          const combined = [...prev, ...newSelectedRows];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          return unique.filter(p => newSelectedRowKeys.includes(p.id));
      });
    },
  };

  const handleConfirm = () => {
    // if (selectedRowKeys.length === 0) {
    //   message.warning('Vui lòng chọn ít nhất 1 sản phẩm');
    //   return;
    // }
    onConfirm(selectedProducts);
  };

  return (
    <Modal
      open={open}
      title={`🎁 Gắn sản phẩm ưu tiên cho "${sectionTitle}"`}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={1000}
      okText="Xác nhận"
      cancelText="Hủy"
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            style={{ width: 300 }}
            onSearch={setSearchText}
            allowClear
          />
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo danh mục"
            allowClear
            options={(categories ?? []).map(c => ({ label: c.name, value: c.id }))}
            onChange={setSelectedCategory}
          />
          <Tag color="cyan" style={{ fontSize: 13, padding: '4px 8px' }}>
            Đang ghim: {selectedRowKeys.length}/{maxProducts}
          </Tag>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.content ?? []}
        loading={isLoading}
        rowSelection={rowSelection}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data?.totalElements ?? 0,
          onChange: (p, ps) => { setPage(p); setPageSize(ps); }
        }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default ProductSelectorModal;