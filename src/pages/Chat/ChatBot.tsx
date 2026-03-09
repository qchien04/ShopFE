import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Tooltip, Upload, message } from 'antd';
import {
  SendOutlined, PaperClipOutlined, SmileOutlined, DeleteOutlined,
  CopyOutlined, RobotOutlined, UserOutlined, CloseOutlined,
  MinusOutlined, ReloadOutlined, PlusOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import './ChatBot.scss';
import { aiApi } from '../../api/ai.api';
import type { AiResponse } from '../../types';
import { Link } from 'react-router-dom';
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
const BotMessage = ({ msg }: { msg: Message }) => {
  if (msg.aiResponse) {
    const { message: intro, products, note } = msg.aiResponse;
    return (
      <div className="ai-response">
        {intro && <p className="ai-intro">{intro}</p>}

        {products && products.length > 0 && (
          <div className="ai-products">
            {products.map((p, i) => (
             <Link key={i} to={p.link} className="ai-product-card">
                <div className="ai-product-name">{p.name}</div>
                <div className="ai-product-reason">{p.reason}</div>
                <div className="ai-product-price">
                  {p.price?.toLocaleString('vi-VN')}₫
                </div>
              </Link>
            ))}
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const RealResponse = async (userMessage: string) => {
    setIsTyping(true);
    try {
      const res: AiResponse = await aiApi.ask(userMessage);

      // ✅ Nếu BE trả về AiResponse object
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
          ...(msg.aiResponse.products?.map(p => `${p.name} - ${p.price?.toLocaleString('vi-VN')}₫\n${p.reason}`) ?? []),
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

  const quickActions = [
    { icon: '💰', text: 'Hỏi về giá',  query: 'Cho tôi hỏi về giá sản phẩm' },
    { icon: '🚚', text: 'Giao hàng',   query: 'Chính sách giao hàng như thế nào?' },
    { icon: '🛡️', text: 'Bảo hành',   query: 'Sản phẩm có bảo hành không?' },
    { icon: '💳', text: 'Thanh toán',  query: 'Các hình thức thanh toán' },
  ];

  if (isClosed) {
    return (
      <div className="chatbot-trigger" onClick={() => setIsClosed(false)}>
        <div className="trigger-icon"><RobotOutlined /></div>
        <div className="trigger-badge">1</div>
      </div>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
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
          <Tooltip title={isMinimized ? 'Mở rộng' : 'Thu gọn'}>
            <Button type="text" icon={isMinimized ? <PlusOutlined /> : <MinusOutlined />}
              onClick={() => setIsMinimized(v => !v)} />
          </Tooltip>
          <Tooltip title="Đóng">
            <Button type="text" icon={<CloseOutlined />} onClick={() => setIsClosed(true)} />
          </Tooltip>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((a, i) => (
          <button key={i} className="quick-action-btn"
            onClick={() => { setInputValue(a.query); setTimeout(handleSend, 100); }}>
            <span className="action-icon">{a.icon}</span>
            <span className="action-text">{a.text}</span>
          </button>
        ))}
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
                  ? <BotMessage msg={msg} />
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