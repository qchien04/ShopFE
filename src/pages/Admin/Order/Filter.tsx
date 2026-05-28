import { Button, Card, DatePicker, Input, Select, Space } from "antd"
import { OrderStatus, PaymentStatus } from "../../../types/entity.type";
import { paymentStatusText, statusText } from "./Mapper";
import type { AdminOrderFilter } from "../../../types";
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
interface Props {
  filter: AdminOrderFilter;
  onChange: (patch: Partial<AdminOrderFilter>) => void;
  onReset: () => void;
}
export const Filter = ({ filter, onChange, onReset }: Props) => {
  return (
    <Card className="filters-card">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space wrap>
          <Input.Search
            placeholder="Tìm kiếm mã đơn, sản phẩm..."
            style={{ width: 300 }}
            value={filter.keyword}
            onChange={(e) => onChange({ keyword: e.target.value })}
            allowClear
          />

          <Select
            style={{ width: 160 }}
            placeholder="Trạng thái"
            value={filter.status}
            onChange={(value) => onChange({ status: value as OrderStatus })}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              ...Object.entries(statusText).map(([key, value]) => ({
                value: key,
                label: value
              }))
            ]}
          />

          <Select
            style={{ width: 160 }}
            placeholder="Thanh toán"
            value={filter.paymentStatus}
            onChange={(value) => onChange({ paymentStatus: value as PaymentStatus })}
            options={[
              { value: 'ALL', label: 'Tất cả' },
              ...Object.entries(paymentStatusText).map(([key, value]) => ({
                value: key,
                label: value
              }))
            ]}
          />

          <RangePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            value={[
              filter.fromDate ? dayjs(filter.fromDate) : null,
              filter.toDate ? dayjs(filter.toDate) : null,
            ]}
            onChange={dates => {
              onChange({
                fromDate: dates?.[0] ? dates[0].format('YYYY-MM-DD') : null,
                toDate: dates?.[1] ? dates[1].format('YYYY-MM-DD') : null,
                page: 0,
              });
            }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            style={{ width: '100%' }}
          >
            Đặt lại
          </Button>
        </Space>
      </Space>
    </Card>
  )
}