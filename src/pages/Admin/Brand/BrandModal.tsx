// BrandModal.tsx
import { Modal, Form, Space } from "antd";
import { useEffect } from "react";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    if (open) {
      if (brand) {
        form.setFieldsValue({
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          website: brand.website,
          logo: typeof brand.logo === "string"
            ? [{ uid: "-1", name: "logo", status: "done", url: brand.logo }]
            : brand.logo
        });
      } else {
        form.setFieldsValue({
          name: undefined,
          slug: undefined,
          description: undefined,
          website: undefined,
          logo: undefined
        });
      }
    }
  }, [open, brand, form]);

  return (
    <Modal
      open={open}
      width={850}
      className="premium-product-modal"
      title={
        <Space size={8}>
          {brand ? (
            <EditOutlined style={{ color: "#00c853" }} />
          ) : (
            <PlusCircleOutlined style={{ color: "#00c853" }} />
          )}
          <span>{brand ? "Hiệu chỉnh thương hiệu" : "Thêm thương hiệu mới"}</span>
        </Space>
      }
      okText={brand ? "Cập nhật" : "Tạo mới"}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <BrandForm
        form={form}
        initialValues={brand ? {
          name: brand.name,
          slug: brand.slug,
          description: brand.description,
          website: brand.website,
          logo: brand.logo
        } : {}}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default BrandModal;
