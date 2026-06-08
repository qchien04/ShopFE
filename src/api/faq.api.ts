import { getData, postData, putData, deleteDataNoBody } from '../app/axiosClient';

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQPayload {
  category: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

export const faqApi = {
  /** PUBLIC – Lấy tất cả FAQ (có thể lọc theo danh mục) */
  getAll: (category?: string): Promise<FAQItem[]> =>
    getData<FAQItem[]>('/faqs', category ? { category } : {}),

  /** ADMIN – Tạo FAQ mới */
  create: (payload: FAQPayload): Promise<FAQItem> =>
    postData<FAQItem>('/faqs/admin', payload),

  /** ADMIN – Cập nhật FAQ */
  update: (id: number, payload: FAQPayload): Promise<FAQItem> =>
    putData<FAQItem>(`/faqs/admin/${id}`, payload),

  /** ADMIN – Xóa FAQ */
  delete: (id: number): Promise<void> =>
    deleteDataNoBody(`/faqs/admin/${id}`),
};
