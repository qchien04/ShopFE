import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";

const EditableSlot = ({ children, label, onClick }: {
  children: React.ReactNode; label: string; onClick: () => void;
}) => (
  <Tooltip title={`Chỉnh sửa: ${label}`} placement="top">
    <div className="editable-slot" onClick={onClick}>
      {children}
      <div className="editable-slot__overlay">
        <div className="editable-slot__badge"><EditOutlined /> Chỉnh sửa</div>
      </div>
    </div>
  </Tooltip>
);
export default EditableSlot;