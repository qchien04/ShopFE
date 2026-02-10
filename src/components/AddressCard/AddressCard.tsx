// src/pages/Address/AddressCard.tsx
import { Card, Button, Tag, Space } from "antd";
import type { CustomerAddress } from "../../types/entity.type";

interface Props {
  address: CustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <Card
      style={{ borderRadius: 12 }}
      title={
        <Space>
          {address.fullName}
          {address.isDefault && <Tag color="green">Mặc định</Tag>}
        </Space>
      }
      extra={<span>{address.phone}</span>}
    >
      <p>
        {address.detailAddress}, {address.ward}, {address.district},{" "}
        {address.province}
      </p>

      <Space>
        <Button size="small" onClick={onEdit}>Sửa</Button>
        <Button size="small" danger onClick={onDelete}>Xoá</Button>
        {!address.isDefault && (
          <Button size="small" type="link" onClick={onSetDefault}>
            Đặt mặc định
          </Button>
        )}
      </Space>
    </Card>
  );
}
