// pages/Staff/ChatManagePage.tsx
import { useEffect, useState } from "react";
import { useStaffNotifications } from "../../../hooks/ChatRealtime/useChat";
import ChatBox from "../../../components/ChatRealtime";
import { useAuth } from "../../../hooks/Auth/useAuth";
import axiosClient from "../../../app/axiosClient";
import styles from "./ChatManagePage.module.scss";

interface Room {
  id: number;
  customerId: number;
  status: string;
}

export default function ChatManagePage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({}); // roomId -> số tin chưa đọc

  // Lấy danh sách room đang chờ + active
  const fetchRoom=async()=>{
    const ok:Room[]= await axiosClient.get("/chat/rooms");
    setRooms(ok);
  }

  const acceptRoom=async(room:Room)=>{
    await axiosClient.post("/chat/accept",{ roomId: room.id, staffId: user!.id });
  }


  useEffect(() => {
    fetchRoom();
  }, []);

  // Lắng nghe thông báo realtime
  useStaffNotifications(user!.id||1, (notification) => {
    if (notification.type === "NEW_ROOM") {
      // Có khách mới vào
      setRooms((prev) => [notification.data, ...prev]);
    }

    if (notification.type === "NEW_MESSAGE") {
      const { roomId, unreadCount } = notification.data;
      // Cập nhật badge số tin chưa đọc
      setUnreadMap((prev) => ({ ...prev, [roomId]: unreadCount }));
    }
  });

  const handleSelectRoom = (room: Room) => {
    setSelectedRoomId(room.id);
    // Xóa badge khi mở room
    setUnreadMap((prev) => ({ ...prev, [room.id]: 0 }));
    // Đánh dấu đã đọc
    axiosClient.patch(`/chat/rooms/${room.id}/read?userId=${user!.id}`, { method: "PATCH" });

    // Nếu room đang WAITING thì nhận phụ trách
    if (room.status === "WAITING") {
      acceptRoom(room)
    }
  };

  return (
  <div className={styles.page}>
    {/* Sidebar */}
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>💬 Danh sách chat</h3>
        <div className={styles.sidebarMeta}>
          <span className={styles.dot} />
          {rooms.length} cuộc hội thoại
        </div>
      </div>

      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleSelectRoom(room)}
            className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.roomItemActive : ""}`}
          >
            <div className={styles.roomAvatar}>
              {room.customerId.toString().slice(-2)}
              <span className={`${styles.statusDot} ${
                room.status === "WAITING" ? styles.statusDotWaiting : styles.statusDotActive
              }`} />
            </div>

            <div className={styles.roomInfo}>
              <div className={styles.roomName}>Khách #{room.customerId}</div>
              <div className={room.status === "WAITING" ? styles.roomStatusWaiting : styles.roomStatusActive}>
                {room.status === "WAITING" ? "⏳ Đang chờ" : "✅ Đang hỗ trợ"}
              </div>
            </div>

            {unreadMap[room.id] > 0 && (
              <div className={styles.badge}>{unreadMap[room.id]}</div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Chat panel */}
    <div className={styles.chatPanel}>
      {selectedRoomId ? (
        <ChatBox roomId={selectedRoomId} userId={user!.id || 1} />
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💬</div>
          <div className={styles.emptyText}>Chọn một cuộc hội thoại</div>
          <div className={styles.emptySub}>để bắt đầu hỗ trợ khách hàng</div>
        </div>
      )}
    </div>
  </div>
);
}