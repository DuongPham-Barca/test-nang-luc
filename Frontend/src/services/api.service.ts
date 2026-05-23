import api from "./axios.customizer"
import type {
    ApproveReviewResponse,
    FetchGoogleReviewsResponse,
    GenerateAIRepliesResponse,
    Review,
} from '../types/reviews.interface'

export const fetchReviews = async () => {
    const res = await api.get<Review[]>('/reviews')

    return res.data
}

export const fetchGoogleReviews = async (
    placeId: string
) => {
    const res = await api.post<FetchGoogleReviewsResponse>(
        '/reviews/fetch',
        {
            placeId,
        }
    )

    return res.data
}

export const generateAIReplies = async (
    reviewId: string,
    options?: {
        force?: boolean
        signal?: AbortSignal
    }
) => {
    const res = await api.post<GenerateAIRepliesResponse>(
        `/ai/generate/${reviewId}`,
        {
            force: options?.force ?? false,
        },
        {
            signal: options?.signal,
        }
    )

    return res.data
}

export const approveReview = async (
    reviewId: string,
    tone: string,
    replyText: string
) => {
    const res = await api.post<ApproveReviewResponse>('/reviews/approve', {
        reviewId,
        tone,
        replyText,
    })

    return res.data
}
