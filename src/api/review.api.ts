import { getData, postData } from "../app/axiosClient"
import type { Review, ReviewSummary } from "../types"
import type { ReviewRequest } from "../types/request.type"


export const reviewApi = {
  getReviewsByProductId: (id:number): Promise<ReviewSummary> =>
    getData<ReviewSummary>(`/reviews/products/${id}/reviews`),

  addReview: (id:number,payload:ReviewRequest): Promise<Review> =>
    postData<Review>(`/reviews/products/${id}/reviews`,payload),

}

