// pages/Staff/ChatManagePage.tsx
import { useEffect, useState } from "react";
import { useStaffNotifications } from "../../../hooks/ChatRealtime/useChat";
import ChatBox from "../../../components/ChatRealtime";
import { useAuth } from "../../../hooks/Auth/useAuth";
import axiosClient from "../../../app/axiosClient";

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
    const ok= await axiosClient.get("/chat/rooms?status=WAITING");
    setRooms(ok);
  }

  const acceptRoom=async(room:Room)=>{
    const ok=await axiosClient.post("/chat/rooms/accept",{ roomId: room.id, staffId: user!.id });
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
    fetch(`/api/chat/rooms/${room.id}/read?userId=${user!.id}`, { method: "PATCH" });

    // Nếu room đang WAITING thì nhận phụ trách
    if (room.status === "WAITING") {
      acceptRoom(room)
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Danh sách room */}
      <div style={{ width: 260, borderRight: "1px solid #eee", overflowY: "auto" }}>
        <div style={{ padding: "12px 16px", fontWeight: 600, borderBottom: "1px solid #eee" }}>
          Danh sách chat
        </div>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleSelectRoom(room)}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              background: selectedRoomId === room.id ? "#e6f4ff" : "transparent",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>Khách #{room.customerId}</div>
              <div style={{ fontSize: 12, color: room.status === "WAITING" ? "orange" : "green" }}>
                {room.status === "WAITING" ? "Đang chờ" : "Đang hỗ trợ"}
              </div>
            </div>
            {/* Badge tin nhắn chưa đọc */}
            {unreadMap[room.id] > 0 && (
              <div style={{
                background: "red", color: "#fff",
                borderRadius: "50%", width: 20, height: 20,
                fontSize: 11, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                {unreadMap[room.id]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat panel */}
      <div style={{ flex: 1 }}>
        {selectedRoomId ? (
          <ChatBox
            roomId={selectedRoomId}
            userId={user!.id||1}
            role="STAFF"
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>
            Chọn một cuộc hội thoại để bắt đầu
          </div>
        )}
      </div>
    </div>
  );
}