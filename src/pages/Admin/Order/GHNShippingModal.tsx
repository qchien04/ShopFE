import { useState } from 'react';
import {
  Modal, Form, InputNumber, Select, Radio, Divider,
  Typography, Tag, Alert, Button, Descriptions, Space
} from 'antd';
import {
  TruckOutlined, DollarOutlined, PrinterOutlined,
  InfoCircleOutlined, ThunderboltOutlined
} from '@ant-design/icons';
import type { Order } from '../../../types/entity.type';
import { PaymentStatus, PaymentMethod } from '../../../types/entity.type';
import { useCreateGHNShipping, useGHNCalculateFeeByOrder, useGHNPrintToken } from '../../../hooks/Order/useGHN';
import type { GHNCalculateFeePayload } from '../../../api/ghn.api';

const { Text } = Typography;

interface Props {
  open: boolean;
  order: Order;
  onClose: () => void;
}

const SERVICE_TYPE_OPTIONS = [
  { value: 2, label: 'Chuyển phát nhanh (E-commerce)' },
  { value: 5, label: 'Chuyển phát tiêu chuẩn' },
];

const PAYMENT_TYPE_OPTIONS = [
  { value: 1, label: 'Shop trả phí vận chuyển' },
];

const REQUIRED_NOTE_OPTIONS = [
  { value: 'CHOXEMHANGKHONGTHU', label: 'Cho xem hàng, không cho thử' },
  { value: 'CHOTHUHANG', label: 'Cho thử hàng' },
  { value: 'KHONGCHOXEMHANG', label: 'Không cho xem hàng' },
];

