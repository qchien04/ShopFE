import {
 CheckOutlined,
} from "@ant-design/icons";
import { Typography } from "antd";
const { Text } = Typography;


export const PaymentMethodCard = ({
  selected, onClick, icon, title, desc,
}: {
  selected: boolean; onClick: () => void;
  icon: React.ReactNode; title: string; desc: string;
}) => (
  <div
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      border: `2px solid ${selected ? "#00b96b" : "#e5e7eb"}`,
      borderRadius: 12,
      background: selected ? "#f0faf5" : "#fff",
      cursor: "pointer", transition: "all 0.2s", userSelect: "none",
    }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: selected ? "#00b96b" : "#f3f4f6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, color: selected ? "#fff" : "#6b7280",
      flexShrink: 0, transition: "all 0.2s",
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <Text strong style={{ display: "block", fontSize: 14, color: selected ? "#065f46" : "#111827" }}>
        {title}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>{desc}</Text>
    </div>
    <div style={{
      width: 20, height: 20, borderRadius: "50%",
      border: `2px solid ${selected ? "#00b96b" : "#d1d5db"}`,
      background: selected ? "#00b96b" : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, transition: "all 0.2s",
    }}>
      {selected && <CheckOutlined style={{ fontSize: 10, color: "#fff" }} />}
    </div>
  </div>
);
