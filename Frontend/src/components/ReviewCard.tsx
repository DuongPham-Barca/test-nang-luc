import ReviewCompactCard from './reviews/ReviewCompactCard'
import ReviewDetailCard from './reviews/ReviewDetailCard'
import type { Review } from '../types/reviews.interface'

interface Props {
    review: Review
    compact?: boolean
    detail?: boolean
    refreshReviews?: () => Promise<void>
}

const ReviewCard = ({ review, compact, refreshReviews }: Props) => {
    if (compact) {
        return <ReviewCompactCard review={review} />
    }

    return (
        <ReviewDetailCard
            review={review}
            refreshReviews={refreshReviews}
        />
    )
}

export default ReviewCard
