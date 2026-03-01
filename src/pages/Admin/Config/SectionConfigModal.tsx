// // components/Admin/Homepage/SectionConfigModal.tsx
// import { useState } from 'react';
// import { 
//   Modal, 
//   Form, 
//   Input, 
//   InputNumber, 
//   Switch, 
//   Button,
//   Select,
//   message,
//   Tabs
// } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import './SectionConfigModal.scss';
// import type { HomepageSection } from './homepage.type';
// import ProductSelectorModal from './Productselectormodal';

// interface Props {
//   open: boolean;
//   section: HomepageSection | null;
//   onCancel: () => void;
//   onSave: (section: HomepageSection) => void;
// }

// const SectionConfigModal = ({ open, section, onCancel, onSave }: Props) => {
//   const [form] = Form.useForm();
//   const [productSelectorOpen, setProductSelectorOpen] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

//   if (!section) return null;

//   const sectionConfigs: Record<string, any> = {
//     banner: {
//       fields: [
//         { name: 'slideCount', label: 'Số lượng slide', type: 'number', min: 1, max: 10 },
//         { name: 'autoplay', label: 'Tự động chuyển', type: 'switch' },
//         { name: 'autoplaySpeed', label: 'Tốc độ chuyển (ms)', type: 'number', min: 1000, max: 10000 }
//       ]
//     },
//     featured_products: {
//       fields: [
//         { name: 'actionCount', label: 'Số lượng quick actions', type: 'number', min: 3, max: 8 }
//       ]
//     },
//     new_products: {
//       fields: [
//         { name: 'productCount', label: 'Số sản phẩm hiển thị', type: 'number', min: 5, max: 20 },
//         { name: 'categoryId', label: 'Lọc theo danh mục', type: 'select', options: [
//           { value: null, label: 'Tất cả' },
//           { value: 1, label: 'Điện gia dụng' },
//           { value: 2, label: 'Linh kiện' }
//         ]},
//         { name: 'sortBy', label: 'Sắp xếp theo', type: 'select', options: [
//           { value: 'newest', label: 'Mới nhất' },
//           { value: 'bestseller', label: 'Bán chạy' },
//           { value: 'price_asc', label: 'Giá tăng dần' },
//           { value: 'price_desc', label: 'Giá giảm dần' }
//         ]}
//       ]
//     },
//     brand_showcase: {
//       fields: [
//         { name: 'brandCount', label: 'Số thương hiệu hiển thị', type: 'number', min: 4, max: 10 },
//         { name: 'autoplay', label: 'Tự động chuyển', type: 'switch' }
//       ]
//     },
//     hot_deals: {
//       fields: [
//         { name: 'hotProducts', label: 'Số sản phẩm nổi bật', type: 'number', min: 3, max: 12 },
//         { name: 'dealProducts', label: 'Số deal hot', type: 'number', min: 3, max: 10 }
//       ]
//     },
//     category_news: {
//       fields: [
//         { name: 'categories', label: 'Số danh mục hiển thị', type: 'number', min: 8, max: 20 },
//         { name: 'news', label: 'Số tin tức hiển thị', type: 'number', min: 4, max: 8 }
//       ]
//     }
//   };

//   const currentConfig = sectionConfigs[section.type] || { fields: [] };

//   const renderField = (field: any) => {
//     switch (field.type) {
//       case 'number':
//         return (
//           <Form.Item
//             key={field.name}
//             name={['config', field.name]}
//             label={field.label}
//             rules={[{ required: true }]}
//           >
//             <InputNumber 
//               min={field.min} 
//               max={field.max} 
//               style={{ width: '100%' }}
//             />
//           </Form.Item>
//         );
      
//       case 'switch':
//         return (
//           <Form.Item
//             key={field.name}
//             name={['config', field.name]}
//             label={field.label}
//             valuePropName="checked"
//           >
//             <Switch />
//           </Form.Item>
//         );
      
//       case 'select':
//         return (
//           <Form.Item
//             key={field.name}
//             name={['config', field.name]}
//             label={field.label}
//             rules={[{ required: true }]}
//           >
//             <Select options={field.options} />
//           </Form.Item>
//         );
      
//       default:
//         return (
//           <Form.Item
//             key={field.name}
//             name={['config', field.name]}
//             label={field.label}
//           >
//             <Input />
//           </Form.Item>
//         );
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       onSave({
//         ...section,
//         ...values,
//         config: {
//           ...section.config,
//           ...values.config,
//           selectedProducts
//         }
//       });
//       message.success('Đã lưu cấu hình section');
//     } catch (error) {
//       console.error('Validation failed:', error);
//     }
//   };

//   const handleProductSelect = (products: any[]) => {
//     setSelectedProducts(products);
//     setProductSelectorOpen(false);
//     message.success(`Đã chọn ${products.length} sản phẩm`);
//   };

//   return (
//     <>
//       <Modal
//         open={open}
//         title={`⚙️ Cấu hình: ${section.title}`}
//         onCancel={onCancel}
//         onOk={handleSave}
//         width={700}
//         okText="Lưu"
//         cancelText="Hủy"
//         className="section-config-modal"
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={{
//             title: section.title,
//             active: section.active,
//             config: section.config
//           }}
//         >
//           <Tabs
//             items={[
//               {
//                 key: 'basic',
//                 label: '🎨 Cơ bản',
//                 children: (
//                   <>
//                     <Form.Item
//                       name="title"
//                       label="Tiêu đề section"
//                       rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
//                     >
//                       <Input placeholder="VD: Sản Phẩm Nổi Bật" />
//                     </Form.Item>

//                     <Form.Item
//                       name="active"
//                       label="Hiển thị trên trang chủ"
//                       valuePropName="checked"
//                     >
//                       <Switch />
//                     </Form.Item>

//                     {currentConfig.fields.map((field: any) => renderField(field))}
//                   </>
//                 )
//               },
//               {
//                 key: 'products',
//                 label: '🎁 Sản phẩm',
//                 children: (
//                   <div className="product-selection-tab">
//                     <p className="help-text">
//                       💡 Chọn sản phẩm cụ thể để hiển thị trong section này. 
//                       Nếu không chọn, hệ thống sẽ tự động lấy sản phẩm theo cấu hình.
//                     </p>

//                     <Button
//                       type="primary"
//                       icon={<PlusOutlined />}
//                       onClick={() => setProductSelectorOpen(true)}
//                       block
//                       size="large"
//                     >
//                       Chọn sản phẩm ({selectedProducts.length})
//                     </Button>

//                     {selectedProducts.length > 0 && (
//                       <div className="selected-products-list">
//                         <h4>Sản phẩm đã chọn:</h4>
//                         <ul>
//                           {selectedProducts.map((p) => (
//                             <li key={p.id}>
//                               <img src={p.mainImage} alt={p.name} />
//                               <span>{p.name}</span>
//                               <small>{p.salePrice.toLocaleString()}₫</small>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )
//               }
//             ]}
//           />
//         </Form>
//       </Modal>

//       <ProductSelectorModal
//         open={productSelectorOpen}
//         onCancel={() => setProductSelectorOpen(false)}
//         onConfirm={handleProductSelect}
//         initialSelected={selectedProducts.map(p => p.id)}
//         maxProducts={section.config?.productCount || 10}
//         sectionTitle={section.title}
//       />
//     </>
//   );
// };

// export default SectionConfigModal;