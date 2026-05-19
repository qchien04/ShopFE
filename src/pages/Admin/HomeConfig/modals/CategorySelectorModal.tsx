import { useState, useEffect } from 'react';
import { Modal, Table, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { categoryApi } from '../../../../api/categories.api';
import type { Category } from '../../../../types/categories.type';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (categories: Category[]) => void;
  initialSelected: number[];
}

const CategorySelectorModal = ({ open, onCancel, onConfirm, initialSelected }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (open) {
      fetchCategories();
      setSelectedRowKeys(initialSelected);
    }
  }, [open, initialSelected]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const selectedCategories = categories.filter(c => selectedRowKeys.includes(c.id as number));
    onConfirm(selectedCategories);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      width: 80,
      render: (image: string) => <img src={image || '/placeholder.png'} alt="img" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }} />,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
    }
  ];

  return (
    <Modal
      title="Chọn Danh Mục"
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={600}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Input
        placeholder="Tìm kiếm danh mục..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default CategorySelectorModal;
