import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { fetchGoogleReviews, fetchReviews } from '../services/api.service'
import type { Review } from '../types/reviews.interface'

export const useReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [loading, setLoading] = useState(false)
    const [placeError, setPlaceError] = useState('')

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
            setPlaceError('')

            try {
                await fetchGoogleReviews(placeId)
                await loadReviews()
            } catch (error) {
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 404 &&
                    error.response?.data?.code === 'PLACE_NOT_FOUND'
                ) {
                    setPlaceError('Không tìm thấy Place ID. Vui lòng kiểm tra lại.')
                    return
                }

                setPlaceError('Không tìm thấy Place ID. Vui lòng kiểm tra lại.')
            } finally {
                setLoading(false)
            }
        },
        [loadReviews],
    )

    useEffect(() => {
        let active = true

        fetchReviews().then((data) => {
            if (!active) return

            setReviews(data)
            setSelectedReview((current) => {
                if (!current) return data[0] || null

                return data.find((review) => review.id === current.id) || data[0] || null
            })
        })

        return () => {
            active = false
        }
    }, [])

    return {
        reviews,
        selectedReview,
        loading,
        placeError,
        loadReviews,
        importGoogleReviews,
        setSelectedReview,
    }
}
