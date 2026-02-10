import { getData } from "../app/axiosClient"

export const aiApi = {
  ask: (q:string): Promise<string> =>
    getData<string>("/ai/ask",{q:q}),
}

