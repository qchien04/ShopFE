import { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Tooltip, Upload, message, Select, Space } from 'antd';
import {
  SendOutlined, PaperClipOutlined, SmileOutlined, DeleteOutlined,
  CopyOutlined, RobotOutlined, UserOutlined, CloseOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import './ChatBot.scss';
import { aiApi } from '../../api/ai.api';
import { orderApi } from '../../api/order.api';
import type { AiResponse } from '../../types';
import { PaymentMethod } from '../../types/entity.type';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';
interface Message {
  id: string;
  type: 'user' | 'bot';
  content?: string;       // text thường
  aiResponse?: AiResponse; // structured response
  timestamp: Date;
  images?: string[];
}

const WELCOME = '💬 Chào bạn, tôi có thể giúp gì cho bạn?';

// ── Render bot message ───────────────────────────────────
const BotMessage = ({ msg, onAction }: { msg: Message, onAction: (type: string, params: any, msgId: string) => void }) => {
  const [selectedAddr, setSelectedAddr] = useState<number | undefined>(msg.aiResponse?.action?.params?.addressId);
  const [selectedPayment, setSelectedPayment] = useState<string | undefined>(msg.aiResponse?.action?.params?.paymentMethod);
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(msg.aiResponse?.action?.params?.variantId);

  if (msg.aiResponse) {
    const { message: intro, products, note, action, availableAddresses, availablePaymentMethods } = msg.aiResponse;

    // Auto-select default address if not set
    if (!selectedAddr && availableAddresses && availableAddresses.length > 0) {
      const def = availableAddresses.find(a => a.isDefault) || availableAddresses[0];
      setSelectedAddr(def.id);
    }
    // Auto-select COD if not set
    if (!selectedPayment && availablePaymentMethods && availablePaymentMethods.length > 0) {
      setSelectedPayment('COD');
    }

    return (
      <div className="ai-response">
        {intro && <p className="ai-intro">{intro}</p>}

        {products && products.length > 0 && (
          <div className="ai-products">
            {products.map((p, i) => (
              <div key={i} className="ai-product-card-wrapper">
                <Link to={`/products/${p.productId}`} className="ai-product-card">
                  {p.imageUrl && <img src={p.imageUrl} alt={p.productName} className="ai-p-image" />}
                  <div className="ai-p-info">
                    <div className="ai-product-name">{p.productName}</div>
                    <div className="ai-product-price">
                      {p.price?.toLocaleString('vi-VN')}₫
                    </div>
                    {p.description && <div className="ai-product-desc">{p.description}</div>}
                  </div>
                </Link>
                {p.variants && p.variants.length > 0 && (
                  <div className="ai-variants-list">
                    <Space wrap>
                      {p.variants.map(v => (
                        <span key={v.variantId} className="ai-variant-tag">
                          {v.name} - {v.price?.toLocaleString('vi-VN')}₫
                          {v.stock <= 3 && v.stock > 0 && <small style={{ color: 'red' }}> (Còn {v.stock})</small>}
                          {v.stock === 0 && <small style={{ color: 'gray' }}> (Hết hàng)</small>}
                        </span>
                      ))}
                    </Space>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {action && action.type === 'ORDER' && (
          <div className="ai-order-confirm">
            <div className="order-item">
              <ShoppingCartOutlined className="order-icon" />
              <div className="order-details">
                <div className="order-name">{action.params.productName}</div>
                <div className="order-qty">Số lượng: {action.params.quantity}</div>

                <Space direction="vertical" style={{ width: '100%', marginTop: 12 }} size={4}>
                  <div className="order-label">📍 Địa chỉ giao hàng:</div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn địa chỉ"
                    value={selectedAddr}
                    onChange={setSelectedAddr}
                    size="small"
                  >
                    {availableAddresses?.map(a => (
                      <Select.Option key={a.id} value={a.id}>
                        {a.fullName} - {a.detailAddress}
                      </Select.Option>
                    ))}
                  </Select>

                  <div className="order-label" style={{ marginTop: 8 }}>🏷️ Loại sản phẩm:</div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn loại (Size/Màu)"
                    value={selectedVariantId}
                    onChange={setSelectedVariantId}
                    size="small"
                  >
                    {products?.flatMap(p => p.variants).map(v => (
                      <Select.Option key={v.variantId} value={v.variantId}>
                        {v.name} - {v.price?.toLocaleString('vi-VN')}₫
                      </Select.Option>
                    ))}
                  </Select>

                  <div className="order-label" style={{ marginTop: 8 }}>💳 Phương thức thanh toán:</div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Chọn thanh toán"
                    value={selectedPayment}
                    onChange={setSelectedPayment}
                    size="small"
                  >
                    {availablePaymentMethods?.map(m => (
                      <Select.Option key={m} value={m}>{m}</Select.Option>
                    ))}
                  </Select>
                </Space>
              </div>
            </div>
            <Button
              type="primary"
              block
              icon={<CheckCircleOutlined />}
              onClick={() => onAction(action.type, {
                ...action.params,
                variantId: selectedVariantId,
                addressId: selectedAddr,
                paymentMethod: selectedPayment
              }, msg.id)}
              className="confirm-order-btn"
              disabled={action.params.isOrdered || !selectedAddr || !selectedPayment || !selectedVariantId}
              style={{ marginTop: 12, borderRadius: 8, height: 40, fontWeight: 600 }}
            >
              {action.params.isOrdered ? 'Đã đặt hàng' : 'Xác nhận đặt hàng'}
            </Button>
          </div>
        )}

        {note && <p className="ai-note">📝 {note}</p>}
      </div>
    );
  }

  return (
    <div
      className="message-text"
      dangerouslySetInnerHTML={{ __html: msg.content ?? '' }}
    />
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', type: 'bot', content: WELCOME, timestamp: new Date()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isClosed, setIsClosed] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const RealResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      // History tự quản lý ở Agent Server qua redis/cache, không cần truyền thủ công nữa
      const res: AiResponse = await aiApi.ask(userMessage, []);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        aiResponse: res,
        timestamp: new Date()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && fileList.length === 0) return;

    const images = fileList.map(f => f.thumbUrl || f.url || '');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      images: images.length > 0 ? images : undefined
    }]);

    const q = inputValue;
    setInputValue('');
    setFileList([]);
    inputRef.current?.focus();

    await RealResponse(q);
  };

  const handleAction = async (type: string, params: any, msgId: string) => {
    if (type === 'ORDER') {
      try {
        setIsTyping(true);
        const res = await orderApi.createOrder({
          addressId: params.addressId,
          paymentMethod: params.paymentMethod as PaymentMethod,
          items: [{
            productVariantId: params.variantId,
            quantity: params.quantity
          }]
        });

        const orderNum = res.orderNumber || res.id;
        message.success(`Đã đặt hàng thành công! Mã đơn hàng: ${orderNum}`);

        // 1. Cập nhật trạng thái tin nhắn hiện tại (disable nút)
        setMessages(prev => prev.map(m => {
          if (m.id === msgId && m.aiResponse) {
            return {
              ...m,
              aiResponse: {
                ...m.aiResponse,
                action: undefined, // Xóa action để không bấm được nữa
                note: `Đơn hàng ${orderNum} đã được tạo thành công!`
              }
            };
          }
          return m;
        }));

        // 2. Thông báo cho AI là đã đặt hàng xong để cập nhật history
        await RealResponse(`Tôi đã nhấn nút xác nhận và đặt hàng thành công đơn hàng số ${orderNum}. Hãy cập nhật trạng thái này.`);

      } catch (err: any) {
        console.error("order.create_failed", err);
        message.error(err.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (msg: Message) => {
    const text = msg.aiResponse
      ? [
        msg.aiResponse.message,
        ...(msg.aiResponse.products?.map(p => `${p.productName} - ${p.price?.toLocaleString('vi-VN')}₫`) ?? []),
        msg.aiResponse.note ?? ''
      ].filter(Boolean).join('\n\n')
      : (msg.content ?? '');
    navigator.clipboard.writeText(text);
    message.success('Đã copy');
  };

  const handleClearChat = () => {
    setMessages([{ id: '1', type: 'bot', content: WELCOME, timestamp: new Date() }]);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (isClosed) {
    return (
      <div className="chatbot-trigger" onClick={() => setIsClosed(false)}>
        <div className="trigger-icon"><RobotOutlined /></div>
        <div className="trigger-badge">1</div>
      </div>
    );
  }

  return (
    <div className={`chatbot-container`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left">
          <Avatar size={40} icon={<RobotOutlined />} className="bot-avatar" />
          <div className="header-info">
            <h3>Trợ lý ảo</h3>
            <span className="status">
              <span className="status-dot" /> Đang hoạt động
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Tooltip title="Làm mới">
            <Button type="text" icon={<ReloadOutlined />} onClick={handleClearChat} />
          </Tooltip>
          <Tooltip title="Đóng">
            <Button type="text" icon={<CloseOutlined />} onClick={() => setIsClosed(true)} />
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.type}`}>
            {msg.type === 'bot' && (
              <Avatar size={32} icon={<RobotOutlined />} className="message-avatar" />
            )}

            <div className="message-content">
              <div className="message-bubble">
                {msg.images && msg.images.length > 0 && (
                  <div className="message-images">
                    {msg.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`img-${idx}`} />
                    ))}
                  </div>
                )}

                {msg.type === 'bot'
                  ? <BotMessage msg={msg} onAction={handleAction} />
                  : <div className="message-text">{msg.content}</div>
                }

                <div className="message-actions">
                  <Tooltip title="Copy">
                    <Button type="text" size="small" icon={<CopyOutlined />}
                      onClick={() => handleCopy(msg)} />
                  </Tooltip>
                  {msg.type === 'user' && (
                    <Tooltip title="Xóa">
                      <Button type="text" size="small" icon={<DeleteOutlined />}
                        onClick={() => setMessages(p => p.filter(m => m.id !== msg.id))} />
                    </Tooltip>
                  )}
                </div>
              </div>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>

            {msg.type === 'user' && (
              <Avatar size={32} icon={<UserOutlined />} className="message-avatar" />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper bot">
            <Avatar size={32} icon={<RobotOutlined />} className="message-avatar" />
            <div className="message-content">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatbot-input">
        {fileList.length > 0 && (
          <div className="file-preview">
            {fileList.map(file => (
              <div key={file.uid} className="preview-item">
                <img src={file.thumbUrl} alt={file.name} />
                <Button type="text" size="small" icon={<CloseOutlined />}
                  onClick={() => setFileList([])} />
              </div>
            ))}
          </div>
        )}

        <div className="input-wrapper">
          <Upload fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false} showUploadList={false} accept="image/*">
            <Tooltip title="Đính kèm">
              <Button type="text" icon={<PaperClipOutlined />} className="input-action-btn" />
            </Tooltip>
          </Upload>

          <Input.TextArea ref={inputRef} value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..." autoSize={{ minRows: 1, maxRows: 4 }}
            className="message-input" />

          <Tooltip title="Emoji">
            <Button type="text" icon={<SmileOutlined />} className="input-action-btn" />
          </Tooltip>

          <Button type="primary" icon={<SendOutlined />} onClick={handleSend}
            disabled={!inputValue.trim() && fileList.length === 0} className="send-btn" />
        </div>
      </div>

      <div className="chatbot-footer">
        <small>Powered by Anbato AI</small>
      </div>
    </div>
  );
};

export default ChatBot;