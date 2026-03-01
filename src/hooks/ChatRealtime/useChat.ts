import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosClient from "../../app/axiosClient";

interface Message {
  id: number;
  roomId: number;
  senderId: number;
  senderRole: string;
  content: string;
  sentAt: string;
}

export function useChat(roomId: number, userId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const fetchHistory=async()=>{
    const mes=await axiosClient.get(`/chat/rooms/${roomId}/messages`)
    setMessages(mes);
  }
  useEffect(() => {
    // Load lịch sử trước
    fetchHistory();
    
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws-chat"),
      onConnect: () => {
        setConnected(true);

        // Subscribe vào room
        client.subscribe(`/topic/room.${roomId}`, (msg) => {
          const newMsg: Message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, newMsg]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [roomId]);

  const sendMessage = useCallback((content: string, senderRole: string) => {
    clientRef.current?.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ roomId, senderId: userId, senderRole, content }),
    });
  }, [roomId, userId]);

  return { messages, connected, sendMessage };
}


export function useStaffNotifications(staffId: number, onNotify: (n: any) => void) {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/api/ws-chat"),
      onConnect: () => {
        // Room mới từ khách
        client.subscribe("/topic/staff.newRoom", (msg) => {
          onNotify({ type: "NEW_ROOM", data: JSON.parse(msg.body) });
        });

        // Tin nhắn mới trong room đang phụ trách
        client.subscribe(`/user/${staffId}/queue/notifications`, (msg) => {
          onNotify({ type: "NEW_MESSAGE", data: JSON.parse(msg.body) });
        });
      },
    });

    client.activate();
    return () => { client.deactivate(); };
  }, [staffId]);
}