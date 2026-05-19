import { getData, patchData, postData } from "../app/axiosClient";

export interface ChatRoom {
  id: number;
  customerId: number;
  customerName: string;
  customerAvt?: string;
  staffId?: number;
  staffName?: string;
  status: "WAITING" | "ACTIVE" | "CLOSED";
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId?: number;
  senderRole: "CUSTOMER" | "STAFF" | "AI";
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface AiHistoryEntry {
  role: "USER" | "AI";
  content: string;
}

export const chatApi = {
  // Tạo / lấy room cho customer
  startRoom: (customerId: number): Promise<ChatRoom> =>
    postData<ChatRoom>("/chat/start", { customerId }),

  // Lấy tin nhắn lịch sử của room
  getMessages: (roomId: number): Promise<ChatMessage[]> =>
    getData<ChatMessage[]>(`/chat/rooms/${roomId}/messages`),

  // Nhân viên nhận room
  acceptRoom: (roomId: number, staffId: number): Promise<any> =>
    postData(`/chat/accept`, { roomId, staffId }),

  // Đánh dấu đã đọc
  markAsRead: (roomId: number, userId: number): Promise<void> =>
    patchData(`/chat/rooms/${roomId}/read?userId=${userId}`, {}),

  // Lưu toàn bộ lịch sử AI vào room (khi khách chuyển sang nhân viên)
  saveAiHistory: (roomId: number, messages: AiHistoryEntry[]): Promise<void> =>
    postData<void>(`/chat/rooms/${roomId}/ai-history`, messages),

  // Lưu 1 tin nhắn AI vào room (theo realtime)
  saveAiMessage: (roomId: number, role: "USER" | "AI", content: string): Promise<ChatMessage> =>
    postData<ChatMessage>(`/chat/rooms/${roomId}/ai-message`, { role, content }),
};
