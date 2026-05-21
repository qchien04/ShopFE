import { Button, Divider, Modal, QRCode, Space, Spin, Typography } from "antd"
import React from "react";
const { Title: CTitle, Text } = Typography;

interface Props {
  payModalVisible: boolean;
  setPayModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  payData: any;
  onClose?: () => void;
}

const QrCodeModal = ({ payModalVisible, setPayModalVisible, payData, onClose }: Props) => {
  return (
    <Modal
      title={null}
      open={payModalVisible}
      onCancel={() => {
        setPayModalVisible(false);
        if (onClose) onClose();
      }}
      footer={null}
      width={400}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: "32px 24px", textAlign: "center" }}>
        <CTitle level={4} style={{ marginBottom: 4 }}>Quét mã để thanh toán</CTitle>
        <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
          Vui lòng quét mã QR dưới đây để hoàn tất đơn hàng
        </Text>

        <div style={{
          background: "#fff", padding: 16, borderRadius: 16,
          border: "1px solid #f0f0f0", display: "inline-block",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: 24
        }}>
          <QRCode
            value={payData?.qrCode || ""}
            size={220}
            errorLevel="H"
            status={!payData ? "loading" : "active"}
          />
        </div>

        <div style={{ textAlign: "left", background: "#f9fafb", padding: 16, borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text type="secondary">Số tiền:</Text>
            <Text strong style={{ color: "#e53935", fontSize: 16 }}>
              {payData?.amount?.toLocaleString("vi-VN")} ₫
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text type="secondary">Nội dung:</Text>
            <Text strong>{payData?.description}</Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Mã đơn hàng:</Text>
            <Text strong>#{payData?.orderCode}</Text>
          </div>
        </div>

        <Divider style={{ margin: "24px 0" }} />

        <Space orientation="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <Spin size="small" />
            <Text type="secondary" style={{ fontSize: 13 }}>Đang chờ bạn thanh toán...</Text>
          </div>
          <Button type="link" onClick={() => window.open(payData?.checkoutUrl, "_blank")}>
            Mở trang thanh toán PayOS
          </Button>
        </Space>
      </div>
    </Modal>
  )
}

export default QrCodeModal