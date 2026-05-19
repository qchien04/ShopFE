import { Button, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Category } from '../../../../../types/categories.type';

interface Props {
  categories: Category[];
  loading: boolean;
  onAdd: () => void;
  onRemove: (categoryId: number) => void;
}

const CategorySelectionTab = ({ categories, loading, onAdd, onRemove }: Props) => {
  return (
    <div className="category-selection-tab" style={{ paddingTop: 16 }}>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onAdd}
        block
        style={{ marginBottom: 16 }}
      >
        Bấm để chọn/thay đổi danh mục hiển thị
      </Button>

      {categories.length > 0 && (
        <Table
          size="small"
          dataSource={categories}
          rowKey="id"
          pagination={false}
          loading={loading}
          scroll={{ y: 300 }}
          columns={[
            {
              title: 'Hình ảnh',
              dataIndex: 'image',
              width: 80,
              render: (img) => <img src={img || '/placeholder.png'} width={40} style={{ borderRadius: 4, objectFit: 'contain' }} />
            },
            {
              title: 'Tên danh mục',
              dataIndex: 'name',
              ellipsis: true
            },
            {
              title: 'Gỡ',
              width: 80,
              align: 'center',
              render: (_, record) => (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onRemove(record.id as number)}
                />
              )
            }
          ]}
        />
      )}
    </div>
  );
};

export default CategorySelectionTab;
