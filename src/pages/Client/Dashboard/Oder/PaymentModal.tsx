
import {  Modal, Radio, Space,Typography } from "antd"
import {PaymentMethod, type Order } from '../../../../types/entity.type';
import { paymentMethodMap } from "./Mapper";

const { Title,Text } = Typography;
interface Props {
  paymentOpen:boolean,
  selectedOrder:Order,
  payMethod:PaymentMethod,
  setPaymentOpen:React.Dispatch<React.SetStateAction<boolean>>;
  setPayMethod:React.Dispatch<React.SetStateAction<PaymentMethod>>;
  handleConfirmPayment:(id?: number) => Promise<void>
}

export const PaymentModal=({handleConfirmPayment,payMethod,setPayMethod
  ,paymentOpen,selectedOrder,setPaymentOpen}:Props)=>{

  return (
    <Modal
      open={paymentOpen}
      title="Thanh toán đơn hàng"
      onCancel={() => setPaymentOpen(false)}
      onOk={() => handleConfirmPayment(selectedOrder?.id)}
      okText="Xác nhận thanh toán"
      cancelText="Hủy"
      okButtonProps={{ style: { background: '#00b96b', borderColor: '#00b96b' } }}
      width="min(480px, 95vw)"
    >
      {selectedOrder && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f0', borderRadius: 10 }}>
            <Text type="secondary">Tổng thanh toán</Text>
            <Title level={3} style={{ color: '#e53935', margin: '4px 0 0' }}>
              {selectedOrder.total.toLocaleString('vi-VN')}₫
            </Title>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 10 }}>Phương thức thanh toán</Text>
            <Radio.Group value={payMethod} onChange={e => setPayMethod(e.target.value)} style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {Object.entries(paymentMethodMap).map(([key, val]) => (
                  <Radio key={key} value={key} style={{
                    width: '100%', padding: '12px 14px',
                    border: `2px solid ${payMethod === key ? '#00b96b' : '#f0f0f0'}`,
                    borderRadius: 8, background: payMethod === key ? '#f0faf5' : '#fff',
                    transition: 'all 0.2s',
                  }}>
                    <Space>{val.icon}<Text strong>{val.label}</Text></Space>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>
      )}
    </Modal>
  )
}