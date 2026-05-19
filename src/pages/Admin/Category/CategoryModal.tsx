// CategoryModal.tsx
import { Modal, Form, Space } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import CategoryForm from "./CategoryForm";
import type { Category } from "../../../types/categories.type";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  category?: Category | null;
  categories: Category[];
}

const CategoryModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  category,
  categories,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        parentId: category.parentId,
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
      width={850}
      className="premium-product-modal"
      title={
        <Space size={8}>
          {category ? (
            <EditOutlined style={{ color: "#00c853" }} />
          ) : (
            <PlusCircleOutlined style={{ color: "#00c853" }} />
          )}
          <span>{category ? "Hiệu chỉnh danh mục" : "Thêm danh mục mới"}</span>
        </Space>
      }
      okText={category ? "Cập nhật" : "Tạo mới"}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <CategoryForm
        form={form}
        key={category?.id ?? "create"}
        initialValues={category ? {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon:category.icon,
          image: category.image,
          parentId: category.parentId
        } : {}}
        categories={categories}
        onSubmit={onSubmit}   // ⬅ truyền xuống
      />
    </Modal>

  );
};

export default CategoryModal;
