import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/ChatRealtime/useChat";
import styles from "./ChatBox.module.scss";

export default function ChatBox({ roomId, userId }: {
  roomId: number;
  userId: number;
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

  return (
    <div className={styles.chatBox}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerAvatar}>💬</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerTitle}>Chat hỗ trợ</div>
          <div className={styles.headerStatus}>
            <span className={`${styles.statusDot} ${connected ? styles.statusDotOnline : styles.statusDotOffline}`} />
            <span className={connected ? styles.statusTextOnline : styles.statusTextOffline}>
              {connected ? "Đang kết nối" : "Mất kết nối"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => {
          const isMine = msg.senderId === userId;
          return (
            <div key={msg.id} className={`${styles.messageRow} ${isMine ? styles.messageRowMine : styles.messageRowOther}`}>
              <div className={`${styles.avatar} ${isMine ? styles.avatarMine : styles.avatarOther}`}>
                {isMine ? "T" : "K"}
              </div>
              <div className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleOther}`}>
                {msg.content}
                <div className={styles.bubbleTime}>
                  {new Date(msg.sentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!input.trim() || !connected}
        >
          ➤
        </button>
      </div>
    </div>
  );
}