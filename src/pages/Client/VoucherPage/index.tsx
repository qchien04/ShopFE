import { useEffect, useState } from 'react';
import { Card, Typography, Button, message, Spin, Empty, Row, Col, Divider, Space } from 'antd';
import { CopyOutlined, TagOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { couponApi } from '../../../api/coupon.api';
import type { Coupon } from '../../../types/entity.type';
import dayjs from 'dayjs';
import './VoucherPage.scss';

const { Title, Text, Paragraph } = Typography;

const VoucherPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCoupons();
  }, []);

  const fetchActiveCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponApi.getActiveCoupons();
      setCoupons(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(`Đã sao chép mã: ${code}`);
    }).catch(() => {
      message.error('Không thể sao chép mã. Vui lòng thử lại.');
    });
  };

  const VoucherTicket = ({ coupon }: { coupon: Coupon }) => {
    return (
      <Card
        hoverable
        className="voucher-card"
        bodyStyle={{ padding: 0 }}
      >
        <div className="voucher-ticket">
          {/* Left section - Colored Area */}
          <div className="ticket-left">
            <TagOutlined className="ticket-icon" />
            <Text className="ticket-discount">
              {coupon.discountType === 'PERCENTAGE' ? `GIẢM ${coupon.discountValue}%` : `GIẢM ${coupon.discountValue / 1000}K`}
            </Text>

            {/* Ticket holes effect */}
            <div className="ticket-holes">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="hole" />
              ))}
            </div>
          </div>

          {/* Right section - Content Area */}
          <div className="ticket-right">
            <div>
              <div className="ticket-header">
                <Title level={5} className="ticket-code">{coupon.code}</Title>
              </div>
              <Paragraph type="secondary" className="ticket-description" ellipsis={{ rows: 2, expandable: true }}>
                {coupon.description}
              </Paragraph>

              <Space orientation="vertical" size={1} className="ticket-info">
                {coupon.minOrderValue > 0 && <Text type="secondary">Đơn tối thiểu: {coupon.minOrderValue.toLocaleString('vi-VN')}đ</Text>}
                {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                  <Text type="secondary">Giảm tối đa: {coupon.maxDiscountAmount.toLocaleString('vi-VN')}đ</Text>
                )}
                {coupon.usedCount !== undefined && coupon.usageLimit !== undefined && (
                  <Text type="secondary">Đã dùng: {coupon.usedCount}/{coupon.usageLimit}</Text>
                )}
              </Space>
            </div>

            <Divider className="ticket-divider" dashed />

            <div className="ticket-actions">
              <Space className="ticket-expiry">
                <ClockCircleOutlined />
                HSD: {dayjs(coupon.endDate).format('DD/MM/YYYY')}
              </Space>

              <Button
                type="primary"
                size="middle"
                icon={<CopyOutlined />}
                onClick={() => handleCopyCode(coupon.code)}
                className="copy-btn"
              >
                Sao chép mã
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="voucher-page">
      <div className="voucher-container">
        <div className="voucher-header">
          <Title level={2} className="title">Mã Giảm Giá Dành Cho Bạn</Title>
          <Text type="secondary" className="subtitle">Lưu ngay các mã giảm giá hấp dẫn để mua sắm tiết kiệm hơn tại cửa hàng</Text>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Đang tải danh sách voucher..." />
          </div>
        ) : coupons.length > 0 ? (
          <Row gutter={[24, 24]}>
            {coupons.map((coupon) => (
              <Col xs={24} md={12} lg={12} key={coupon.id}>
                <VoucherTicket coupon={coupon} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            description={
              <span className="empty-text">
                Hiện tại không có mã giảm giá nào. Vui lòng quay lại sau!
              </span>
            }
            className="empty-container"
          />
        )}
      </div>
    </div>
  );
};

export default VoucherPage;
