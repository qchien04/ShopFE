// src/components/AddressCard/AddressCard.tsx
import { Button, Tag, Tooltip } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  AimOutlined,
} from "@ant-design/icons";
import type { CustomerAddress } from "../../types/entity.type";
import "./AddressCard.css";

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
    <div className={`address-card ${address.isDefault ? "address-card--default" : ""}`}>
      {/* Default badge */}
      {address.isDefault && (
        <div className="address-card__badge">
          Mặc định
        </div>
      )}

      {/* Header */}
      <div className="address-card__header">
        <div className="address-card__avatar">
          <UserOutlined />
        </div>
        <div className="address-card__info">
          <span className="address-card__name">{address.fullName}</span>
          <span className="address-card__phone">
            <PhoneOutlined style={{ marginRight: 5 }} />
            {address.phone}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="address-card__divider" />

      {/* Address */}
      <div className="address-card__address">
        <EnvironmentOutlined className="address-card__address-icon" />
        <span>{address.detailAddress}</span>
      </div>

      {/* Coords */}
      {address.lat && address.lng && (
        <div className="address-card__coords">
          <AimOutlined style={{ marginRight: 4 }} />
          {address.lat.toFixed(5)}, {address.lng.toFixed(5)}
        </div>
      )}

      {/* Actions */}
      <div className="address-card__actions">
        <Tooltip title="Chỉnh sửa">
          <Button
            className="address-card__btn address-card__btn--edit"
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Sửa
          </Button>
        </Tooltip>

        <Tooltip title="Xoá địa chỉ">
          <Button
            className="address-card__btn address-card__btn--delete"
            icon={<DeleteOutlined />}
            onClick={onDelete}
            danger
          >
            Xoá
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
