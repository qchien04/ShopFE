// SalePostEditor.tsx
// Stack: React + TypeScript + Ant Design + TipTap
// npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image
//   @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-color
//   @tiptap/extension-text-style @tiptap/extension-link

import React, { useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import axios from 'axios';

import {
  Button, Input, Form, Select, Upload, Space, Card,
  Divider, Tooltip, Modal, Row, Col, Typography,
} from 'antd';
import {
  BoldOutlined, ItalicOutlined, UnderlineOutlined,
  OrderedListOutlined, UnorderedListOutlined,
  AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined,
  PictureOutlined, LinkOutlined, EyeOutlined,
  FontSizeOutlined, SaveOutlined, SendOutlined, LoadingOutlined,
} from '@ant-design/icons';
import { TextStyle } from '@tiptap/extension-text-style';
import { antdMessage } from '../../../utils/antdMessage';
import { BASE_URL } from '../../../app/const';

const { Title } = Typography;
const { Option } = Select;

// ========================
// Types
// ========================
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostFormValues {
  title: string;
  category: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface PostPayload extends PostFormValues {
  content: string;
  status: PostStatus;
  updatedAt: string;
}

interface SalePostEditorProps {
  onSave?: (payload: PostPayload) => Promise<void>;
  initialData?: Partial<PostFormValues & { content: string }>;
}

// ========================
// Hàm upload ảnh lên server của bạn
// ========================
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file); // đổi key nếu backend yêu cầu khác

  const res = await axios.post(
    `${BASE_URL}/upload/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return res.data.imageUrl as string;
};

// ========================
// Toolbar Button
// ========================
const ToolbarBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, disabled, onClick }) => (
  <Tooltip title={label}>
    <Button
      size="small"
      type={active ? 'primary' : 'text'}
      icon={icon}
      onClick={onClick}
      disabled={disabled}
      style={{ borderRadius: 6 }}
    />
  </Tooltip>
);

// ========================
// Toolbar
// ========================
const EditorToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload ảnh từ máy → POST lên server → nhận imageUrl → chèn vào editor
  const handleFileUpload = async (file: File): Promise<boolean> => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      antdMessage.success('Upload ảnh thành công!');
    } catch {
      antdMessage.error('Upload ảnh thất bại, thử lại!');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const insertImageByUrl = (): void => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const insertLink = (): void => {
    if (linkUrl.trim()) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const getHeadingValue = (): string => {
    if (editor.isActive('heading', { level: 1 })) return 'h1';
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    if (editor.isActive('heading', { level: 4 })) return 'h4';
    return 'paragraph';
  };

  const handleHeadingChange = (val: string): void => {
    if (val === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(val[1]) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px 12px',
      background: '#fafafa', borderBottom: '1px solid #e8e8e8',
      borderRadius: '8px 8px 0 0', alignItems: 'center',
    }}>
      <Select size="small" style={{ width: 130 }} value={getHeadingValue()} onChange={handleHeadingChange}>
        <Option value="h1"><span style={{ fontWeight: 700, fontSize: 16 }}>Tiêu đề 1</span></Option>
        <Option value="h2"><span style={{ fontWeight: 700, fontSize: 14 }}>Tiêu đề 2</span></Option>
        <Option value="h3"><span style={{ fontWeight: 600, fontSize: 13 }}>Tiêu đề 3</span></Option>
        <Option value="h4"><span style={{ fontWeight: 600, fontSize: 12 }}>Tiêu đề 4</span></Option>
        <Option value="paragraph">Đoạn văn</Option>
      </Select>

      <Divider orientation="vertical" style={{ margin: '0 4px' }} />

      <ToolbarBtn icon={<BoldOutlined />} label="In đậm (Ctrl+B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarBtn icon={<ItalicOutlined />} label="In nghiêng (Ctrl+I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarBtn icon={<UnderlineOutlined />} label="Gạch chân (Ctrl+U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} />

      <Divider orientation="vertical" style={{ margin: '0 4px' }} />

      <Tooltip title="Màu chữ">
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          style={{ width: 28, height: 28, border: '1px solid #d9d9d9', borderRadius: 4, cursor: 'pointer', padding: 2 }}
        />
      </Tooltip>

      <Divider orientation="vertical" style={{ margin: '0 4px' }} />

      <ToolbarBtn icon={<UnorderedListOutlined />} label="Danh sách chấm" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarBtn icon={<OrderedListOutlined />} label="Danh sách số" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} />

      <Divider orientation="vertical" style={{ margin: '0 4px' }} />

      <ToolbarBtn icon={<AlignLeftOutlined />} label="Căn trái" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} />
      <ToolbarBtn icon={<AlignCenterOutlined />} label="Căn giữa" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} />
      <ToolbarBtn icon={<AlignRightOutlined />} label="Căn phải" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} />

      <Divider orientation="vertical" style={{ margin: '0 4px' }} />

      {/* Upload ảnh từ máy → lên server của bạn */}
      <Upload
        beforeUpload={(file: File) => { handleFileUpload(file); return false; }}
        showUploadList={false}
        accept="image/*"
        disabled={uploading}
      >
        <Tooltip title="Upload ảnh từ máy">
          <Button size="small" type="text" disabled={uploading}
            icon={uploading ? <LoadingOutlined /> : <PictureOutlined />} />
        </Tooltip>
      </Upload>

      {/* Chèn ảnh qua URL */}
      <ToolbarBtn icon={<PictureOutlined style={{ color: '#52c41a' }} />} label="Chèn ảnh từ URL" onClick={() => setShowImageModal(true)} />

      {/* Link */}
      <ToolbarBtn icon={<LinkOutlined style={{ color: '#1890ff' }} />} label="Chèn link" active={editor.isActive('link')} onClick={() => setShowLinkModal(true)} />

      {/* Blockquote */}
      <Tooltip title="Trích dẫn">
        <Button size="small" type={editor.isActive('blockquote') ? 'primary' : 'text'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={{ borderRadius: 6, fontStyle: 'italic', fontWeight: 700 }}>❝</Button>
      </Tooltip>

      <Modal title="Chèn ảnh từ URL" open={showImageModal} onOk={insertImageByUrl}
        onCancel={() => setShowImageModal(false)} okText="Chèn" cancelText="Hủy">
        <Input placeholder="https://example.com/image.jpg" value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} onPressEnter={insertImageByUrl} />
      </Modal>

      <Modal title="Chèn link" open={showLinkModal} onOk={insertLink}
        onCancel={() => setShowLinkModal(false)} okText="Chèn" cancelText="Hủy">
        <Input placeholder="https://example.com" value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)} onPressEnter={insertLink} />
      </Modal>
    </div>
  );
};

// ========================
// SalePostEditor - Main
// ========================
const SalePostEditor: React.FC<SalePostEditorProps> = ({ onSave, initialData }) => {
  const [form] = Form.useForm<PostFormValues>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener' } }),
    ],
    content: initialData?.content ?? '<p>Bắt đầu viết nội dung bài sale của bạn...</p>',
    editorProps: {
      attributes: { class: 'sale-editor-content', style: 'min-height: 400px; outline: none;' },
    },
  });

  // Upload thumbnail
  const handleThumbUpload = async (file: File): Promise<boolean> => {
    try {
      setThumbUploading(true);
      const url = await uploadImage(file);
      form.setFieldValue('thumbnail', url);
      antdMessage.success('Upload ảnh đại diện thành công!');
    } catch {
      antdMessage.error('Upload thất bại!');
    } finally {
      setThumbUploading(false);
    }
    return false;
  };

  const handleSave = async (status: PostStatus): Promise<void> => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      const payload: PostPayload = {
        ...values,
        content: editor?.getHTML() ?? '',
        status,
        updatedAt: new Date().toISOString(),
      };
      await onSave?.(payload);
      antdMessage.success(status === 'DRAFT' ? 'Đã lưu nháp!' : 'Đã đăng bài thành công!');
    } catch {
      antdMessage.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    } finally {
      setSaving(false);
    }
  };

  const thumbnailValue = Form.useWatch('thumbnail', form);

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px' }}>
      <Card
        title={
          <Space>
            <FontSizeOutlined style={{ color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>
              {initialData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết sale mới'}
            </Title>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>Xem trước</Button>
            <Button icon={<SaveOutlined />} onClick={() => handleSave('DRAFT')} loading={saving}>Lưu nháp</Button>
            <Button type="primary" icon={<SendOutlined />} onClick={() => handleSave('PUBLISHED')} loading={saving}>Đăng bài</Button>
          </Space>
        }
        styles={{ body: { padding: 24 } }}
      >
        <Form form={form} layout="vertical" initialValues={initialData}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề!' }]}>
                <Input size="large" placeholder="Ví dụ: Sale 50% toàn bộ sản phẩm mùa hè 2025" style={{ fontWeight: 600 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Chọn danh mục!' }]}>
                <Select size="large" placeholder="Chọn danh mục">
                  <Option value="meo-vat">Mẹo vặt</Option>
                  <Option value="huong-dan">Hướng dẫn sử dụng sản phẩm</Option>
                  <Option value="tin-tuc">Tin tức</Option>
                  <Option value="khuyen-mai">Khuyến mãi</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả ngắn (SEO)" name="description">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn hiển thị trên Google..." showCount maxLength={160} />
          </Form.Item>

          {/* Thumbnail: upload hoặc nhập URL */}
          <Form.Item label="Ảnh đại diện" name="thumbnail">
            <Row gutter={8} align="middle">
              <Col flex="auto">
                <Input
                  placeholder="URL ảnh hoặc upload từ máy →"
                  prefix={<PictureOutlined />}
                  value={thumbnailValue}
                  onChange={(e) => form.setFieldValue('thumbnail', e.target.value)}
                />
              </Col>
              <Col>
                <Upload beforeUpload={(f: File) => { handleThumbUpload(f); return false; }} showUploadList={false} accept="image/*">
                  <Button icon={thumbUploading ? <LoadingOutlined /> : <PictureOutlined />} disabled={thumbUploading}>
                    Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
            {thumbnailValue && (
              <img src={thumbnailValue} alt="preview"
                style={{ marginTop: 8, maxHeight: 120, borderRadius: 6, objectFit: 'cover' }} />
            )}
          </Form.Item>

          <Form.Item label="Tags" name="tags">
            <Select mode="tags" placeholder="Nhập tag rồi Enter: sale, khuyến mãi..." style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Nội dung bài viết" required>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
              {editor && <EditorToolbar editor={editor} />}
              <div style={{ padding: '16px 20px', background: '#fff' }}>
                <EditorContent editor={editor} />
              </div>
            </div>
          </Form.Item>
        </Form>
      </Card>

      {/* Preview */}
      <Modal title="Xem trước" open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={null} width={800} style={{ top: 20 }}>
        <article style={{ padding: '8px 0' }}>
          <Title level={2}>{form.getFieldValue('title') || 'Tiêu đề bài viết'}</Title>
          {thumbnailValue && (
            <img src={thumbnailValue} alt="thumb"
              style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
          )}
          <div className="post-content" dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? '' }} />
        </article>
      </Modal>

      <style>{POST_CONTENT_CSS}</style>
    </div>
  );
};

export default SalePostEditor;

// ========================
// CSS dùng chung cho cả editor lẫn trang hiển thị bài viết
// Tách ra file: src/styles/postContent.css hoặc postContent.ts
// ========================
export const POST_CONTENT_CSS = `
  .post-content, .sale-editor-content {
    font-size: 16px;
    line-height: 1.85;
    color: #1a1a1a;
  }
  .post-content h1, .sale-editor-content h1 {
    font-size: 2.2em; font-weight: 800; margin: 24px 0 12px; line-height: 1.25;
  }
  .post-content h2, .sale-editor-content h2 {
    font-size: 1.7em; font-weight: 700; margin: 20px 0 10px;
    border-bottom: 2px solid #f0f0f0; padding-bottom: 6px;
  }
  .post-content h3, .sale-editor-content h3 {
    font-size: 1.35em; font-weight: 600; margin: 16px 0 8px;
  }
  .post-content h4, .sale-editor-content h4 {
    font-size: 1.1em; font-weight: 600; margin: 12px 0 6px;
  }
  .post-content p, .sale-editor-content p { margin: 0 0 14px; }
  .post-content strong, .sale-editor-content strong { font-weight: 700; }
  .post-content em, .sale-editor-content em { font-style: italic; }
  .post-content ul, .sale-editor-content ul { padding-left: 28px; margin: 12px 0; list-style-type: disc; }
  .post-content ol, .sale-editor-content ol { padding-left: 28px; margin: 12px 0; list-style-type: decimal; }
  .post-content li, .sale-editor-content li { margin: 6px 0; }
  .post-content img, .sale-editor-content img {
    max-width: 100%; height: auto; border-radius: 8px;
    margin: 16px auto; display: block; box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
  .post-content blockquote, .sale-editor-content blockquote {
    border-left: 4px solid #1890ff; margin: 20px 0; padding: 12px 20px;
    background: #f0f7ff; border-radius: 0 8px 8px 0;
    font-style: italic; color: #444; font-size: 1.05em;
  }
  .post-content a, .sale-editor-content a { color: #1890ff; text-decoration: underline; }
  .sale-editor-content .ProseMirror-focused { outline: none; }
`;