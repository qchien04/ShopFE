// CategoryForm.tsx
import { Form, Input, Select, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { CategoryFormValues } from "../../../types/request.type";
import { uploadProps } from "../../../utils/uploadProps";
import type { UploadFile } from "antd/lib/upload";
import type { Category } from "../../../types/categories.type";

const { TextArea } = Input;

interface Props {
  form: any;
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: any) => void;
  categories: Category[];
}

const CategoryForm = ({ form, initialValues, onSubmit, categories }: Props) => {
  const normalizeInitialValues = () => {
    if (!initialValues) return undefined;

    let image: UploadFile[] | undefined;

    if (typeof initialValues.image === "string") {
      image = [
        {
          uid: "-1",
          name: "image",
          status: "done",
          url: initialValues.image,
        },
      ];
    } else {
      image = initialValues.image;
    }

    return {
      ...initialValues,
      image,
    };
  };
  return (
    <div className="premium-product-form" style={{ padding: "24px 24px 12px 24px" }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={normalizeInitialValues()}
        onFinish={onSubmit}
      >
        <div className="form-section-card" style={{ padding: 24, margin: 0 }}>
          <Row gutter={24}>
            {/* Left side: Form fields */}
            <Col span={16}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
                  >
                    <Input placeholder="VD: Điện trở / Cảm biến" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="slug"
                    label="Slug danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                  >
                    <Input placeholder="VD: dien-tro-cam-bien" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="parentId" label="Danh mục cấp cha">
                    <Select
                      placeholder="Chọn danh mục cha"
                      allowClear
                      options={categories
                        .filter(c => c.id !== initialValues?.id) // Tránh chọn chính nó làm cha
                        .map(c => ({
                          label: c.name,
                          value: c.id,
                        }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="description" label="Mô tả thông tin" style={{ marginBottom: 0 }}>
                <TextArea rows={4} placeholder="Mô tả ngắn gọn về danh mục..." />
              </Form.Item>
            </Col>

            {/* Right side: Image upload */}
            <Col span={8} style={{ borderLeft: "1px solid #f0f0f0", paddingLeft: 24 }}>
              <Form.Item
                name="image"
                label="Hình ảnh đại diện"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList ?? [];
                }}
                rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
              >
                <Upload
                  {...uploadProps(form, "image")}
                  listType="picture-card"
                  maxCount={1}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default CategoryForm;
