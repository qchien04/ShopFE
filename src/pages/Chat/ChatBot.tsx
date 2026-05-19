import { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, Tooltip, Select, message as antMsg, Tag } from 'antd';
import {
  SendOutlined, RobotOutlined, UserOutlined, CloseOutlined,
  ReloadOutlined, CustomerServiceOutlined, ShoppingCartOutlined,
  ArrowRightOutlined, StarOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CarOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ChatBot.scss';
import { aiApi } from '../../api/ai.api';
import { chatApi } from '../../api/chat.api';
import { cartApi } from '../../api/cart.api';
import { orderApi } from '../../api/order.api';
import type { AiResponse, AiProduct, AiVariant } from '../../types';
import type { Order } from '../../types/entity.type';
import { useAuth } from '../../hooks/Auth/useAuth';
import { useChat } from '../../hooks/ChatRealtime/useChat';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LocalMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content?: string;
  botData?: AiResponse;
  orders?: Order[];
  timestamp: Date;
}
type ChatMode = 'AI' | 'HUMAN';

const WELCOME: AiResponse = {
  message: 'Xin chào! 👋 Mình là **Shop Advisor** — trợ lý tư vấn mua sắm thông minh.\n\nMình có thể giúp bạn:\n• Tìm & tư vấn sản phẩm phù hợp\n• So sánh giá, kiểm tra tồn kho\n• Theo dõi đơn hàng của bạn\n\nBạn cần hỗ trợ gì hôm nay?',
  products: [],
  suggestions: ['🔍 Tìm laptop gaming', '📦 Kiểm tra đơn hàng', '💰 Sản phẩm dưới 5 triệu'],
};

