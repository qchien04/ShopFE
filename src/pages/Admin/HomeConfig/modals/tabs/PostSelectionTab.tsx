import { Button, Table, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Post } from '../../../../../types/entity.type';

interface Props {
  posts: Post[];
  loading: boolean;
  onAdd: () => void;
  onRemove: (postId: number) => void;
  helpText?: string;
}

const PostSelectionTab = ({ posts, loading, onAdd, onRemove, helpText }: Props) => {
  return (
    <div className="post-selection-tab" style={{ paddingTop: 16 }}>
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
        Bấm để chọn/thay đổi bài viết
      </Button>

      {posts && posts.length > 0 && (
        <Table
          size="small"
          dataSource={posts || []}
          rowKey="id"
          pagination={false}
          loading={loading}
          scroll={{ y: 300 }}
          columns={[
            {
              title: 'Ảnh',
              dataIndex: 'thumbnail',
              width: 70,
              render: (img) => <img src={img} width={40} style={{ borderRadius: 4 }} />
            },
            {
              title: 'Tiêu đề',
              dataIndex: 'title',
              ellipsis: true
            },
            {
              title: 'Chuyên mục',
              dataIndex: 'category',
              width: 150,
              render: (cat) => <Tag color="blue">{cat}</Tag>
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

export default PostSelectionTab;
