import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatRealtime/useChat";
import styles from "./ChatBox.module.scss";
import type { Room } from "../../pages/Admin/ChatManager";
import type { AiResponse, AiProduct, AiVariant } from "../../types";
import { Tag } from "antd";
import {
  ShoppingCartOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

// ─── Status map (giống client) ────────────────────────────────────────────────
const ORDER_STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:         { label: "Chờ xác nhận",  color: "gold",    icon: <ClockCircleOutlined /> },
  CONFIRMED:       { label: "Đã xác nhận",   color: "blue",    icon: <CheckCircleOutlined /> },
  PROCESSING:      { label: "Đang xử lý",    color: "blue",    icon: <ClockCircleOutlined /> },
  SHIPPING:        { label: "Đang giao",      color: "cyan",    icon: <CarOutlined /> },
  DELIVERED:       { label: "Đã giao",        color: "green",   icon: <CheckCircleOutlined /> },
  CANCELLED:       { label: "Đã hủy",         color: "red",     icon: <ExclamationCircleOutlined /> },
  DELIVERY_FAILED: { label: "Giao thất bại",  color: "volcano", icon: <ExclamationCircleOutlined /> },
  RETURNED:        { label: "Đã hoàn",        color: "purple",  icon: <ExclamationCircleOutlined /> },
};

