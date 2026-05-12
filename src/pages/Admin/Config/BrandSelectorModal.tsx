import { useState, useEffect } from 'react';
import { Modal, Table, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { brandApi } from '../../../api/brand.api';
import type { Brand } from '../../../types/entity.type';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: (brands: Brand[]) => void;
  initialSelected: number[];
}

const BrandSelectorModal = ({ open, onCancel, onConfirm, initialSelected }: Props) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (open) {
      fetchBrands();
      setSelectedRowKeys(initialSelected);
    }
  }, [open, initialSelected]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await brandApi.getAll();
      setBrands(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const selectedBrands = brands.filter(b => selectedRowKeys.includes(b.id!));
    onConfirm(selectedBrands);
  };

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 80,
      render: (logo: string) => <img src={logo} alt="logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />,
    },
    {
      title: 'Tên thương hiệu',
      dataIndex: 'name',
    },
    {
        title: 'Website',
        dataIndex: 'website',
    }
  ];

  return (
    <Modal
      title="Chọn Thương Hiệu Nổi Bật"
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={600}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Input
        placeholder="Tìm kiếm thương hiệu..."
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
        dataSource={filteredBrands}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        size="small"
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default BrandSelectorModal;
