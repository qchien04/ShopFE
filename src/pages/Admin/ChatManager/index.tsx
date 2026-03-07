import { useCallback, useEffect, useState } from "react";
import { useStaffNotifications } from "../../../hooks/ChatRealtime/useChat";
import ChatBox from "../../../components/ChatRealtime";
import { useAuth } from "../../../hooks/Auth/useAuth";
import axiosClient from "../../../app/axiosClient";
import styles from "./ChatManagePage.module.scss";

export interface Room {
  id: number;
  customerId: number;
  customerName: string;
  customerAvt: string;
  staffId?: number;
  staffName?: string;
  status: "WAITING" | "ACTIVE" | "CLOSED";
}

export default function ChatManagePage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState<"ALL" | "WAITING" | "ACTIVE">("ALL");

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const fetchRooms = async () => {
    const data: Room[] = await axiosClient.get("/chat/rooms");
    setRooms(data);
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleNotification = useCallback((notification: any) => {
    if (notification.type === "NEW_ROOM") {
      setRooms((prev) => [notification.data, ...prev]);
    }
    if (notification.type === "NEW_MESSAGE") {
      const { roomId, unreadCount } = notification.data;
      setUnreadMap((prev) => ({ ...prev, [roomId]: unreadCount }));
    }
  }, []);

  useStaffNotifications(user!.id || 1, handleNotification);

  const handleSelectRoom = async (room: Room) => {
    setSelectedRoomId(room.id);
    setUnreadMap((prev) => ({ ...prev, [room.id]: 0 }));
    axiosClient.patch(`/chat/rooms/${room.id}/read?userId=${user!.id}`);
    if (room.status === "WAITING") {
      await axiosClient.post("/chat/accept", { roomId: room.id, staffId: user!.id });
      setRooms((prev) =>
        prev.map((r) => r.id === room.id ? { ...r, status: "ACTIVE" } : r)
      );
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase() || "?";

  const waitingCount = rooms.filter((r) => r.status === "WAITING").length;
  const activeCount = rooms.filter((r) => r.status === "ACTIVE").length;

  const filteredRooms = rooms.filter((r) => {
    if (filter === "WAITING") return r.status === "WAITING";
    if (filter === "ACTIVE") return r.status === "ACTIVE";
    return true;
  });

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarHeading}>
            <div className={styles.headingLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h2>Hỗ trợ khách hàng</h2>
            </div>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot} />
              <span>Live</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{activeCount}</span>
              <span className={styles.statLabel}>Đang hỗ trợ</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNum} data-warn={waitingCount > 0 ? "true" : undefined}>
                {waitingCount}
              </span>
              <span className={styles.statLabel}>Đang chờ</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNum}>{rooms.length}</span>
              <span className={styles.statLabel}>Tổng</span>
            </div>
          </div>

          <div className={styles.filterRow}>
            {(["ALL", "WAITING", "ACTIVE"] as const).map((tab) => (
              <button
                key={tab}
                className={`${styles.filterBtn} ${filter === tab ? styles.filterBtnActive : ""}`}
                onClick={() => setFilter(tab)}
              >
                {tab === "ALL" && "Tất cả"}
                {tab === "WAITING" && "Chờ"}
                {tab === "ACTIVE" && "Đang hỗ trợ"}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.roomList}>
          {filteredRooms.length === 0 && (
            <div className={styles.emptyList}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Không có hội thoại</p>
            </div>
          )}
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleSelectRoom(room)}
              className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.roomItemActive : ""} ${room.status === "WAITING" ? styles.roomItemWaiting : ""}`}
            >
              <div className={styles.avatarWrap}>
                {room.customerAvt ? (
                  <img
                    src={room.customerAvt}
                    alt={room.customerName}
                    className={styles.avatarImg}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      (e.currentTarget.nextElementSibling as HTMLElement)?.removeAttribute("style");
                    }}
                  />
                ) : null}
                <span
                  className={styles.avatarInitials}
                  style={room.customerAvt ? { display: "none" } : undefined}
                >
                  {getInitials(room.customerName)}
                </span>
                <span className={`${styles.presenceDot} ${room.status === "WAITING" ? styles.presenceWaiting : styles.presenceActive}`} />
              </div>

              <div className={styles.roomMeta}>
                <span className={styles.roomName}>{room.customerName}</span>
                <span className={`${styles.roomTag} ${room.status === "WAITING" ? styles.roomTagWaiting : styles.roomTagActive}`}>
                  {room.status === "WAITING" ? "Chờ phản hồi" : "Đang hỗ trợ"}
                </span>
              </div>

              {unreadMap[room.id] > 0 && (
                <span className={styles.badge}>{unreadMap[room.id]}</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.chatPanel}>
        {selectedRoomId && selectedRoom ? (
          <ChatBox
            roomId={selectedRoomId}
            userId={user!.id || 1}
            role="STAFF"
            room={selectedRoom}
          />
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIllustration}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Chọn một cuộc hội thoại</h3>
            <p>để bắt đầu hỗ trợ khách hàng</p>
          </div>
        )}
      </main>
    </div>
  );
}