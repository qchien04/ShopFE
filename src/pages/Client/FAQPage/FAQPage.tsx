import './FAQPage.scss';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { faqApi, type FAQItem } from '../../../api/faq.api';
import { FileSearchOutlined } from '@ant-design/icons';
const CATEGORIES = ['Tất cả', 'Đặt hàng', 'Thanh toán', 'Vận chuyển', 'Đổi trả & Bảo hành', 'Tài khoản', 'Chatbot AI'];

const CATEGORY_ICONS: Record<string, string> = {
  'Tất cả': '',
  'Đặt hàng': '',
  'Thanh toán': '',
  'Vận chuyển': '',
  'Đổi trả & Bảo hành': '',
  'Tài khoản': '',
  'Chatbot AI': '',
};

const FAQPage = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    faqApi.getAll()
      .then(setFaqs)
      .finally(() => setLoading(false));
  }, []);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((item) => {
      const matchCategory = activeCategory === 'Tất cả' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <div className="faq-page">
      {/* ── HERO ── */}
      <section className="faq-hero">
        <div className="faq-hero__inner">
          {/* Search */}
          <div className="faq-search">
            <span className="faq-search__icon" style={{ color: '#00c853' }}><FileSearchOutlined /></span>
            <input
              id="faq-search-input"
              type="text"
              placeholder="Nhập từ khoá câu hỏi của bạn..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory('Tất cả');
              }}
            />
            {searchQuery && (
              <button
                className="faq-search__clear"
                onClick={() => setSearchQuery('')}
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="faq-body">
        {/* Category pills */}
        <div className="faq-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`faq-cat-${cat.replace(/\s/g, '-')}`}
              className={`faq-cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setSearchQuery('');
              }}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="faq-result-count">
          {!loading && filteredFAQs.length > 0
            ? `Hiển thị ${filteredFAQs.length} câu hỏi${searchQuery ? ` cho "${searchQuery}"` : ''}`
            : ''}
        </p>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="faq-list">
            {filteredFAQs.length === 0 ? (
              <div className="faq-empty">
                <span>🤔</span>
                <p>Không tìm thấy câu hỏi phù hợp.</p>
                <p className="faq-empty__hint">Hãy thử từ khóa khác hoặc liên hệ với chúng tôi.</p>
              </div>
            ) : (
              filteredFAQs.map((item, idx) => (
                <div
                  key={item.id}
                  id={`faq-item-${item.id}`}
                  className={`faq-item ${openId === item.id ? 'open' : ''}`}
                >
                  <button
                    className="faq-item__question"
                    onClick={() => toggle(item.id)}
                    aria-expanded={openId === item.id}
                  >
                    <span className="faq-item__num">Q{idx + 1}</span>
                    <span className="faq-item__text">{item.question}</span>
                    <span className="faq-item__chevron">{openId === item.id ? '−' : '+'}</span>
                  </button>
                  <div className="faq-item__answer">
                    <div className="faq-item__answer-inner">
                      <span className="faq-item__a-badge">A</span>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── CTA Contact ── */}
        <div className="faq-contact-cta">
          <h3>Vẫn chưa tìm được câu trả lời?</h3>
          <p>Đội ngũ hỗ trợ của Anbato luôn sẵn sàng giúp đỡ bạn trong giờ làm việc.</p>
          <div className="faq-contact-cta__actions">
            <Link to="/about" id="faq-about-btn" className="btn btn--primary">
              Xem thông tin liên hệ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
