// BrandForm.tsx
import { Form, Input, Upload, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { BrandFormValues } from "../../../types/request.type";
import { uploadProps } from "../../../utils/uploadProps";
import type { UploadFile } from "antd/lib/upload";

const { TextArea } = Input;

interface Props {
  form: any;
  initialValues?: Partial<BrandFormValues>;
  onSubmit: (values: any) => void;
}

const BrandForm = ({ form, initialValues, onSubmit }: Props) => {
  const normalizeInitialValues = () => {
    if (!initialValues) return undefined;

    let logo: UploadFile[] | undefined;

    if (typeof initialValues.logo === "string") {
      logo = [
        {
          uid: "-1",
          name: "logo",
          status: "done",
          url: initialValues.logo,
        },
      ];
    } else {
      logo = initialValues.logo;
    }

    return {
      ...initialValues,
      logo,
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
            {/* Left side: Brand Fields */}
            <Col span={16}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên thương hiệu"
                    rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
                  >
                    <Input placeholder="VD: Arduino / Espressif" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="slug"
                    label="Slug thương hiệu"
                    rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                  >
                    <Input placeholder="VD: arduino" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="website"
                label="Địa chỉ Website"
                rules={[{ required: true, message: "Vui lòng nhập URL website" }]}
              >
                <Input placeholder="VD: https://www.arduino.cc" />
              </Form.Item>

              <Form.Item name="description" label="Mô tả thông tin" style={{ marginBottom: 0 }}>
                <TextArea rows={3} placeholder="Mô tả ngắn gọn về thương hiệu..." />
              </Form.Item>
            </Col>

            {/* Right side: Brand Logo */}
            <Col span={8} style={{ borderLeft: "1px solid #f0f0f0", paddingLeft: 24 }}>
              <Form.Item
                name="logo"
                label="Logo thương hiệu"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList ?? [];
                }}
                rules={[{ required: true, message: "Vui lòng tải lên logo thương hiệu" }]}
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

export default BrandForm;
