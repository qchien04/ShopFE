import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Tooltip, Upload, message } from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  SmileOutlined,
  DeleteOutlined,
  CopyOutlined,
  RobotOutlined,
  UserOutlined,
  CloseOutlined,
  MinusOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import './ChatBot.scss';
import { aiApi } from '../../api/ai.api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  images?: string[];
}


const fchat=`Chào bạn,muốn gì nói luôn`



const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: formatText(fchat),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const [isClosed, setIsClosed] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  function formatText(text:string) {
    return text
      // 1. Thay thế các tiêu đề Markdown **Text** thành thẻ <b>
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      
      // 2. Chuyển các dòng bắt đầu bằng * hoặc - thành gạch đầu dòng có thụt lề
      .replace(/^\s*[\*\-]\s+(.*)/gm, '<li>$1</li>')
      
      // 3. Đóng gói các <li> vào <ul> (tùy chọn) hoặc đơn giản là xuống dòng
      .replace(/\n/g, '<br/>');
  }

    const RealResponse = async (userMessage: string) => {
      setIsTyping(true);

      const botResponse= await aiApi.ask(userMessage);
     
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: formatText(botResponse),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() && fileList.length === 0) return;

    const images = fileList.map(file => file.thumbUrl || file.url || '');

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      images: images.length > 0 ? images : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    //simulateBotResponse(inputValue);
    setInputValue('');
    setFileList([]);
    inputRef.current?.focus();

    await RealResponse(inputValue);
    
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success('Đã copy tin nhắn');
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  
const handleClearChat = () => {
    const ok=formatText(fchat);
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: ok,
        timestamp: new Date()
      }
    ]);
  };

  const quickActions = [
    { icon: '💰', text: 'Hỏi về giá', query: 'Cho tôi hỏi về giá sản phẩm' },
    { icon: '🚚', text: 'Giao hàng', query: 'Chính sách giao hàng như thế nào?' },
    { icon: '🛡️', text: 'Bảo hành', query: 'Sản phẩm có bảo hành không?' },
    { icon: '💳', text: 'Thanh toán', query: 'Các hình thức thanh toán' }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (isClosed) {
    return (
      <div className="chatbot-trigger" onClick={() => setIsClosed(false)}>
        <div className="trigger-icon">
          <RobotOutlined />
        </div>
        <div className="trigger-badge">1</div>
      </div>
    );
  }

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left">
          <Avatar 
            size={40} 
            icon={<RobotOutlined />}
            className="bot-avatar"
          />
          <div className="header-info">
            <h3>Trợ lý ảo</h3>
            <span className="status">
              <span className="status-dot"></span>
              Đang hoạt động
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Tooltip title="Làm mới">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleClearChat}
            />
          </Tooltip>
          <Tooltip title={isMinimized?"Mở rộng":"Thu gọn"}>
            <Button
              type="text"
              icon={isMinimized?<PlusOutlined/>:<MinusOutlined />}
              onClick={() => setIsMinimized(!isMinimized)}
            />
          </Tooltip>
          <Tooltip title="Đóng">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setIsClosed(true)}
            />
          </Tooltip>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={() => {
              setInputValue(action.query);
              setTimeout(() => handleSend(), 100);
            }}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-text">{action.text}</span>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.type}`}
          >
            {message.type === 'bot' && (
              <Avatar 
                size={32} 
                icon={<RobotOutlined />}
                className="message-avatar"
              />
            )}
            
            <div className="message-content">
              <div className="message-bubble">
                {message.images && message.images.length > 0 && (
                  <div className="message-images">
                    {message.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`Uploaded ${idx}`} />
                    ))}
                  </div>
                )}
                {message.content && (
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                )}
                
                <div className="message-actions">
                  <Tooltip title="Copy">
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(message.content)}
                    />
                  </Tooltip>
                  {message.type === 'user' && (
                    <Tooltip title="Xóa">
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteMessage(message.id)}
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>

            {message.type === 'user' && (
              <Avatar 
                size={32} 
                icon={<UserOutlined />}
                className="message-avatar"
              />
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper bot">
            <Avatar 
              size={32} 
              icon={<RobotOutlined />}
              className="message-avatar"
            />
            <div className="message-content">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chatbot-input">
        {fileList.length > 0 && (
          <div className="file-preview">
            {fileList.map(file => (
              <div key={file.uid} className="preview-item">
                <img src={file.thumbUrl} alt={file.name} />
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => setFileList([])}
                />
              </div>
            ))}
          </div>
        )}

        <div className="input-wrapper">
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            showUploadList={false}
            accept="image/*"
          >
            <Tooltip title="Đính kèm file">
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                className="input-action-btn"
              />
            </Tooltip>
          </Upload>

          <Input.TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="message-input"
          />

          <Tooltip title="Emoji">
            <Button
              type="text"
              icon={<SmileOutlined />}
              className="input-action-btn"
            />
          </Tooltip>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() && fileList.length === 0}
            className="send-btn"
          />
        </div>
      </div>

      {/* Powered by */}
      <div className="chatbot-footer">
        <small>Powered by Anbato AI</small>
      </div>
    </div>
  );
};

export default ChatBot;