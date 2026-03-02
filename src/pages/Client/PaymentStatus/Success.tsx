import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";
import styles from "./PaymentSuccess.module.scss";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const orderId = params.get("orderId") || "DH123456";
  const amount = params.get("amount") || "500000";
  const paymentMethod = params.get("method") || "Chuyển khoản";

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <div className={styles.successIcon}>
          <CheckCircleFilled />
        </div>

        <h1 className={styles.title}>Thanh toán thành công</h1>
        <p className={styles.subtitle}>
          Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.
        </p>

        <div className={styles.orderInfo}>
          <div>
            <span>Mã đơn hàng</span>
            <strong>{orderId}</strong>
          </div>

          <div>
            <span>Tổng tiền</span>
            <strong>{Number(amount).toLocaleString()} đ</strong>
          </div>

          <div>
            <span>Phương thức</span>
            <strong>{paymentMethod}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate(`/user/orders`)}
          >
            Xem đơn hàng
          </Button>

          <Button size="large" onClick={() => navigate("/")}>
            Về trang chủ ({countdown}s)
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;