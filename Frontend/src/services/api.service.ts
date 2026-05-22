import api from "./axios.customizer"

export const fetchReviews = async () => {
    const res = await api.get('/reviews')

    return res.data
}

export const fetchGoogleReviews = async (
    placeId: string
) => {
    const res = await api.post(
        '/reviews/fetch',
        {
            placeId,
        }
    )

    return res.data
}

export const generateAIReplies = async (
    reviewId: string
) => {
    const res = await api.post(
        `/ai/generate/${reviewId}`
    )

    return res.data
}

export const approveReview = async (
    reviewId: string,
    tone: string,
    replyText: string
) => {
    const res = await api.post('/reviews/approve', {
        reviewId,
        tone,
        replyText,
    })

    return res.data
}