// ─── Product Card (read-only, không có nút thêm giỏ hàng cho admin) ──────────
const AdminProductCard = ({ p }: { p: AiProduct }) => {
  const [selectedVariant, setSelectedVariant] = useState<AiVariant | null>(
    p.variants?.find((v) => v.stock > 0) ?? p.variants?.[0] ?? null
  );
  const discount =
    p.originalPrice && p.originalPrice > p.price
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : 0;

  return (
    <div className={styles.aiProductCard}>
      <a
        href={`/products/${p.productId}`}
        className={styles.aiProductImgWrap}
        target="_blank"
        rel="noreferrer"
      >
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.productName} className={styles.aiProductImg} />
        ) : (
          <div className={styles.aiProductImgPlaceholder}>
            <ShoppingCartOutlined />
          </div>
        )}
        {discount > 0 && <span className={styles.aiDiscountBadge}>-{discount}%</span>}
      </a>
      <div className={styles.aiProductInfo}>
        <a
          href={`/products/${p.productId}`}
          className={styles.aiProductName}
          target="_blank"
          rel="noreferrer"
        >
          {p.productName}
        </a>
        <div className={styles.aiProductPriceRow}>
          <span className={styles.aiPrice}>
            {(selectedVariant?.price ?? p.price).toLocaleString("vi-VN")}₫
          </span>
          {p.originalPrice && p.originalPrice > p.price && (
            <span className={styles.aiOriginalPrice}>
              {p.originalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
        {p.description && <p className={styles.aiProductDesc}>{p.description}</p>}

        {p.variants && p.variants.length > 1 && (
          <select
            className={styles.aiVariantSelect}
            value={selectedVariant?.variantId ?? ""}
            onChange={(e) =>
              setSelectedVariant(
                p.variants.find((v) => String(v.variantId) === e.target.value) ?? null
              )
            }
          >
            {p.variants.map((v) => (
              <option key={v.variantId} value={v.variantId} disabled={v.stock === 0}>
                {v.name} {v.stock === 0 ? "(Hết)" : v.stock <= 3 ? `(Còn ${v.stock})` : ""}
              </option>
            ))}
          </select>
        )}

        <a
          href={`/products/${p.productId}`}
          target="_blank"
          rel="noreferrer"
          className={styles.aiDetailLink}
        >
          Chi tiết <ArrowRightOutlined />
        </a>
      </div>
    </div>
  );
};

// ─── Order Card (read-only) ───────────────────────────────────────────────────
const AdminOrderCard = ({ order }: { order: any }) => {
  const s = ORDER_STATUS_MAP[order.status] ?? { label: order.status, color: "default", icon: null };
  return (
    <div className={styles.aiOrderCard}>
      <div className={styles.aiOrderHeader}>
        <span className={styles.aiOrderNum}>#{order.orderNumber}</span>
        <Tag color={s.color} icon={s.icon}>
          {s.label}
        </Tag>
      </div>
      <div className={styles.aiOrderItems}>
        {order.items?.slice(0, 2).map((item: any) => (
          <div key={item.id} className={styles.aiOrderItemRow}>
            {item.productImage && (
              <img
                src={item.productImage}
                alt={item.productName}
                className={styles.aiOrderItemImg}
              />
            )}
            <div className={styles.aiOrderItemInfo}>
              <span className={styles.aiOrderItemName}>{item.productName}</span>
              <span className={styles.aiOrderItemQty}>
                x{item.quantity} · {item.price?.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        ))}
        {order.items?.length > 2 && (
          <span className={styles.aiOrderMore}>+{order.items.length - 2} sản phẩm khác</span>
        )}
      </div>
      <div className={styles.aiOrderFooter}>
        <span className={styles.aiOrderTotal}>
          Tổng: <strong>{order.total?.toLocaleString("vi-VN")}₫</strong>
        </span>
        <span className={styles.aiOrderDate}>
          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </div>
  );
};

// ─── AI Bot Message renderer ──────────────────────────────────────────────────
const AiBotMessage = ({ data }: { data: AiResponse }) => {
  const text = data.message
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");

  return (
    <div className={styles.aiBotData}>
      <div className={styles.aiBotText} dangerouslySetInnerHTML={{ __html: text }} />

      {data.products && data.products.length > 0 && (
        <div className={styles.aiProducts}>
          {data.products.slice(0, 4).map((p) => (
            <AdminProductCard key={p.productId} p={p} />
          ))}
        </div>
      )}

      {(data as any).orders && (data as any).orders.length > 0 && (
        <div className={styles.aiOrders}>
          {(data as any).orders.slice(0, 3).map((o: any) => (
            <AdminOrderCard key={o.id} order={o} />
          ))}
        </div>
      )}

      {data.note && <div className={styles.aiNote}>💡 {data.note}</div>}

      {data.cta && (
        <a
          href={data.cta.url}
          target="_blank"
          rel="noreferrer"
          className={styles.aiCtaBtn}
        >
          {data.cta.label} <ArrowRightOutlined />
        </a>
      )}

      {data.suggestions && data.suggestions.length > 0 && (
        <div className={styles.aiSuggestions}>
          {data.suggestions.map((s, i) => (
            <span key={i} className={styles.aiChip}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main ChatBox ─────────────────────────────────────────────────────────────
export default function ChatBox({
  roomId,
  userId,
  role,
  room,
}: {
  roomId: number;
  userId: number;
  room?: Room;
  role: string;
}) {
  const { messages, connected, sendMessage } = useChat(roomId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const getInitials = (name?: string) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(-2)
      .join("")
      .toUpperCase() || "?";

  const displayName = role === "STAFF" ? room?.customerName : "Nhân viên hỗ trợ";

  return (
    <div className={styles.chatBox}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerAvatar}>
          {role === "STAFF" && room?.customerAvt ? (
            <img
              src={room.customerAvt}
              alt={room.customerName}
              className={styles.headerAvatarImg}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                (e.currentTarget.nextSibling as HTMLElement)?.removeAttribute("style");
              }}
            />
          ) : null}
          <span
            className={styles.headerAvatarInitials}
            style={role === "STAFF" && room?.customerAvt ? { display: "none" } : undefined}
          >
            {getInitials(role === "STAFF" ? room?.customerName : room?.staffName)}
          </span>
          <span
            className={`${styles.headerPresence} ${
              connected ? styles.presenceOnline : styles.presenceOffline
            }`}
          />
        </div>

        <div className={styles.headerInfo}>
          <span className={styles.headerName}>{displayName}</span>
          <span
            className={`${styles.headerStatus} ${
              connected ? styles.headerStatusOnline : styles.headerStatusOffline
            }`}
          >
            <span className={styles.statusPulse} />
            {connected ? "Đang kết nối" : "Mất kết nối"}
          </span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconBtn} title="Thông tin khách hàng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button className={styles.iconBtn} title="Kết thúc hội thoại">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyMessages}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>Chưa có tin nhắn nào</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isAi = msg.senderRole === "AI";
          const isMine = !isAi && msg.senderId === userId;
          const prevMsg = messages[index - 1];
          const showAvatar =
            !isMine &&
            (!prevMsg ||
              prevMsg.senderId !== msg.senderId ||
              prevMsg.senderRole !== msg.senderRole);

          const avatarUrl =
            isMine ? null : !isAi && role === "STAFF" ? room?.customerAvt : null;
          const name = isAi
            ? "🤖 AI"
            : isMine
            ? "Tôi"
            : role === "STAFF"
            ? room?.customerName
            : room?.staffName;
          const initials = isAi ? "AI" : getInitials(name);

          // Parse AI JSON content
          let aiData: AiResponse | null = null;
          if (isAi && msg.content && msg.content.trim().startsWith("{")) {
            try {
              aiData = JSON.parse(msg.content);
            } catch {
              // fallback to plain text
            }
          }

          return (
            <div
              key={msg.id}
              className={`${styles.msgRow} ${
                isMine ? styles.msgRowMine : styles.msgRowOther
              }`}
            >
              {/* Avatar */}
              {!isMine && (
                <div className={styles.msgAvatar}>
                  {showAvatar ? (
                    avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name}
                        className={styles.msgAvatarImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          (
                            e.currentTarget.nextSibling as HTMLElement
                          )?.removeAttribute("style");
                        }}
                      />
                    ) : null
                  ) : null}
                  {showAvatar && (
                    <span
                      className={styles.msgAvatarInitials}
                      style={{
                        ...(avatarUrl ? { display: "none" } : undefined),
                        ...(isAi
                          ? {
                              background:
                                "linear-gradient(135deg,#ab47bc,#7b1fa2)",
                              color: "#fff",
                              fontSize: 10,
                            }
                          : undefined),
                      }}
                    >
                      {initials}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.msgContent}>
                {showAvatar && !isMine && (
                  <span
                    className={styles.msgSenderName}
                    style={isAi ? { color: "#9c27b0", fontStyle: "italic" } : undefined}
                  >
                    {name}
                  </span>
                )}

                {/* ── Render AI JSON hoặc bubble thường ── */}
                {aiData ? (
                  <AiBotMessage data={aiData} />
                ) : (
                  <div
                    className={`${styles.bubble} ${
                      isMine ? styles.bubbleMine : styles.bubbleOther
                    }`}
                    style={
                      isAi
                        ? {
                            background: "#f3e5f5",
                            borderLeft: "3px solid #9c27b0",
                            color: "#4a148c",
                            fontStyle: "italic",
                          }
                        : undefined
                    }
                  >
                    {msg.content}
                  </div>
                )}

                <span
                  className={`${styles.msgTime} ${
                    isMine ? styles.msgTimeMine : styles.msgTimeOther
                  }`}
                >
                  {new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Nhập tin nhắn..."
          />
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!input.trim() || !connected}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        {!connected && (
          <div className={styles.disconnectBanner}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Đang mất kết nối — đang thử lại...
          </div>
        )}
      </div>
    </div>
  );
}