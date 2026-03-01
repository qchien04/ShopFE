import React from 'react';
import { 
  FacebookFilled, 
  TwitterCircleFilled, 
  InstagramFilled,
  YoutubeFilled,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import logo from '../../assets/logo.png'
import visa from '../../assets/visa.png'
import banking from '../../assets/banking.png'
import "./Footer.scss";
import { useCategoryList, useCategoryParentList } from '../../hooks/Category/useCategotyList';

const Footer: React.FC = () => {
  const {data:categories} = useCategoryParentList();
  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Company Info */}
          <div className="footer-column company-info">
            <div className="footer-logo">
              <img src={logo} alt="Logo" />
            </div>
            <p className="company-description">
              Chuyên cung cấp linh kiện điện tử chính hãng, uy tín hàng đầu Việt Nam. 
              Cam kết chất lượng - Giá cả cạnh tranh.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon facebook">
                <FacebookFilled />
              </a>
              <a href="#" className="social-icon twitter">
                <TwitterCircleFilled />
              </a>
              <a href="#" className="social-icon instagram">
                <InstagramFilled />
              </a>
              <a href="#" className="social-icon youtube">
                <YoutubeFilled />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="column-title">Sản Phẩm</h3>
            <ul className="footer-links">
              {categories?.slice(0,6).map((cat)=>{
                return <li key={cat.id}><a href={`/category/${cat.id}`}>{cat.name}</a></li>
              })}
              <li><a href={`/category/`}>Xem tất cả sản phẩm</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="column-title">Hỗ Trợ</h3>
            <ul className="footer-links">
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Phương thức thanh toán</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản dịch vụ</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column contact-info">
            <h3 className="column-title">Liên Hệ</h3>
            <ul className="contact-list">
              <li>
                <EnvironmentOutlined className="contact-icon" />
                <span>123 Đường Trần Phú, Quận Hà Đông, TP.Hà Nội</span>
              </li>
              <li>
                <PhoneOutlined className="contact-icon" />
                <span>Hotline: 1900 1000</span>
              </li>
              <li>
                <MailOutlined className="contact-icon" />
                <span>Email: chien1472k4@gmail.com</span>
              </li>
              <li>
                <ClockCircleOutlined className="contact-icon" />
                <span>Thứ 2 - Thứ 7: 8:00 - 20:00</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="newsletter">
              <h4>Đăng ký nhận tin</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Email của bạn" />
                <button type="submit">Đăng ký</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © 2026 Anbato Electronic. All rights reserved.
            </p>
            <div className="payment-methods">
              <span>Phương thức thanh toán:</span>
              <div className="payment-icons">
                <img src={visa} alt="Visa" />
                <img src={banking} alt="Banking" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;