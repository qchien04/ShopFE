import { useEffect, useState } from 'react';
import { adminApi } from '../../../api/admin.api';
import type { FooterConfig } from '../../../types/entity.type';
import { Spin } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  AimOutlined,
  AppstoreOutlined,
  StarOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  ApiOutlined,
  ControlOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import './AboutShop.scss';

const AboutShop = () => {
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getConfigBanner()
      .then(res => {
        if (res.footer) {
          setFooter(res.footer);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="about-shop">
      {/* Header */}
      <section className="about-hero">
        <h1>Giới Thiệu <span>Anbato</span></h1>
        <p>
          <strong>Anbato</strong> là cửa hàng chuyên cung cấp{' '}
          <span className="highlight">linh kiện điện tử chính hãng</span>,
          phục vụ cho học tập, nghiên cứu và sản xuất.
        </p>
      </section>

      {/* About */}
      <section className="about-section">
        <h2><InfoCircleOutlined style={{ marginRight: 8 }} /> Chúng tôi là ai?</h2>
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {footer?.companyDescription || 'Anbato được thành lập với sứ mệnh mang đến cho khách hàng linh kiện chất lượng – giá cả hợp lý – hỗ trợ tận tâm.'}
        </p>
      </section>

      {/* Info & Contact */}
      <section className="about-section">
        <h2><PhoneOutlined style={{ marginRight: 8 }} /> Liên hệ & Thông tin</h2>
        <div className="contact-grid">
          <div className="contact-item">
            <EnvironmentOutlined className="contact-icon" />
            <div>
              <strong>Địa chỉ:</strong>
              <p>{footer?.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
          <div className="contact-item">
            <PhoneOutlined className="contact-icon" />
            <div>
              <strong>Hotline:</strong>
              <p><a href={`tel:${footer?.hotline}`}>{footer?.hotline || 'Chưa cập nhật'}</a></p>
            </div>
          </div>
          <div className="contact-item">
            <MailOutlined className="contact-icon" />
            <div>
              <strong>Email:</strong>
              <p><a href={`mailto:${footer?.email}`}>{footer?.email || 'Chưa cập nhật'}</a></p>
            </div>
          </div>
          <div className="contact-item">
            <ClockCircleOutlined className="contact-icon" />
            <div>
              <strong>Giờ làm việc:</strong>
              <p>{footer?.workingHours || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section mission">
        <h2><AimOutlined style={{ marginRight: 8 }} /> Sứ mệnh & Giá trị</h2>
        <ul>
          <li>✔️ Sản phẩm rõ nguồn gốc, kiểm tra kỹ trước khi giao</li>
          <li>✔️ Giá minh bạch – không bán hàng trôi nổi</li>
          <li>✔️ Hỗ trợ kỹ thuật nhiệt tình, đúng trọng tâm</li>
          <li>✔️ Đồng hành cùng cộng đồng DIY & STEM</li>
        </ul>
      </section>

      {/* Products */}
      <section className="about-section">
        <h2><AppstoreOutlined style={{ marginRight: 8 }} /> Sản phẩm cung cấp</h2>
        <div className="product-grid">
          <div><ThunderboltOutlined style={{ color: '#00c853', marginRight: 4 }} /> Linh kiện điện tử cơ bản</div>
          <div><ApiOutlined style={{ color: '#00c853', marginRight: 4 }} /> Module Arduino / ESP / STM32</div>
          <div><ControlOutlined style={{ color: '#00c853', marginRight: 4 }} /> IC – cảm biến – relay</div>
          <div><ToolOutlined style={{ color: '#00c853', marginRight: 4 }} /> Dụng cụ & phụ kiện DIY</div>
        </div>
      </section>

      {/* Why choose */}
      <section className="about-section highlight-box">
        <h2><StarOutlined style={{ marginRight: 8 }} /> Vì sao chọn Anbato?</h2>
        <p>
          Không chỉ bán linh kiện, <strong>Anbato</strong> mong muốn trở thành
          <span className="highlight"> người bạn đồng hành</span> trong quá trình
          học tập, sáng tạo và phát triển sản phẩm của bạn.
        </p>
      </section>

      {/* Social Links */}
      <section className="about-section">
        <h2><GlobalOutlined style={{ marginRight: 8 }} /> Kết nối với chúng tôi</h2>
        <div className="social-links">
          {footer?.facebookLink && (
            <a href={footer.facebookLink} target="_blank" rel="noreferrer" className="social-btn facebook">
              <FacebookOutlined /> Facebook
            </a>
          )}
          {footer?.youtubeLink && (
            <a href={footer.youtubeLink} target="_blank" rel="noreferrer" className="social-btn youtube">
              <YoutubeOutlined /> Youtube
            </a>
          )}
          {footer?.instagramLink && (
            <a href={footer.instagramLink} target="_blank" rel="noreferrer" className="social-btn instagram">
              <InstagramOutlined /> Instagram
            </a>
          )}
          {footer?.twitterLink && (
            <a href={footer.twitterLink} target="_blank" rel="noreferrer" className="social-btn twitter">
              <TwitterOutlined /> Twitter
            </a>
          )}
        </div>
      </section>

      {/* E-commerce */}
      <section className="about-section">
        <h2><ShoppingOutlined style={{ marginRight: 8 }} /> Mua sắm trên các nền tảng khác</h2>
        <div className="ecommerce-links">
          {footer?.shopeeLink && (
            <a href={footer.shopeeLink} target="_blank" rel="noreferrer" className="ecommerce-btn shopee">
              <ShoppingOutlined /> Shopee
            </a>
          )}
          {footer?.lazadaLink && (
            <a href={footer.lazadaLink} target="_blank" rel="noreferrer" className="ecommerce-btn lazada">
              <ShoppingOutlined /> Lazada
            </a>
          )}
          {footer?.tiktokLink && (
            <a href={footer.tiktokLink} target="_blank" rel="noreferrer" className="ecommerce-btn tiktok">
              <ShoppingOutlined /> Tiktok Shop
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutShop;
