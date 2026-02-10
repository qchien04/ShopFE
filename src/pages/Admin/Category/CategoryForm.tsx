// CategoryForm.tsx
import { Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { CategoryFormValues } from "../../../types/request.type";
import { uploadProps } from "../../../utils/uploadProps";
import type { UploadFile } from "antd/lib/upload";

const { TextArea } = Input;

interface Props {
  form: any;
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (values: any) => void;
}

const CategoryForm = ({ form, initialValues, onSubmit }: Props) => {
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
    <Form
      form={form}
      layout="vertical"
      initialValues={normalizeInitialValues()}
      onFinish={onSubmit}
    >
      <Form.Item
        name="name"
        label="Tên danh mục"
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
        name="icon"
        label="Icon"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="image"
        label="Ảnh"
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

export default CategoryForm;
