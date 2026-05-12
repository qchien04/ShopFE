// pages/Admin/Homepage/HomepageConfigPage.tsx
import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Switch,
  Tag,
  Modal,
  message,
  Spin
} from 'antd';
import {
  EditOutlined,
  DragOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { BannerConfig, ProductSectionConfig } from '../../../types/entity.type';
import SectionConfigModal from './SectionConfigModal';
import './HomepageConfigPage.scss';

export const DEFAULT_SECTIONS: ProductSectionConfig[] = [
  { id: 'featured_products', title: 'Sản Phẩm Nổi Bật', productIds: [], active: true, productCount: 10 },
  { id: 'new_products', title: 'Sản Phẩm Mới', productIds: [], active: true, productCount: 10 },
  { id: 'brand_showcase', title: 'Thương Hiệu Nổi Bật', productIds: [], brandIds: [], active: true, productCount: 10 },
  { id: 'hot_deals', title: 'Deal Hot', productIds: [], active: true, productCount: 12 },
  { id: 'category_news', title: 'Danh Mục & Tin Tức', productIds: [], active: true, productCount: 10 },
];

const SortableSection = ({ section, onEdit, onToggle }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sectionIcons: Record<string, string> = {
    featured_products: '⭐',
    new_products: '🔥',
    brand_showcase: '🏷️',
    hot_deals: '💥',
    category_news: '📰'
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-section">
      <Card className="section-card" bodyStyle={{ padding: 16 }}>
        <div className="section-header">
          <div className="section-info">
            <div
              {...listeners}
              {...attributes}
              className="drag-handle"
            >
              <DragOutlined />
            </div>
            <span className="section-icon">{sectionIcons[section.id] || '🎁'}</span>
            <div>
              <h4>{section.title}</h4>
              <p className="section-type">
                <Tag color="cyan">Số lượng tối đa: {section.productCount || 10}</Tag>
                <Tag color="blue">Sản phẩm đã ghim: {section.productIds?.length || 0}</Tag>
              </p>
            </div>
          </div>

          <Space>
            <Switch
              checked={section.active}
              onChange={() => onToggle(section.id)}
              checkedChildren="Hiện"
              unCheckedChildren="Ẩn"
            />
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(section)}
            >
              Cấu hình
            </Button>
          </Space>
        </div>

        <div className="section-preview" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          <small className="text-muted">
            Trạng thái: {section.active ? ' Đang hiển thị ở Trang Chủ' : '❌ Đang ẩn'}
          </small>
        </div>
      </Card>
    </div>
  );
};

const HomepageConfigPage = ({ 
  productSections, 
  setProductSections,
  brandIds,
  setBrandIds
}: { 
  productSections: ProductSectionConfig[], 
  setProductSections: any,
  brandIds: number[],
  setBrandIds: any
}) => {
  const [editingSection, setEditingSection] = useState<ProductSectionConfig | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = productSections.findIndex(i => i.id === active.id);
      const newIndex = productSections.findIndex(i => i.id === over.id);
      const newList = [...productSections];
      const [removed] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, removed);
      setProductSections(newList);
    }
  };

  const handleToggle = (id: string) => {
    setProductSections(prev => prev.map(s =>
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const handleEdit = (section: ProductSectionConfig) => {
    setEditingSection(section);
    setModalOpen(true);
  };

  const handleSaveModal = (updated: ProductSectionConfig, newBrandIds?: number[]) => {
    setProductSections(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (newBrandIds) {
      setBrandIds(newBrandIds);
    }
    setModalOpen(false);
  };

  return (
    <div className="homepage-config-page">
      <div className="page-header">
        <div>
          <h2>🏠 Cấu hình Component Trang Chủ</h2>
          <p className="text-muted">Quản lý và sắp xếp thứ tự các khối hiển thị ở HomePage</p>
        </div>
      </div>

      <div className="help-text">
        💡 Kéo thả góc trái mỗi block để sắp xếp lại thứ tự hiển thị trên màn hình trang chủ nha. Bấm "Cấu hình" để chọn sản phẩm.
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={productSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="sections-list">
            {productSections.map(s => (
              <SortableSection
                key={s.id}
                section={s}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <SectionConfigModal
        open={modalOpen}
        section={editingSection}
        onCancel={() => setModalOpen(false)}
        onSave={handleSaveModal}
        currentBrandIds={brandIds}
      />
    </div>
  );
};

export default HomepageConfigPage;