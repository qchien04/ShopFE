import { getData, postData } from "../app/axiosClient"
import type { AiResponse } from "../types"
import type { Product } from "../types/product.type"

export const aiApi = {
  ask: (q: string, history: any[]): Promise<AiResponse> =>
    postData<AiResponse>("/ai/ask", { q, history }),

  getRelatedProducts: (productId: number, limit?: number): Promise<Product[]> =>
    getData<Product[]>("/ai/related", { productId, limit }),
}
