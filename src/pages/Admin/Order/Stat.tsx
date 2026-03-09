import { Card, Col, Row, Statistic } from "antd"
import {
  EditOutlined,
  CheckOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TruckOutlined
} from '@ant-design/icons';

interface Props{
  stats:any
}
export const Stat=({stats}:Props)=>{
  return (
    <Row gutter={16} className="stats-row">
      <Col span={4}>
        <Card>
          <Statistic
            title="Tổng đơn hàng"
            value={stats.total}
            prefix={<ShoppingCartOutlined />}
            styles={{ content: { color: '#1890ff' } }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Chờ xác nhận"
            value={stats.pending}
            prefix={<ClockCircleOutlined />}
            styles={{ content: { color: '#faad14' } }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Đang xử lý"
            value={stats.processing}
            prefix={<EditOutlined />}
            styles={{ content: { color: '#13c2c2' } }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Đang giao"
            value={stats.shipping}
            prefix={<TruckOutlined />}
            styles={{ content: { color: '#722ed1' } }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Đã giao"
            value={stats.delivered}
            prefix={<CheckOutlined />}
            styles={{ content: { color: '#52c41a' } }}
          />
        </Card>
      </Col>
      <Col span={4}>
        <Card>
          <Statistic
            title="Doanh thu"
            value={stats.revenue}
            prefix={<DollarOutlined />}
            styles={{ content: { color: '#f5222d' } }}
            suffix="₫"
          />
        </Card>
      </Col>
    </Row>
  )
}