import React from "react";
import { Result, Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  // const [params] = useSearchParams();

  // // Lấy dữ liệu từ query params (ví dụ ?orderId=123&amount=500000)
  // const orderId = params.get("orderId") || "DH123456";
  // const amount = params.get("amount") || "500000";
  // const paymentMethod = params.get("method") || "Thanh toán khi nhận hàng";

  return (
    <div style={styles.wrapper}>
      <Card style={styles.card}>
        <Result
          icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
          title="Thanh toán thành công!"
          subTitle="Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý."
        />

        {/* <Descriptions
          bordered
          column={1}
          size="middle"
          style={{ marginTop: 20 }}
        >
          <Descriptions.Item label="Mã đơn hàng">
            {orderId}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            {Number(amount).toLocaleString()} đ
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {paymentMethod}
          </Descriptions.Item>
        </Descriptions> */}

        <div style={styles.buttonGroup}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>

          {/* <Button
            size="large"
            onClick={() => navigate(`/`)}
          >
            Xem đơn hàng
          </Button> */}
        </div>
      </Card>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: 700,
    borderRadius: 12,
  },
  buttonGroup: {
    marginTop: 30,
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
};

export default PaymentSuccess;