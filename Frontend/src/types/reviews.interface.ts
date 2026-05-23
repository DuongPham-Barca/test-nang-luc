export type ReviewStatus = 'pending' | 'resolved' | 'rejected'

export type ReplyTone = 'standard' | 'friendly' | 'recovery'

export interface Review {
    id: string
    placeName?: string
    authorName: string
    rating: number
    reviewText: string
    status: ReviewStatus
    approvedTone?: ReplyTone | string
    approvedReply?: string
}

export type AIReplies = Record<ReplyTone, string>

export interface GenerateAIRepliesResponse {
    success: boolean
    cached: boolean
    replies: AIReplies
}

export interface FetchGoogleReviewsResponse {
    success: boolean
    count: number
    reviews: Omit<Review, 'id'>[]
}

export interface ApproveReviewResponse {
    success: boolean
    message: string
}
