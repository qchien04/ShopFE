import { Button, Form, Input, message } from "antd";
import { paymentApi } from "../../api/payment.api";
import { adminApi } from "../../api/admin.api";

const Test = () => {

  const onFinish = async (values:any) => {
    try {
      const amount = values.amount;
      console.log(amount)
      const url=await paymentApi.payOSOder(values.orderId)

      console.log(url)

    } catch (err) {
      message.error("Không thể tạo thanh toán");
      console.error(err);
    }
  };


  const onADmin = async () => {
    try {
      const url=await adminApi.payUpdate()

      console.log(url)

    } catch (err) {
      message.error("Không thể tạo thanh toán");
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
        name="orderId"
        rules={[{ required: true, message: "Nhập số tiền" }]}
      >
        <Input
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Kiểm tra
        </Button>

        <Button type="dashed" block onClick={onADmin}>
          ADMIN
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Test;
