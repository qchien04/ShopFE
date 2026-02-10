import './AboutShop.scss';

const AboutShop = () => {
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
        <h2>🔌 Chúng tôi là ai?</h2>
        <p>
          Anbato được thành lập với sứ mệnh mang đến cho khách hàng 
          <strong> linh kiện chất lượng – giá cả hợp lý – hỗ trợ tận tâm</strong>.
          Chúng tôi phục vụ từ sinh viên, kỹ sư, maker cho đến xưởng sản xuất nhỏ.
        </p>
      </section>

      {/* Mission */}
      <section className="about-section mission">
        <h2>🎯 Sứ mệnh & Giá trị</h2>
        <ul>
          <li>✔️ Sản phẩm rõ nguồn gốc, kiểm tra kỹ trước khi giao</li>
          <li>✔️ Giá minh bạch – không bán hàng trôi nổi</li>
          <li>✔️ Hỗ trợ kỹ thuật nhiệt tình, đúng trọng tâm</li>
          <li>✔️ Đồng hành cùng cộng đồng DIY & STEM</li>
        </ul>
      </section>

      {/* Products */}
      <section className="about-section">
        <h2>📦 Sản phẩm cung cấp</h2>
        <div className="product-grid">
          <div>⚡ Linh kiện điện tử cơ bản</div>
          <div>🔧 Module Arduino / ESP / STM32</div>
          <div>🧠 IC – cảm biến – relay</div>
          <div>🔌 Nguồn – adapter – pin</div>
          <div>🛠️ Dụng cụ & phụ kiện DIY</div>
        </div>
      </section>

      {/* Why choose */}
      <section className="about-section highlight-box">
        <h2>⭐ Vì sao chọn Anbato?</h2>
        <p>
          Không chỉ bán linh kiện, <strong>Anbato</strong> mong muốn trở thành
          <span className="highlight"> người bạn đồng hành</span> trong quá trình
          học tập, sáng tạo và phát triển sản phẩm của bạn.
        </p>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h3>Bắt đầu dự án của bạn cùng Anbato ngay hôm nay 🚀</h3>
        <button>Khám phá sản phẩm</button>
      </section>
    </div>
  );
};

export default AboutShop;
