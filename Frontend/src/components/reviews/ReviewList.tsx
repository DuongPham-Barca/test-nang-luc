import ReviewCompactCard from './ReviewCompactCard'
import type { Review } from '../../types/reviews.interface'

interface ReviewListProps {
    reviews: Review[]
    selectedReviewId?: string
    onSelectReview: (review: Review) => void
}

const ReviewList = ({
    reviews,
    selectedReviewId,
    onSelectReview,
}: ReviewListProps) => (
    <aside className="min-w-0">
        <div className="mb-3">
            <h2 className="text-xl font-semibold text-slate-950">Danh sách reviews</h2>
            <p className="text-sm text-slate-500">Chọn một đánh giá để xem và duyệt phản hồi.</p>
        </div>

        <div className="max-h-[calc(100vh-250px)] space-y-3 overflow-auto pr-1">
            {reviews.map((review) => (
                <button
                    key={review.id}
                    onClick={() => onSelectReview(review)}
                    className={`w-full rounded-lg text-left outline-none ring-cyan-200 transition focus:ring-4 ${selectedReviewId === review.id
                        ? 'border border-cyan-500 bg-cyan-50 shadow-sm'
                        : 'border border-transparent'
                        }`}
                >
                    <ReviewCompactCard review={review} />
                </button>
            ))}

            {reviews.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                    Chưa có review nào. Nhập Place ID để bắt đầu.
                </div>
            )}
        </div>
    </aside>
)

export default ReviewList
