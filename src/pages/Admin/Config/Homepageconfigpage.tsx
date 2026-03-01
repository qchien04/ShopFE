// // pages/Admin/Homepage/HomepageConfigPage.tsx
// import React, { useState } from 'react';
// import { 
//   Card, 
//   Tabs, 
//   Button, 
//   Space, 
//   Switch, 
//   List,
//   Tag,
//   Modal,
//   message
// } from 'antd';
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   DragOutlined,
//   EyeOutlined
// } from '@ant-design/icons';
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import './HomepageConfigPage.scss';
// import type { HomepageSection } from './homepage.type';

// // Component cho mỗi section có thể kéo thả
// const SortableSection = ({ section, onEdit, onDelete, onToggle }: any) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//   } = useSortable({ id: section.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   const sectionIcons: Record<string, string> = {
//     banner: '🎨',
//     featured_products: '⭐',
//     new_products: '🔥',
//     brand_showcase: '🏷️',
//     hot_deals: '💥',
//     category_news: '📰'
//   };

//   const sectionNames: Record<string, string> = {
//     banner: 'Banner Carousel',
//     featured_products: 'Sản Phẩm Nổi Bật',
//     new_products: 'Sản Phẩm Mới',
//     brand_showcase: 'Thương Hiệu',
//     hot_deals: 'Deal Hot',
//     category_news: 'Danh Mục & Tin Tức'
//   };

//   return (
//     <div ref={setNodeRef} style={style} className="sortable-section">
//       <Card className="section-card">
//         <div className="section-header">
//           <div className="section-info">
//             <Button 
//               type="text" 
//               icon={<DragOutlined />} 
//               {...listeners} 
//               {...attributes}
//               className="drag-handle"
//             />
//             <span className="section-icon">{sectionIcons[section.type]}</span>
//             <div>
//               <h4>{section.title || sectionNames[section.type]}</h4>
//               <p className="section-type">
//                 <Tag color="blue">{section.type}</Tag>
//                 {section.config?.productCount && (
//                   <Tag>{section.config.productCount} sản phẩm</Tag>
//                 )}
//               </p>
//             </div>
//           </div>

//           <Space>
//             <Switch 
//               checked={section.active} 
//               onChange={() => onToggle(section.id)}
//               checkedChildren="Hiện"
//               unCheckedChildren="Ẩn"
//             />
//             <Button 
//               icon={<EditOutlined />} 
//               onClick={() => onEdit(section)}
//             >
//               Chỉnh sửa
//             </Button>
//             <Button 
//               danger 
//               icon={<DeleteOutlined />}
//               onClick={() => onDelete(section.id)}
//             />
//           </Space>
//         </div>

//         <div className="section-preview">
//           <small className="text-muted">
//             Thứ tự: {section.order} | 
//             Trạng thái: {section.active ? '✅ Đang hiển thị' : '❌ Đang ẩn'}
//           </small>
//         </div>
//       </Card>
//     </div>
//   );
// };

// const HomepageConfigPage = () => {
//   const [sections, setSections] = useState<HomepageSection[]>([
//     {
//       id: 1,
//       type: 'banner',
//       title: 'Banner Trang Chủ',
//       active: true,
//       order: 1,
//       config: { slideCount: 2 }
//     },
//     {
//       id: 2,
//       type: 'featured_products',
//       title: 'Quick Actions',
//       active: true,
//       order: 2,
//       config: { actionCount: 5 }
//     },
//     {
//       id: 3,
//       type: 'new_products',
//       title: 'Sản Phẩm Mới',
//       active: true,
//       order: 3,
//       config: { productCount: 10, categoryId: null }
//     },
//     {
//       id: 4,
//       type: 'brand_showcase',
//       title: 'Mua Nhiều Giá Sỉ',
//       active: true,
//       order: 4,
//       config: { brandCount: 6 }
//     },
//     {
//       id: 5,
//       type: 'hot_deals',
//       title: 'Sản Phẩm Nổi Bật & Deal Hot',
//       active: true,
//       order: 5,
//       config: { hotProducts: 6, dealProducts: 5 }
//     },
//     {
//       id: 6,
//       type: 'category_news',
//       title: 'Danh Mục Nổi Bật & Tin Tức',
//       active: true,
//       order: 6,
//       config: { categories: 16, news: 4 }
//     }
//   ]);

