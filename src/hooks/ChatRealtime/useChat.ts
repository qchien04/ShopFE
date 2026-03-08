import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosClient from "../../app/axiosClient";
import { BASE_URL } from "../../app/const";

interface Message {
  id: number;
  roomId: number;
  senderId: number;
  senderRole: string;
  content: string;
  sentAt: string;
}

// ── Helper lấy token ──────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("jwtToken") ?? "";

export function useChat(roomId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const fetchHistory=async()=>{
    const mes:Message[]=await axiosClient.get(`/chat/rooms/${roomId}/messages`)
    setMessages(mes);
  }
  useEffect(() => {
    // Load lịch sử
    fetchHistory();
    console.log(getToken())
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
      // ── Gửi JWT 1 lần lúc CONNECT ─────────────────────────────────────────
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },

      onConnect: () => {
        setConnected(true);

        // Join room — server kiểm tra quyền 1 lần rồi cache vào session
        client.publish({
          destination: "/app/chat.join",
          body: JSON.stringify(roomId),
        });

        // Subscribe nhận tin nhắn
        client.subscribe(`/topic/room.${roomId}`, (msg) => {
          const newMsg: Message = JSON.parse(msg.body);
          setMessages((prev) => {
            // Tránh duplicate nếu server echo lại
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        });
      },

      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [roomId]);

  // Chỉ gửi content — roomId/userId lấy từ session phía server
  const sendMessage = useCallback((content: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: "/app/chat.send",
      body: content,
    });
  }, []);

  return { messages, connected, sendMessage };
}

// ── Staff notifications ───────────────────────────────────────────────────────
export function useStaffNotifications(staffId: number, onNotify: (n: any) => void) {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws-chat"),

      // ── JWT cho staff connection ───────────────────────────────────────────
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },

      onConnect: () => {
        // Room mới từ khách
        client.subscribe("/topic/staff.newRoom", (msg) => {
          onNotify({ type: "NEW_ROOM", data: JSON.parse(msg.body) });
        });

        // Notification cá nhân — server tự route theo Principal, không cần staffId
        client.subscribe("/user/queue/notifications", (msg) => {
          onNotify({ type: "NEW_MESSAGE", data: JSON.parse(msg.body) });
        });
      },

      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    client.activate();
    return () => { client.deactivate(); };
  }, [staffId]);
}