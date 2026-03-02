import { useAuth as useAuthQuery } from '../hooks/Auth/useAuth';
import { Skeleton } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}
import { Row, Col } from 'antd';


const SkeletonBox = ({ height }: { height: number }) => (
  <div style={{
    width: '100%',
    height,
    borderRadius: 8,
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '400% 100%',
    animation: 'skeleton-loading 1.4s ease infinite',
  }} />
);

const SkeletonProduct = () => (
  <div>
    <div style={{
      width: '100%',
      aspectRatio: '1/1',
      borderRadius: 4,
      marginBottom: 8,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '400% 100%',
      animation: 'skeleton-loading 1.4s ease infinite',
    }} />
    <Skeleton active title={false} paragraph={{ rows: 2 }} />
  </div>
);

export const PageSkeleton = () => (
  <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

    {/* ===== HEADER ===== */}
    <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '12px 16px' }}>

        {/* Desktop: Logo + Search + Icons */}
        <Row align="middle" gutter={16}>
          <Col xs={0} md={4}>
            <Skeleton.Avatar active size={48} shape="square" />
          </Col>
          <Col xs={0} md={14}>
            <Skeleton.Input active block />
          </Col>
          <Col xs={0} md={6}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
              <Skeleton.Avatar active size={32} shape="circle" />
              <Skeleton.Avatar active size={32} shape="circle" />
              <Skeleton.Avatar active size={32} shape="circle" />
            </div>
          </Col>

          {/* Mobile: Icons + Search */}
          <Col xs={24} md={0}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12 }}>
              <Skeleton.Avatar active size={40} shape="circle" />
              <Skeleton.Avatar active size={40} shape="circle" />
              <Skeleton.Avatar active size={40} shape="circle" />
              <Skeleton.Avatar active size={40} shape="circle" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Skeleton.Input active block />
              <Skeleton.Button active style={{ width: 80, flexShrink: 0 }} />
            </div>
          </Col>
        </Row>
      </div>

      {/* Nav */}
      <div style={{ borderTop: '1px solid #f0f0f0', padding: '8px 16px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <Row gutter={16} justify="center">
            {/* Desktop nav */}
            {Array.from({ length: 7 }).map((_, i) => (
              <Col key={i} xs={0} md={3}>
                <Skeleton.Input active size="small" block />
              </Col>
            ))}
            {/* Mobile nav */}
            {Array.from({ length: 2 }).map((_, i) => (
              <Col key={i} xs={12} md={0}>
                <Skeleton.Input active size="small" block />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>

    {/* ===== BODY ===== */}
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 16 }}>
      <Row gutter={16}>

        {/* Sidebar — ẩn trên mobile */}
        <Col xs={0} md={5} lg={4}>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <Skeleton.Input active block style={{ marginBottom: 8 }} />
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton.Input key={i} active size="small" block style={{ marginBottom: 8 }} />
            ))}
            <div style={{ marginTop: 16 }}>
              <Skeleton.Input active block style={{ marginBottom: 8 }} />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton.Input key={i} active size="small" block style={{ marginBottom: 8 }} />
              ))}
            </div>
          </div>
        </Col>

        {/* Main content */}
        <Col xs={24} md={19} lg={20}>

          {/* Banner */}
          <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={14}>
              <SkeletonBox height={200} />
            </Col>
            <Col xs={24} sm={10}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <SkeletonBox height={94} />
                </Col>
                <Col span={24}>
                  <SkeletonBox height={94} />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Icon categories */}
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Row gutter={16} justify="space-around">
              {Array.from({ length: 5 }).map((_, i) => (
                <Col key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Skeleton.Avatar active size={48} shape="circle" />
                  <Skeleton.Input active size="small" style={{ width: 70 }} />
                </Col>
              ))}
            </Row>
          </div>

          {/* Sản phẩm nổi bật */}
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            <Skeleton.Input active style={{ width: 160, marginBottom: 12 }} />
            <Row gutter={[12, 12]}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Col key={i} xs={12} sm={8} md={6} lg={4} xl={4}>
                  <SkeletonProduct />
                </Col>
              ))}
            </Row>
          </div>


        </Col>
      </Row>
    </div>

    <style>{`
      @keyframes skeleton-loading {
        0%   { background-position: 100% 50%; }
        100% { background-position: 0%   50%; }
      }
    `}</style>
  </div>
);
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading } = useAuthQuery();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) return(
    <div style={{
      width: "100vw",
      height: "100vh",
    }}>
      <PageSkeleton />;
    </div>
  )
    

  return <>{children}</>;
};
