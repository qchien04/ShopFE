import { Button, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Product } from '../../../../../types/product.type';

interface Props {
  products: Product[];
  loading: boolean;
  onAdd: () => void;
  onRemove: (productId: number) => void;
  helpText?: string;
}

const ProductSelectionTab = ({ products, loading, onAdd, onRemove, helpText }: Props) => {
  return (
    <div className="product-selection-tab" style={{ paddingTop: 16 }}>
      {helpText && (
        <div style={{ marginBottom: 16, color: '#666' }}>
          💡 {helpText}
        </div>
      )}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAdd}
        block
        style={{ marginBottom: 16 }}
      >
        Bấm để chọn/thay đổi sản phẩm
      </Button>

      {products.length > 0 && (
        <Table
          size="small"
          dataSource={products}
          rowKey="id"
          pagination={false}
          loading={loading}
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
              render: (val) => <span style={{ color: 'red' }}>{val?.toLocaleString()}₫</span>
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
                  onClick={() => onRemove(record.id)}
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
};

export default ProductSelectionTab;