// ─── Status helpers ────────────────────────────────────────────────────────────
const ORDER_STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xác nhận', color: 'gold', icon: <ClockCircleOutlined /> },
  CONFIRMED: { label: 'Đã xác nhận', color: 'blue', icon: <CheckCircleOutlined /> },
  PROCESSING: { label: 'Đang xử lý', color: 'blue', icon: <ClockCircleOutlined /> },
  SHIPPING: { label: 'Đang giao', color: 'cyan', icon: <CarOutlined /> },
  DELIVERED: { label: 'Đã giao', color: 'green', icon: <CheckCircleOutlined /> },
  CANCELLED: { label: 'Đã hủy', color: 'red', icon: <ExclamationCircleOutlined /> },
  DELIVERY_FAILED: { label: 'Giao thất bại', color: 'volcano', icon: <ExclamationCircleOutlined /> },
  RETURNED: { label: 'Đã hoàn', color: 'purple', icon: <ExclamationCircleOutlined /> },
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ p, onAddToCart }: { p: AiProduct; onAddToCart: (p: AiProduct, v: AiVariant) => void }) => {
  const [selectedVariant, setSelectedVariant] = useState<AiVariant | null>(
    p.variants?.find(v => v.stock > 0) ?? p.variants?.[0] ?? null
  );
  const [adding, setAdding] = useState(false);
  const discount = p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    await onAddToCart(p, selectedVariant);
    setAdding(false);
  };

  return (
    <div className="cb-product-card">
      <Link to={`/products/${p.productId}`} className="cb-product-img-wrap" target="_blank">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.productName} className="cb-product-img" />
          : <div className="cb-product-img-placeholder"><ShoppingCartOutlined /></div>
        }
        {discount > 0 && <span className="cb-discount-badge">-{discount}%</span>}
      </Link>
      <div className="cb-product-info">
        <Link to={`/products/${p.productId}`} className="cb-product-name" target="_blank">
          {p.productName}
        </Link>
        <div className="cb-product-price-row">
          <span className="cb-price">
            {(selectedVariant?.price ?? p.price).toLocaleString('vi-VN')}₫
          </span>
          {p.originalPrice && p.originalPrice > p.price && (
            <span className="cb-original-price">{p.originalPrice.toLocaleString('vi-VN')}₫</span>
          )}
        </div>
        {p.description && <p className="cb-product-desc">{p.description}</p>}

        {p.variants && p.variants.length > 1 && (
          <Select
            size="small"
            className="cb-variant-select"
            value={selectedVariant?.variantId}
            onChange={vid => setSelectedVariant(p.variants.find(v => v.variantId === vid) ?? null)}
          >
            {p.variants.map(v => (
              <Select.Option key={v.variantId} value={v.variantId} disabled={v.stock === 0}>
                {v.name} {v.stock === 0 ? '(Hết)' : v.stock <= 3 ? `(Còn ${v.stock})` : ''}
              </Select.Option>
            ))}
          </Select>
        )}

        <div className="cb-product-actions">
          <Button
            size="small" type="primary" icon={<ShoppingCartOutlined />}
            loading={adding} onClick={handleAdd}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="cb-add-btn"
          >
            {selectedVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </Button>
          <Link to={`/products/${p.productId}`} target="_blank" className="cb-detail-link">
            Chi tiết <ArrowRightOutlined />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ order }: { order: Order }) => {
  const s = ORDER_STATUS_MAP[order.status] ?? { label: order.status, color: 'default', icon: null };
  return (
    <Link to="/user/orders" className="cb-order-card" target="_blank">
      <div className="cb-order-header">
        <span className="cb-order-num">#{order.orderNumber}</span>
        <Tag color={s.color} icon={s.icon} className="cb-order-status">{s.label}</Tag>
      </div>
      <div className="cb-order-items">
        {order.items.slice(0, 2).map(item => (
          <div key={item.id} className="cb-order-item-row">
            {item.productImage && <img src={item.productImage} alt={item.productName} className="cb-order-item-img" />}
            <div className="cb-order-item-info">
              <span className="cb-order-item-name">{item.productName}</span>
              <span className="cb-order-item-qty">x{item.quantity} · {item.price.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        ))}
        {order.items.length > 2 && <span className="cb-order-more">+{order.items.length - 2} sản phẩm khác</span>}
      </div>
      <div className="cb-order-footer">
        <span className="cb-order-total">Tổng: <strong>{order.total.toLocaleString('vi-VN')}₫</strong></span>
        <span className="cb-order-date">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </Link>
  );
};

// ─── Bot Message ──────────────────────────────────────────────────────────────
const BotMessage = ({ data, orders, onSuggestion, onAddToCart }: {
  data: AiResponse;
  orders?: Order[];
  onSuggestion: (t: string) => void;
  onAddToCart: (p: AiProduct, v: AiVariant) => void;
}) => {
  const navigate = useNavigate();
  const text = data.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return (
    <div className="cb-bot-data">
      <div className="cb-bot-text" dangerouslySetInnerHTML={{ __html: text }} />

      {data.products && data.products.length > 0 && (
        <div className="cb-products">
          {data.products.slice(0, 4).map(p => (
            <ProductCard key={p.productId} p={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="cb-orders">
          {orders.slice(0, 3).map(o => <OrderCard key={o.id} order={o} />)}
          {orders.length > 3 && (
            <Link to="/user/orders" className="cb-orders-view-all" target="_blank">
              Xem tất cả {orders.length} đơn hàng →
            </Link>
          )}
        </div>
      )}

      {data.note && <div className="cb-note">💡 {data.note}</div>}

      {data.cta && (
        <button className="cb-cta-btn" onClick={() => navigate(data.cta!.url)}>
          {data.cta.label} <ArrowRightOutlined />
        </button>
      )}

      {data.suggestions && data.suggestions.length > 0 && (
        <div className="cb-suggestions">
          {data.suggestions.map((s, i) => (
            <button key={i} className="cb-chip" onClick={() => onSuggestion(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Human Chat View ──────────────────────────────────────────────────────────
const HumanChatView = ({ roomId, userId, onSuggestion, onAddToCart }: {
  roomId: number;
  userId: number;
  onSuggestion: (t: string) => void;
  onAddToCart: (p: AiProduct, v: AiVariant) => void;
}) => {
  const { messages, connected, sendMessage } = useChat(roomId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => { if (!input.trim()) return; sendMessage(input.trim()); setInput(''); };

  return (
    <>
      <div className="cb-ws-bar">
        <span className={`cb-ws-dot ${connected ? 'on' : 'off'}`} />
        {connected ? 'Đang kết nối với nhân viên hỗ trợ' : 'Đang kết nối...'}
      </div>
      <div className="cb-messages">
        {messages.map(msg => {
          const isMe = msg.senderId === userId;
          const isAi = msg.senderRole === 'AI';

          // Kiểm tra xem tin nhắn AI có phải là chuỗi JSON không
          let aiData: AiResponse | null = null;
          if (isAi && msg.content && msg.content.trim().startsWith('{')) {
            try {
              aiData = JSON.parse(msg.content);
            } catch (e) {
              // Fallback sang text thường
            }
          }

          return (
            <div key={msg.id} className={`cb-msg-row ${isMe ? 'me' : 'other'}`}>
              {!isMe && <Avatar size={28} icon={isAi ? <RobotOutlined /> : <CustomerServiceOutlined />}
                className={isAi ? 'cb-avatar-ai' : 'cb-avatar-staff'} />}
              <div className="cb-msg-wrap">
                {!isMe && <span className="cb-msg-label">{isAi ? '🤖 AI' : '👨‍💼 Nhân viên'}</span>}
                {aiData ? (
                  <BotMessage data={aiData} onSuggestion={onSuggestion} onAddToCart={onAddToCart} />
                ) : (
                  <div className={`cb-bubble ${isMe ? 'mine' : isAi ? 'ai-hist' : 'staff'}`}>{msg.content}</div>
                )}
                <span className="cb-msg-time">{new Date(msg.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {isMe && <Avatar size={28} icon={<UserOutlined />} className="cb-avatar-me" />}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="cb-input-area">
        <Input.TextArea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={connected ? 'Nhắn tin...' : 'Đang kết nối...'} autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={!connected} className="cb-textarea" />
        <Button type="primary" icon={<SendOutlined />} onClick={send}
          disabled={!input.trim() || !connected} className="cb-send-btn" />
      </div>
    </>
  );
};

// ─── Main ChatBot ─────────────────────────────────────────────────────────────
const ChatBot = () => {
  const { user } = useAuth();
  const [isClosed, setIsClosed] = useState(true);
  const [messages, setMessages] = useState<LocalMessage[]>([
    { id: '1', type: 'bot', botData: WELCOME, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('AI');
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const roomInitRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Auto-create room on open
  useEffect(() => {
    if (isClosed || !user?.id || roomInitRef.current) return;
    roomInitRef.current = true;
    chatApi.startRoom(user.id).then(r => setRoomId(r.id)).catch(() => { roomInitRef.current = false; });
  }, [isClosed, user?.id]);

  const addBot = (data: AiResponse, orders?: Order[]) => setMessages(p => [
    ...p, { id: Date.now().toString(), type: 'bot', botData: data, orders, timestamp: new Date() }
  ]);

  const addSystem = (text: string) => setMessages(p => [
    ...p, { id: Date.now().toString(), type: 'system', content: text, timestamp: new Date() }
  ]);

  // ── Add to cart ──────────────────────────────────────────────────────────────
  const handleAddToCart = async (p: AiProduct, v: AiVariant) => {
    if (!user?.id) { antMsg.warning('Vui lòng đăng nhập để thêm vào giỏ hàng'); return; }
    try {
      await cartApi.addToCart({ productVariantId: v.variantId, quantity: 1 });
      antMsg.success(`Đã thêm "${p.productName}" vào giỏ hàng! 🛒`);
    } catch {
      antMsg.error('Không thể thêm vào giỏ hàng, vui lòng thử lại.');
    }
  };

  // ── Send to AI ───────────────────────────────────────────────────────────────
  const sendToAI = async (text: string) => {
    const crid = roomId;
    setMessages(p => [...p, { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() }]);
    if (crid) chatApi.saveAiMessage(crid, 'USER', text).catch(() => { });
    setIsTyping(true);

    try {
      const res: AiResponse = await aiApi.ask(text, []);

      // Fetch orders if AI indicates order context
      let orders: Order[] | undefined;
      if (user?.id && (res.message.toLowerCase().includes('đơn hàng') || text.toLowerCase().includes('đơn'))) {
        const allOrders = await orderApi.getUserOrder().catch(() => []);
        orders = allOrders.slice(0, 5);
      }

      addBot(res, orders);
      if (crid) chatApi.saveAiMessage(crid, 'AI', JSON.stringify(res)).catch(() => { });
    } catch {
      addBot({ message: 'Xin lỗi, mình đang gặp sự cố. Bạn thử lại sau nhé! 🙏', products: [], suggestions: ['Tìm sản phẩm', 'Xem đơn hàng', 'Kết nối nhân viên'] });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    const q = input.trim(); if (!q) return;
    setInput(''); inputRef.current?.focus();
    await sendToAI(q);
  };

  const handleSuggestion = (text: string) => { setInput(text); setTimeout(() => sendToAI(text), 50); };

  // ── Connect staff ─────────────────────────────────────────────────────────────
  const handleRequestHuman = async () => {
    if (!user?.id) { addSystem('⚠️ Vui lòng đăng nhập để kết nối với nhân viên hỗ trợ.'); return; }
    setIsConnecting(true);
    try {
      let rid = roomId;
      if (!rid) {
        const room = await chatApi.startRoom(user.id);
        rid = room.id; setRoomId(room.id);
        const hist = messages
          .filter(m => m.type === 'user' || m.type === 'bot')
          .map(m => ({
            role: (m.type === 'user' ? 'USER' : 'AI') as 'USER' | 'AI',
            content: m.type === 'bot' && m.botData ? JSON.stringify(m.botData) : (m.content ?? '')
          }))
          .filter(m => m.content.trim());
        if (hist.length) await chatApi.saveAiHistory(room.id, hist).catch(() => { });
      }
      setChatMode('HUMAN');
      addSystem('✅ Đã gửi yêu cầu kết nối nhân viên. Vui lòng chờ trong giây lát...');
    } catch { addSystem('❌ Không thể kết nối nhân viên. Vui lòng thử lại.'); }
    finally { setIsConnecting(false); }
  };

  const handleReset = () => {
    setMessages([{ id: '1', type: 'bot', botData: WELCOME, timestamp: new Date() }]);
    setChatMode('AI'); setRoomId(null); roomInitRef.current = false;
  };

  const fmt = (d: Date) => d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // ── Trigger ────────────────────────────────────────────────────────────────────
  if (isClosed) return (
    <div className="cb-trigger" onClick={() => setIsClosed(false)}>
      <div className="cb-trigger-icon"><RobotOutlined /></div>
      <div className="cb-trigger-badge">AI</div>
    </div>
  );

  // ── Human mode ─────────────────────────────────────────────────────────────────
  if (chatMode === 'HUMAN' && roomId) return (
    <div className="cb-container">
      <div className="cb-header staff-mode">
        <div className="cb-header-left">
          <Avatar size={38} icon={<CustomerServiceOutlined />} className="cb-avatar-header-staff" />
          <div className="cb-header-info">
            <span className="cb-header-name">Nhân viên hỗ trợ</span>
            <span className="cb-header-status">Đang kết nối...</span>
          </div>
        </div>
        <div className="cb-header-actions">
          <Tooltip title="Quay về AI"><Button type="text" icon={<RobotOutlined />} onClick={() => setChatMode('AI')} /></Tooltip>
          <Tooltip title="Đóng"><Button type="text" icon={<CloseOutlined />} onClick={() => setIsClosed(true)} /></Tooltip>
        </div>
      </div>
      <HumanChatView
        roomId={roomId}
        userId={user?.id ?? 0}
        onSuggestion={handleSuggestion}
        onAddToCart={handleAddToCart}
      />
      <div className="cb-footer"><small>Kết nối trực tiếp với nhân viên hỗ trợ</small></div>
    </div>
  );

  // ── AI mode ────────────────────────────────────────────────────────────────────
  return (
    <div className="cb-container">
      <div className="cb-header">
        <div className="cb-header-left">
          <div className="cb-header-avatar-wrap">
            <Avatar size={38} icon={<RobotOutlined />} className="cb-avatar-header" />
            <span className="cb-ai-dot" />
          </div>
          <div className="cb-header-info">
            <span className="cb-header-name">Shop Advisor AI</span>
            <span className="cb-header-status">Tư vấn thông minh · Luôn sẵn sàng</span>
          </div>
        </div>
        <div className="cb-header-actions">
          <Tooltip title="Kết nối nhân viên">
            <Button type="text" icon={<CustomerServiceOutlined />} loading={isConnecting} onClick={handleRequestHuman} className="cb-staff-btn" />
          </Tooltip>
          <Tooltip title="Làm mới"><Button type="text" icon={<ReloadOutlined />} onClick={handleReset} /></Tooltip>
          <Tooltip title="Đóng"><Button type="text" icon={<CloseOutlined />} onClick={() => setIsClosed(true)} /></Tooltip>
        </div>
      </div>

      <div className="cb-staff-hint">
        <CustomerServiceOutlined /> Cần hỗ trợ từ người thật?
        <button className="cb-staff-hint-btn" onClick={handleRequestHuman} disabled={isConnecting}>
          Kết nối nhân viên
        </button>
      </div>

      <div className="cb-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`cb-msg-row ${msg.type === 'user' ? 'me' : msg.type === 'system' ? 'system' : 'other'}`}>
            {msg.type === 'bot' && <Avatar size={28} icon={<RobotOutlined />} className="cb-avatar-bot" />}
            <div className="cb-msg-wrap">
              {msg.type === 'bot' && msg.botData
                ? <BotMessage data={msg.botData} orders={msg.orders} onSuggestion={handleSuggestion} onAddToCart={handleAddToCart} />
                : msg.type === 'system'
                  ? <div className="cb-system-msg">{msg.content}</div>
                  : <div className="cb-bubble mine">{msg.content}</div>
              }
              {msg.type !== 'system' && <span className="cb-msg-time">{fmt(msg.timestamp)}</span>}
            </div>
            {msg.type === 'user' && <Avatar size={28} icon={<UserOutlined />} className="cb-avatar-me" />}
          </div>
        ))}

        {isTyping && (
          <div className="cb-msg-row other">
            <Avatar size={28} icon={<RobotOutlined />} className="cb-avatar-bot" />
            <div className="cb-msg-wrap">
              <div className="cb-bot-data">
                <div className="cb-typing"><span /><span /><span /></div>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="cb-input-area">
        <Input.TextArea ref={inputRef} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Hỏi về sản phẩm, giá, đơn hàng..." autoSize={{ minRows: 1, maxRows: 4 }}
          className="cb-textarea" />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend}
          disabled={!input.trim()} className="cb-send-btn" />
      </div>

      <div className="cb-footer">
        <StarOutlined /> <small>Powered by Anbato AI · Sales Advisor</small>
      </div>
    </div>
  );
};

export default ChatBot;