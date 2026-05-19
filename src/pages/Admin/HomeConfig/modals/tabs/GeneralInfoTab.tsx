import { Form, Input, InputNumber, Switch } from 'antd';

interface Props {
  isProductSection?: boolean;
  hasWeeklySection?: boolean;
  isBrandSection?: boolean;
  isNewsSection?: boolean;
}

const GeneralInfoTab = ({ isProductSection, hasWeeklySection, isBrandSection, isNewsSection }: Props) => {
  return (
    <div style={{ paddingTop: 16 }}>
      <Form.Item
        name="title"
        label={hasWeeklySection ? "Tiêu đề Hot Deals (Bên trái)" : "Tiêu đề section"}
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
      >
        <Input placeholder="VD: Sản Phẩm Bán Chạy" />
      </Form.Item>

      {hasWeeklySection && (
        <Form.Item
          name="weeklyTitle"
          label="Tiêu đề Deal Tuần (Bên phải)"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
        >
          <Input placeholder="VD: Deal Hot Trong Tuần" />
        </Form.Item>
      )}

      <Form.Item
        name="active"
        label="Cho phép hiển thị"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      {isProductSection && (
        <>
          <Form.Item
            name="productPerRow"
            label="Số lượng sản phẩm trên mỗi dòng"
            initialValue={5}
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          {!hasWeeklySection && (
            <Form.Item
              name="productCount"
              label="Tổng số lượng sản phẩm hiển thị"
              initialValue={10}
              help="Hệ thống sẽ tự động bù thêm sản phẩm mới nếu số lượng ghim ít hơn số này."
            >
              <InputNumber min={1} max={30} style={{ width: '100%' }} />
            </Form.Item>
          )}
        </>
      )}

      {isBrandSection && (
        <Form.Item
          name="brandCount"
          label="Số lượng thương hiệu hiển thị"
          initialValue={10}
        >
          <InputNumber min={1} max={30} style={{ width: '100%' }} />
        </Form.Item>
      )}

      {isNewsSection && (
        <Form.Item
          name="postPerRow"
          label="Số lượng bài viết trên mỗi dòng"
          initialValue={3}
        >
          <InputNumber min={1} max={6} style={{ width: '100%' }} />
        </Form.Item>
      )}
    </div>
  );
};

export default GeneralInfoTab;
