import { Button, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Brand } from '../../../../../types/entity.type';

interface Props {
  brands: Brand[];
  loading: boolean;
  onAdd: () => void;
  onRemove: (brandId: number) => void;
}

const BrandSelectionTab = ({ brands, loading, onAdd, onRemove }: Props) => {
  return (
    <div className="brand-selection-tab" style={{ paddingTop: 16 }}>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAdd}
        block
        style={{ marginBottom: 16 }}
      >
        Bấm để chọn/thay đổi thương hiệu
      </Button>

      {brands.length > 0 && (
        <Table
          size="small"
          dataSource={brands}
          rowKey="id"
          pagination={false}
          loading={loading}
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
                  onClick={() => onRemove(record.id!)}
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
};

export default BrandSelectionTab;
