// BrandModal.tsx
import { Modal, Form } from "antd";
import BrandForm from "./BrandForm";
import type { Brand } from "../../../types/entity.type";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  brand?: Brand | null;
}

const BrandModal = ({
  open,
  onCancel,
  onSubmit,
  loading,
  brand,
}: Props) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title={brand ? "✏️ Sửa brand" : "➕ Thêm brand"}
      okText={brand ? "Cập nhật" : "Tạo"}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      destroyOnHidden   // ⬅ sửa luôn lỗi phụ bên dưới
    >
      <BrandForm
        form={form}
        initialValues={brand ? {
          name: brand.name,
          slug: brand.slug,
          description: brand.description,     
          website:brand.website,
          logo: brand.logo
        } : {}}
        onSubmit={onSubmit}   // ⬅ truyền xuống
      />
    </Modal>

  );
};

export default BrandModal;
