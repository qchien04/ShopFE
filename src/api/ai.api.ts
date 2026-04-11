import { postData } from "../app/axiosClient"
import type { AiResponse } from "../types"

export const aiApi = {
  ask: (q: string, history: any[]): Promise<AiResponse> =>
    postData<AiResponse>("/ai/ask", { q, history }),
}

