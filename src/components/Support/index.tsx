import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/Auth/useAuth";
import ChatBox from "../ChatRealtime";
import axiosClient from "../../app/axiosClient";

export default function SupportWidget() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const fetchChat=async()=>{
    const ok:any=await axiosClient.post("/chat/start",{ customerId: user!.id })
    setRoomId(ok.id)
  }
  useEffect(() => {
    if (!user?.id) return;
    fetchChat();
  }, [user?.id]);

  return (
    <>
      {/* Nút tròn mở chat */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 420,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#1976d2",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 24,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
        }}
      >
        💬
      </div>

      {/* Popup chat */}
      {open && roomId && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            width: 350,
            height: 500,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1976d2",
              color: "white",
              padding: 10,
              fontWeight: "bold",
            }}
          >
            Hỗ trợ khách hàng
          </div>

          <div style={{ flex: 1 }}>
            <ChatBox
              roomId={roomId}
              userId={user!.id||1}
            />
          </div>
        </div>
      )}
    </>
  );
}