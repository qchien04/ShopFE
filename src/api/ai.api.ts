import { getData } from "../app/axiosClient"
import type { AiResponse } from "../types"

export const aiApi = {
  ask: (q:string): Promise<AiResponse> =>
    getData<AiResponse>("/ai/ask",{q:q}),
}

