// CategoryModal.tsx
import { Modal, Form } from "antd";
import CategoryForm from "./CategoryForm";
import type { Category } from "../../../types/categories.type";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  category?: Category | null;
}

const CategoryModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  category,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        image: category.image
          ? [
              {
                uid: "-1",
                name: "image",
                status: "done",
                url: category.image,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  return (
    <Modal
      open={open}
      title={category ? "✏️ Sửa danh mục" : "➕ Thêm danh mục"}
      okText={category ? "Cập nhật" : "Tạo"}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <CategoryForm
        form={form}
        key={category?.id ?? "create"}
        initialValues={category ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon:category.icon,
          image: category.image
        } : {}}
        onSubmit={onSubmit}   // ⬅ truyền xuống
      />
    </Modal>

  );
};

export default CategoryModal;
