import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatRealtime/useChat";
import styles from "./ChatBox.module.scss";
import type { Room } from "../../pages/Admin/ChatManager";

export default function ChatBox({ roomId, userId, role, room }: {
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
    name?.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase() || "?";

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
          <span className={`${styles.headerPresence} ${connected ? styles.presenceOnline : styles.presenceOffline}`} />
        </div>

        <div className={styles.headerInfo}>
          <span className={styles.headerName}>{displayName}</span>
          <span className={`${styles.headerStatus} ${connected ? styles.headerStatusOnline : styles.headerStatusOffline}`}>
            <span className={styles.statusPulse} />
            {connected ? "Đang kết nối" : "Mất kết nối"}
          </span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconBtn} title="Thông tin khách hàng">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <button className={styles.iconBtn} title="Kết thúc hội thoại">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.emptyMessages}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>Chưa có tin nhắn nào</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMine = msg.senderId === userId;
          const prevMsg = messages[index - 1];
          const showAvatar = !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId);

          const avatarUrl = isMine ? null : role === "STAFF" ? room?.customerAvt : null;
          const name = isMine ? "Tôi" : role === "STAFF" ? room?.customerName : room?.staffName;
          const initials = getInitials(name);

          return (
            <div
              key={msg.id}
              className={`${styles.msgRow} ${isMine ? styles.msgRowMine : styles.msgRowOther}`}
            >
              {/* Avatar placeholder to keep alignment */}
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
                          (e.currentTarget.nextSibling as HTMLElement)?.removeAttribute("style");
                        }}
                      />
                    ) : null
                  ) : null}
                  {showAvatar && (
                    <span
                      className={styles.msgAvatarInitials}
                      style={avatarUrl ? { display: "none" } : undefined}
                    >
                      {initials}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.msgContent}>
                {showAvatar && !isMine && (
                  <span className={styles.msgSenderName}>{name}</span>
                )}
                <div className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleOther}`}>
                  {msg.content}
                </div>
                <span className={`${styles.msgTime} ${isMine ? styles.msgTimeMine : styles.msgTimeOther}`}>
                  {new Date(msg.sentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
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
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        {!connected && (
          <div className={styles.disconnectBanner}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Đang mất kết nối — đang thử lại...
          </div>
        )}
      </div>
    </div>
  );
}