import { useEffect, useState } from "react";
import ChatBox from "../ChatRealtime";
import axiosClient from "../../app/axiosClient";
import styles from "./SupportWidget.module.scss";
import { useAppSelector, type RootState } from "../../app/store";
import { FloatButton, Badge } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";

export default function SupportWidget() {
  const { isAuthenticated, userAccount: user } = useAppSelector(
    (state: RootState) => state.auth
  );
  const [roomId, setRoomId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchChat = async () => {
    const ok: any = await axiosClient.post("/chat/start", { customerId: user!.id });
    setRoomId(ok.id);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchChat();
  }, [user?.id]);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) setUnread(0);
  };

  return (
    <div className={styles.root}>
      {/* ── Popup ── */}
      <div className={`${styles.popup} ${open ? styles.popupOpen : ""}`}>
        {/* Body */}
        <div className={styles.popupBody}>
          {!isAuthenticated ? (
            // Chưa đăng nhập
            <div className={styles.guestState}>
              <div className={styles.guestIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <p className={styles.guestTitle}>Vui lòng đăng nhập</p>
              <p className={styles.guestSub}>để được tư vấn và hỗ trợ trực tiếp</p>
            </div>
          ) : roomId ? (
            // Đã đăng nhập + có roomId
            <ChatBox
              roomId={roomId}
              userId={user!.id || 1}
              role="CUSTOMER"
            />
          ) : (
            // Đang load roomId
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <span>Đang kết nối...</span>
            </div>
          )}
        </div>

      </div>

      <Badge count={!open ? unread : 0}>
        <FloatButton
          icon={open ? <CloseOutlined /> : <MessageOutlined />}
          onClick={handleOpen}
          style={{
            width:60,
            height:60,
            right: 24,
            bottom:24
          }}
        />
      </Badge>
    </div>
  );
}