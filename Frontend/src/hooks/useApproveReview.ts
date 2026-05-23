import { useState } from 'react'
import { approveReview } from '../services/api.service'
import type { SelectedReply } from './useAIReplies'

export const useApproveReview = (
    reviewId: string,
    refreshReviews?: () => Promise<void>,
) => {
    const [approving, setApproving] = useState(false)

    const approveSelectedReply = async (selectedReply: SelectedReply | null) => {
        if (!selectedReply) return

        setApproving(true)

        try {
            await approveReview(
                reviewId,
                selectedReply.tone,
                selectedReply.text,
            )

            await refreshReviews?.()
        } finally {
            setApproving(false)
        }
    }

    return {
        approving,
        approveSelectedReply,
    }
}
