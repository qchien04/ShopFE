import { Button, Card, DatePicker, Input, Select, Space } from "antd"
import {
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { OrderStatus, PaymentStatus } from "../../../types/entity.type";
import { paymentStatusText, statusText } from "./Mapper";

const { RangePicker } = DatePicker;
interface Props{
  searchText:string,
  statusFilter:OrderStatus|"ALL",
  paymentStatusFilter:PaymentStatus|"ALL",
  setStatusFilter:React.Dispatch<React.SetStateAction<OrderStatus|"ALL">>;
  setPaymentStatusFilter:React.Dispatch<React.SetStateAction<PaymentStatus|"ALL">>;
  setSearchText:React.Dispatch<React.SetStateAction<string>>;
}
export const Filter=({searchText,setSearchText,statusFilter,setStatusFilter,paymentStatusFilter,setPaymentStatusFilter}:Props)=>{
  return (
    <Card className="filters-card">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space wrap>
          <Input.Search
            placeholder="Tìm kiếm mã đơn, sản phẩm..."
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Select
            style={{ width: 160 }}
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
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
            value={paymentStatusFilter}
            onChange={setPaymentStatusFilter}
            options={[
              { value: 'ALL', label: 'Tất cả' },
              ...Object.entries(paymentStatusText).map(([key, value]) => ({
                value: key,
                label: value
              }))
            ]}
          />

          <RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
        </Space>

        <Space>
          <Button icon={<DownloadOutlined />}>
            Xuất Excel
          </Button>
          <Button type="primary" icon={<PrinterOutlined />}>
            In đơn hàng
          </Button>
        </Space>
      </Space>
    </Card>
  )
}