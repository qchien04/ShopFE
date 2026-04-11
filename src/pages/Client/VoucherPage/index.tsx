import { useEffect, useState } from 'react';
import { Card, Typography, Button, message, Spin, Empty, Row, Col, Divider, Space } from 'antd';
import { CopyOutlined, TagOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { couponApi } from '../../../api/coupon.api';
import type { Coupon } from '../../../types/entity.type';
import dayjs from 'dayjs';

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
        style={{
          marginBottom: 16,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: 'flex', height: '100%', minHeight: 140 }}>
          {/* Left section - Colored Area */}
          <div style={{
            width: 120,
            background: 'linear-gradient(135deg, #00b96b 0%, #00d27a 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            padding: 16,
            position: 'relative'
          }}>
            <TagOutlined style={{ fontSize: 32, opacity: 0.8 }} />
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 12,
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {coupon.discountType === 'PERCENTAGE' ? `GIẢM ${coupon.discountValue}%` : `GIẢM ${coupon.discountValue / 1000}K`}
            </Text>

            {/* Ticket holes effect */}
            <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'white' }} />
              ))}
            </div>
          </div>

          {/* Right section - Content Area */}
          <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Title level={5} style={{ margin: 0, color: '#1f2937' }}>{coupon.code}</Title>
              </div>
              <Paragraph type="secondary" style={{ margin: '8px 0', fontSize: 13, minHeight: 40 }} ellipsis={{ rows: 2, expandable: true }}>
                {coupon.description}
              </Paragraph>

              <Space direction="vertical" size={1} style={{ fontSize: 12, color: '#6b7280' }}>
                {coupon.minOrderValue > 0 && <Text type="secondary">Đơn tối thiểu: {coupon.minOrderValue.toLocaleString('vi-VN')}đ</Text>}
                {coupon.maxDiscountAmount && coupon.discountType === 'PERCENTAGE' && (
                  <Text type="secondary">Giảm tối đa: {coupon.maxDiscountAmount.toLocaleString('vi-VN')}đ</Text>
                )}
                {coupon.usedCount && coupon.usageLimit && (
                  <Text type="secondary">Đã dùng: {coupon.usedCount}/{coupon.usageLimit}</Text>
                )}
              </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} dashed />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space style={{ fontSize: 12, color: '#ef4444' }}>
                <ClockCircleOutlined />
                HSD: {dayjs(coupon.endDate).format('DD/MM/YYYY')}
              </Space>

              <Button
                type="primary"
                size="middle"
                icon={<CopyOutlined />}
                onClick={() => handleCopyCode(coupon.code)}
                style={{
                  borderRadius: 20,
                  background: 'white',
                  color: '#00b96b',
                  border: '1px solid #00b96b',
                  fontWeight: 600
                }}
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
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ color: '#111827', marginBottom: 8 }}>Mã Giảm Giá Dành Cho Bạn</Title>
          <Text type="secondary" style={{ fontSize: 16 }}>Lưu ngay các mã giảm giá hấp dẫn để mua sắm tiết kiệm hơn tại cửa hàng</Text>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '100px 0' }}>
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
              <span style={{ color: '#6b7280', fontSize: 16 }}>
                Hiện tại không có mã giảm giá nào. Vui lòng quay lại sau!
              </span>
            }
            style={{ margin: '100px 0' }}
          />
        )}
      </div>
    </div>
  );
};

export default VoucherPage;