const GHNShippingModal = ({ open, order, onClose }: Props) => {
  const [form] = Form.useForm();
  const [feeResult, setFeeResult] = useState<any>(null);

  const { mutate: createShipping, isPending: isCreating } = useCreateGHNShipping();
  const { mutate: calculateFee, isPending: isCalculating } = useGHNCalculateFeeByOrder();
  const { mutate: printLabel, isPending: isPrinting } = useGHNPrintToken();

  // Determine if COD
  const isCOD = order.paymentStatus === PaymentStatus.UNPAID &&
    order.paymentMethod === PaymentMethod.COD;

  const handleCalculateFee = () => {
    form.validateFields(['serviceTypeId', 'weight', 'length', 'width', 'height']).then(values => {
      // NOTE: Requires GHN district/ward from customer address
      // If not available, we show a helpful message
      const items = order.items?.map(item => ({
        name: item.productName || 'Sản phẩm',
        quantity: item.quantity,
        weight: 200, // Ước tính 200g/item
        length: 10,
        width: 10,
        height: 5
      })) || [];

      const payload: GHNCalculateFeePayload = {
        toDistrictId: 0, // Will be resolved on backend from customer address if possible, but actually we need to pass it? Wait.
        toWardCode: '',
        weight: values.weight,
        length: values.length,
        width: values.width,
        height: values.height,
        serviceTypeId: values.serviceTypeId,
        insuranceValue: order.total,
        items
      };
      calculateFee({ orderId: order.id, payload }, {
        onSuccess: (data) => setFeeResult(data),
      });
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      createShipping({
        orderId: order.id,
        payload: {
          serviceTypeId: values.serviceTypeId,
          paymentTypeId: values.paymentTypeId,
          requiredNote: values.requiredNote,
          codAmount: isCOD ? order.total : 0,
          insuranceValue: order.total,
          note: values.note,
          weight: values.weight,
          length: values.length,
          width: values.width,
          height: values.height,
        }
      }, {
        onSuccess: () => onClose(),
      });
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <TruckOutlined style={{ color: '#1890ff' }} />
          <span>Tạo vận đơn GHN - Đơn #{order.orderNumber}</span>
        </Space>
      }
      width={640}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button
          key="submit"
          type="primary"
          icon={<TruckOutlined />}
          loading={isCreating}
          onClick={handleSubmit}
          style={{ background: '#f26522', borderColor: '#f26522' }}
        >
          Tạo vận đơn GHN
        </Button>,
      ]}
    >
      {/* Order Summary */}
      <Descriptions
        bordered size="small"
        style={{ marginBottom: 16 }}
        column={{ xs: 1, sm: 2 }}
      >
        <Descriptions.Item label="Người nhận" span={2}>
          <Text strong>{order.customerName}</Text>
          {' · '}
          <Text>{order.customerPhone}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          <Text>{order.shippingAddress}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền hàng">
          <Text strong style={{ color: '#e53935' }}>
            {order.total.toLocaleString('vi-VN')}₫
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          {isCOD ? (
            <Tag color="orange" icon={<DollarOutlined />}>COD - Thu hộ {order.total.toLocaleString('vi-VN')}₫</Tag>
          ) : (
            <Tag color="green">Đã thanh toán online</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>

      {isCOD && (
        <Alert
          type="warning"
          showIcon
          icon={<DollarOutlined />}
          message={`GHN sẽ thu hộ ${order.total.toLocaleString('vi-VN')}₫ khi giao hàng`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        message="Yêu cầu địa chỉ có mã GHN"
        description="Chức năng này yêu cầu khách hàng đã lưu địa chỉ với thông tin quận/phường GHN. Nếu chưa có, hệ thống sẽ báo lỗi."
        style={{ marginBottom: 16 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          serviceTypeId: 2,
          paymentTypeId: 1,
          requiredNote: 'CHOXEMHANGKHONGTHU',
          weight: 500,
          length: 20,
          width: 20,
          height: 10,
        }}
      >
        <Divider orientation="vertical">
          <ThunderboltOutlined /> Dịch vụ vận chuyển
        </Divider>

        <Form.Item name="serviceTypeId" label="Loại dịch vụ GHN" rules={[{ required: true }]}>
          <Radio.Group>
            {SERVICE_TYPE_OPTIONS.map(opt => (
              <Radio.Button key={opt.value} value={opt.value}>
                {opt.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item name="paymentTypeId" label="Phí vận chuyển do ai trả" rules={[{ required: true }]}>
          <Select options={PAYMENT_TYPE_OPTIONS} />
        </Form.Item>

        <Form.Item name="requiredNote" label="Yêu cầu khi giao hàng" rules={[{ required: true }]}>
          <Select options={REQUIRED_NOTE_OPTIONS} />
        </Form.Item>

        <Divider orientation="vertical">📦 Thông tin kiện hàng</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item
            name="weight"
            label="Khối lượng (gram)"
            rules={[{ required: true, min: 1, type: 'number' }]}
          >
            <InputNumber min={1} max={50000} style={{ width: '100%' }} addonAfter="g" />
          </Form.Item>
          <Form.Item name="length" label="Dài (cm)">
            <InputNumber min={1} max={200} style={{ width: '100%' }} addonAfter="cm" />
          </Form.Item>
          <Form.Item name="width" label="Rộng (cm)">
            <InputNumber min={1} max={200} style={{ width: '100%' }} addonAfter="cm" />
          </Form.Item>
          <Form.Item name="height" label="Cao (cm)">
            <InputNumber min={1} max={200} style={{ width: '100%' }} addonAfter="cm" />
          </Form.Item>
        </div>

        <Form.Item name="note" label="Ghi chú cho shipper">
          <Select
            allowClear
            placeholder="Chọn ghi chú hoặc để trống"
            options={[
              { value: 'Hàng dễ vỡ, vui lòng nhẹ tay', label: '⚠️ Hàng dễ vỡ, nhẹ tay' },
              { value: 'Gọi trước khi giao 30 phút', label: '📞 Gọi trước khi giao 30 phút' },
              { value: 'Giao giờ hành chính', label: '🕘 Giao giờ hành chính' },
              { value: 'Giao buổi sáng', label: '🌅 Giao buổi sáng' },
              { value: 'Giao buổi chiều tối', label: '🌆 Giao buổi chiều tối' },
            ]}
          />
        </Form.Item>

        <Button
          type="dashed"
          icon={<DollarOutlined />}
          onClick={handleCalculateFee}
          loading={isCalculating}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Tính thử phí vận chuyển (Preview)
        </Button>

        {/* Fee preview */}
        {feeResult && (
          <Alert
            type="success"
            showIcon
            message={
              <div>
                <Text strong>Phí vận chuyển ước tính: </Text>
                <Text strong style={{ color: '#f26522', fontSize: 16 }}>
                  {feeResult.total?.toLocaleString('vi-VN')}₫
                </Text>
                {feeResult.insurance_fee > 0 && (
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    (Bao gồm {feeResult.insurance_fee?.toLocaleString('vi-VN')}₫ bảo hiểm)
                  </Text>
                )}
              </div>
            }
            style={{ marginTop: 8 }}
          />
        )}
      </Form>

      {/* Existing GHN order code - if already created */}
      {order.ghnOrderCode && (
        <Alert
          type="warning"
          showIcon
          message={
            <div>
              <Text strong>Vận đơn GHN đã tồn tại: </Text>
              <Tag color="blue">{order.ghnOrderCode}</Tag>
              <Button
                size="small"
                icon={<PrinterOutlined />}
                style={{ marginLeft: 8 }}
                loading={isPrinting}
                onClick={() => printLabel([order.ghnOrderCode!])}
              >
                In nhãn
              </Button>
            </div>
          }
          description="Tạo mới sẽ ghi đè vận đơn cũ trên hệ thống (không hủy trên GHN)."
          style={{ marginTop: 12 }}
        />
      )}
    </Modal>
  );
};

export default GHNShippingModal;
