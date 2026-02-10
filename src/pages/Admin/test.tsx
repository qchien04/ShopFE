import { Button, Form, InputNumber, message } from "antd";
import { paymentApi } from "../../api/payment.api";

const Test = () => {

  const onFinish = async (values:any) => {
    try {
      const amount = values.amount;
      console.log(amount)
      const url=await paymentApi.pay()

      console.log(url)

      const ok={
        accountName: "TA QUANG CHIEN",
        accountNumber: "0968118125",
        amount: 2000,
        bin: "970422",
        checkoutUrl: "https://pay.payos.vn/web/6d45a783bf67454799a596ba3a849d80",
        currency: "VND",
        description: "CS1AD7JTS65 Thanh toan don hang",
        expiredAt: null,
        orderCode: 1769843088,
        paymentLinkId: "6d45a783bf67454799a596ba3a849d80",
        qrCode: "00020101021238540010A00000072701240006970422011009681181250208QRIBFTTA5303704540420005802VN62350831CS1AD7JTS65 Thanh toan don hang6304AB0D",
        status: "PENDING",
      }

    } catch (err) {
      message.error("Không thể tạo thanh toán VNPAY");
      console.error(err);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "50px auto" }}
    >
      <Form.Item
        label="Số tiền (VND)"
        name="amount"
        rules={[{ required: true, message: "Nhập số tiền" }]}
      >
        <InputNumber
          min={1000}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Thanh toán VNPAY
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Test;
