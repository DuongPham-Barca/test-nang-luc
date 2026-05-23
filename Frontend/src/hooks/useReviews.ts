import { useCallback, useEffect, useState } from 'react'
import { fetchGoogleReviews, fetchReviews } from '../services/api.service'
import type { Review } from '../types/reviews.interface'

export const useReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [loading, setLoading] = useState(false)

    const loadReviews = useCallback(async () => {
        const data = await fetchReviews()

        setReviews(data)
        setSelectedReview((current) => {
            if (!current) return data[0] || null

            return data.find((review) => review.id === current.id) || data[0] || null
        })
    }, [])

    const importGoogleReviews = useCallback(
        async (placeId: string) => {
            if (!placeId.trim()) return

            setLoading(true)

            try {
                await fetchGoogleReviews(placeId)
                await loadReviews()
            } finally {
                setLoading(false)
            }
        },
        [loadReviews],
    )

    useEffect(() => {
        void loadReviews()
    }, [loadReviews])

    return {
        reviews,
        selectedReview,
        loading,
        loadReviews,
        importGoogleReviews,
        setSelectedReview,
    }
}
