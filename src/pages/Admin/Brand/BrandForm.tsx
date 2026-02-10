// BrandForm.tsx
import { Form, Input, Upload } from "antd";
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
    <Form
      form={form}
      layout="vertical"
      initialValues={normalizeInitialValues()}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        label="Tên brand"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

       <Form.Item
        name="website"
        label="Website"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="logo"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) return e;
          return e?.fileList ?? [];
        }}
        rules={[{ required: true }]}
      >
        <Upload
          {...uploadProps(form, "image")}
          listType="picture-card"
          maxCount={1}
        >
          <PlusOutlined />
        </Upload>
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <TextArea rows={3} />
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