//   const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
    
//     if (active.id !== over.id) {
//       setSections((items) => {
//         const oldIndex = items.findIndex(i => i.id === active.id);
//         const newIndex = items.findIndex(i => i.id === over.id);
        
//         const newItems = [...items];
//         const [removed] = newItems.splice(oldIndex, 1);
//         newItems.splice(newIndex, 0, removed);
        
//         // Update order
//         return newItems.map((item, index) => ({
//           ...item,
//           order: index + 1
//         }));
//       });
      
//       message.success('Đã cập nhật thứ tự sections');
//     }
//   };

//   const handleToggle = (id: number) => {
//     setSections(sections.map(s => 
//       s.id === id ? { ...s, active: !s.active } : s
//     ));
//   };

//   const handleEdit = (section: HomepageSection) => {
//     setEditingSection(section);
//     // Open edit modal
//   };

//   const handleDelete = (id: number) => {
//     Modal.confirm({
//       title: 'Xóa section này?',
//       content: 'Bạn có chắc muốn xóa section này khỏi trang chủ?',
//       okText: 'Xóa',
//       cancelText: 'Hủy',
//       okButtonProps: { danger: true },
//       onOk: () => {
//         setSections(sections.filter(s => s.id !== id));
//         message.success('Đã xóa section');
//       }
//     });
//   };

//   const handleSave = () => {
//     // Call API to save configuration
//     message.success('Đã lưu cấu hình trang chủ');
//   };

//   const handlePreview = () => {
//     // Open preview in new tab
//     window.open('/', '_blank');
//   };

//   return (
//     <div className="homepage-config-page">
//       <div className="page-header">
//         <div>
//           <h2>🏠 Quản Lý Trang Chủ</h2>
//           <p className="text-muted">
//             Tùy chỉnh layout và nội dung hiển thị trên trang chủ
//           </p>
//         </div>
//         <Space>
//           <Button icon={<EyeOutlined />} onClick={handlePreview}>
//             Xem trước
//           </Button>
//           <Button type="primary" onClick={handleSave}>
//             💾 Lưu cấu hình
//           </Button>
//         </Space>
//       </div>

//       <Tabs
//         defaultActiveKey="sections"
//         items={[
//           {
//             key: 'sections',
//             label: '📦 Quản lý Sections',
//             children: (
//               <Card>
//                 <div className="sections-toolbar">
//                   <h3>Danh sách Sections</h3>
//                   <Button type="primary" icon={<PlusOutlined />}>
//                     Thêm Section
//                   </Button>
//                 </div>

//                 <p className="help-text">
//                   💡 Kéo thả để sắp xếp lại thứ tự hiển thị trên trang chủ
//                 </p>

//                 <DndContext 
//                   collisionDetection={closestCenter}
//                   onDragEnd={handleDragEnd}
//                 >
//                   <SortableContext 
//                     items={sections.map(s => s.id)}
//                     strategy={verticalListSortingStrategy}
//                   >
//                     <div className="sections-list">
//                       {sections.map(section => (
//                         <SortableSection
//                           key={section.id}
//                           section={section}
//                           onEdit={handleEdit}
//                           onDelete={handleDelete}
//                           onToggle={handleToggle}
//                         />
//                       ))}
//                     </div>
//                   </SortableContext>
//                 </DndContext>
//               </Card>
//             )
//           },
//           {
//             key: 'products',
//             label: '🎁 Sản phẩm đề xuất',
//             children: (
//               <Card>
//                 <h3>Quản lý sản phẩm hiển thị</h3>
//                 <p>Content for managing featured products...</p>
//               </Card>
//             )
//           },
//           {
//             key: 'banners',
//             label: '🎨 Banner & Slides',
//             children: (
//               <Card>
//                 <h3>Quản lý Banner</h3>
//                 <p>Content for managing banners...</p>
//               </Card>
//             )
//           }
//         ]}
//       />
//     </div>
//   );
// };

// export default HomepageConfigPage;