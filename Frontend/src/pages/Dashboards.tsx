import { useState } from 'react'
import PlaceIdForm from '../components/reviews/PlaceIdForm'
import ReviewDetailCard from '../components/reviews/ReviewDetailCard'
import ReviewList from '../components/reviews/ReviewList'
import ReviewStats from '../components/reviews/ReviewStats'
import { useReviews } from '../hooks/useReviews'

const Dashboard = () => {
    const [placeId, setPlaceId] = useState('')
    const {
        reviews,
        selectedReview,
        loading,
        loadReviews,
        importGoogleReviews,
        setSelectedReview,
    } = useReviews()

    return (
        <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
            <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
                <PlaceIdForm
                    placeId={placeId}
                    loading={loading}
                    onPlaceIdChange={setPlaceId}
                    onSubmit={() => void importGoogleReviews(placeId)}
                />

                <ReviewStats reviews={reviews} />

                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
                    <ReviewList
                        reviews={reviews}
                        selectedReviewId={selectedReview?.id}
                        onSelectReview={setSelectedReview}
                    />

                    <div className="min-w-0">
                        {selectedReview ? (
                            <ReviewDetailCard
                                key={selectedReview.id}
                                review={selectedReview}
                                refreshReviews={loadReviews}
                            />
                        ) : (
                            <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                                Chọn một review để xem chi tiết
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard
