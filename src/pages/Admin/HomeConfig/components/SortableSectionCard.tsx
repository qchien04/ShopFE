import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Space, Typography, Button } from 'antd';
import { EditOutlined, HolderOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export const SortableSectionCard = ({ id, icon, title, section, onEdit, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'default',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="section-config-card" bordered={false}>
        <div className="section-card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="large">
            <div {...listeners} style={{ cursor: 'grab', padding: '0 8px' }}>
              <HolderOutlined style={{ fontSize: 20, color: '#999' }} />
            </div>
            <div className="section-card-icon">{icon}</div>
            <div>
              <Title level={5} style={{ margin: 0 }}>{title}</Title>
              <Text type="secondary">{section.active ? '✅ Đang hiển thị' : '❌ Đang ẩn'}</Text>
            </div>
          </Space>
          <Space>
            <Button icon={<EditOutlined />} onClick={onEdit}>Cấu hình</Button>
            {onDelete && <Button danger icon={<DeleteOutlined />} onClick={onDelete}></Button>}
          </Space>
        </div>
      </Card>
    </div>
  );
};
