import Avatar from '../Avatar'
import RatingStars from '../RatingStars'
import { getStatusMeta } from '../reviewStatusMeta'
import AIReplyPanel from './AIReplyPanel'
import ReviewActions from './ReviewActions'
import { useAIReplies } from '../../hooks/useAIReplies'
import { useApproveReview } from '../../hooks/useApproveReview'
import type { Review } from '../../types/reviews.interface'

interface ReviewDetailCardProps {
    review: Review
    refreshReviews?: () => Promise<void>
}

const ReviewDetailCard = ({ review, refreshReviews }: ReviewDetailCardProps) => {
    const {
        replies,
        selectedReply,
        error,
        generating,
        regenerating,
        generateReplies,
        setSelectedReply,
    } = useAIReplies(review.id)

    const { approving, approveSelectedReply } = useApproveReview(
        review.id,
        refreshReviews,
    )

    const statusMeta = getStatusMeta(review.status)
    const rating = Math.max(0, Math.min(5, Math.round(review.rating)))
    const isResolved = review.status === 'resolved'

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <Avatar name={review.authorName} large />

                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-slate-950">{review.authorName}</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {review.placeName || 'Google Maps'}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <RatingStars rating={rating} />
                                <span className="text-sm font-semibold text-slate-700">{review.rating}.0</span>
                            </div>
                        </div>
                    </div>

                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${statusMeta.badgeClass}`}>
                        {statusMeta.smallIcon}
                        {statusMeta.label}
                    </span>
                </div>
            </div>

            <div className="space-y-6 p-5 md:p-6">
                <section>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Đánh giá gốc</h3>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                        {review.reviewText}
                    </div>
                </section>

                {isResolved && (
                    <section className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <h3 className="font-semibold text-green-800">
                            Câu trả lời đã duyệt
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-700">{review.approvedReply}</p>
                    </section>
                )}

                {!isResolved && (
                    <AIReplyPanel
                        replies={replies}
                        selectedReply={selectedReply}
                        error={error}
                        loading={generating}
                        onGenerateReplies={() => void generateReplies()}
                        onSelectReply={setSelectedReply}
                    />
                )}

                {!isResolved && (
                    <ReviewActions
                        regenerating={regenerating}
                        approving={approving}
                        selectedReply={selectedReply}
                        onApprove={() => void approveSelectedReply(selectedReply)}
                        onRegenerate={() => void generateReplies(true)}
                    />
                )}
            </div>
        </div>
    )
}

export default ReviewDetailCard