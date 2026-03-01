import { deleteData, deleteDataNoBody, getData, postData, putData } from "../app/axiosClient"
import type { Post, PostPayload, PostStatus } from "../types/entity.type";
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-based)
}


export interface UpdatePostPayload extends Partial<PostPayload> {}
export interface GetPostsParams {
  page?: number;
  size?: number;
  status?: PostStatus;
  category?: string;
  keyword?: string;
}
export const postApi = {

  getAll: async (params: GetPostsParams = {}): Promise<PageResponse<Post>> =>
     getData<PageResponse<Post>>(`/posts`, { params }),


   getPre: async (): Promise<Post[]> =>
     getData<Post[]>(`/posts/pretent`,),

   getPopular: async (): Promise<Post[]> =>
     getData<Post[]>(`/posts/popular`,),

  /**
   * Lấy chi tiết một bài viết theo ID
   */
  getById: async (id: number): Promise<Post> => 
    getData(`/posts/${id}`),

  /**
   * Tạo bài viết mới (draft hoặc published)
   */
  create: async (payload: PostPayload): Promise<Post> =>
    postData('/posts', payload),


  /**
   * Cập nhật bài viết (dùng cho edit page)
   */
  update: async (id: number, payload: UpdatePostPayload): Promise<Post> => 
    putData(`/posts/${id}`, payload),


  /**
   * Xóa bài viết
   */
  delete: async (id: number): Promise<void> =>
    deleteDataNoBody(`/posts/${id}`),

  /**
   * Thay đổi trạng thái bài viết (draft ↔ published)
   */
  updateStatus: async (id: number, status: PostStatus): Promise<Post> => 
    putData(`/posts/${id}/status`, { status }),
}

