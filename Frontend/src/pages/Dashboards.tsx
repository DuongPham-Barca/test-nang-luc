import { useEffect, useState } from 'react'
import ReviewCard from '../components/ReviewCard'
import { fetchGoogleReviews, fetchReviews } from '../services/api.service'


export interface Review {
    id: string
    placeId?: string
    placeName?: string
    authorName: string
    rating: number
    reviewText: string
    status: 'pending' | 'resolved'
    approvedTone?: string
    approvedReply?: string
}

const Dashboard = () => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [placeId, setPlaceId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadReviews = async () => {
        try {
            setError('')

            const data = await fetchReviews()

            setReviews(data)
        } catch (error) {
            console.error(error)
            setError('Không thể tải danh sách reviews')
        }
    }

    const handleFetchGoogleReviews = async () => {
        if (!placeId.trim()) {
            setError('Vui lòng nhập Google Place ID')
            return
        }

        try {
            setLoading(true)
            setError('')

            await fetchGoogleReviews(placeId.trim())

            await loadReviews()

            setPlaceId('')
        } catch (error) {
            console.error(error)
            setError('Không thể lấy reviews từ Google Places')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadReviews()
    }, [])

    return (
        <div
            style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '24px',
            }}
        >
            <h1>AI Review Dashboard</h1>

            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '24px',
                }}
            >
                <input
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    placeholder="Enter Google Place ID"
                    style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                    }}
                />

                <button
                    onClick={handleFetchGoogleReviews}
                    disabled={loading}
                    style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Fetching...' : 'Fetch Reviews'}
                </button>
            </div>

            {error && (
                <p style={{ color: 'red', marginTop: '12px' }}>
                    {error}
                </p>
            )}

            <div style={{ marginTop: '24px' }}>
                {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            refreshReviews={loadReviews}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Dashboard