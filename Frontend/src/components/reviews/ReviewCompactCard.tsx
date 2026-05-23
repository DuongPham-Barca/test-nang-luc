import Avatar from '../Avatar'
import RatingStars from '../RatingStars'
import { getStatusMeta } from '../reviewStatusMeta'
import type { Review } from '../../types/reviews.interface'

interface ReviewCompactCardProps {
    review: Review
}

const ReviewCompactCard = ({ review }: ReviewCompactCardProps) => {
    const statusMeta = getStatusMeta(review.status)
    const rating = Math.max(0, Math.min(5, Math.round(review.rating)))

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-300 hover:shadow-md">
            <div className="flex items-start gap-3">
                <Avatar name={review.authorName} />

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-950">{review.authorName}</h3>
                            <p className="text-xs text-slate-500">Google Review</p>
                        </div>

                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${statusMeta.softClass}`}>
                            {statusMeta.icon}
                        </span>
                    </div>

                    <RatingStars rating={rating} />

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {review.reviewText}
                    </p>

                    <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.badgeClass}`}>
                        {statusMeta.smallIcon}
                        {statusMeta.label}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ReviewCompactCard
