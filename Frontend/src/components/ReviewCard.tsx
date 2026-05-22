import { useState } from 'react'
import type { Review } from '../pages/Dashboards'
import { approveReview, generateAIReplies } from '../services/api.service'


interface AIReplies {
    standard: string
    friendly: string
    recovery: string
}

interface Props {
    review: Review
    refreshReviews: () => Promise<void>
}

const ReviewCard = ({ review, refreshReviews }: Props) => {
    const [replies, setReplies] = useState<AIReplies | null>(null)
    const [generating, setGenerating] = useState(false)
    const [approvingTone, setApprovingTone] = useState('')
    const [error, setError] = useState('')

    const handleGenerateAI = async () => {
        try {
            setGenerating(true)
            setError('')

            const data = await generateAIReplies(review.id)

            setReplies(data.replies)
        } catch (error) {
            console.error(error)
            setError('Generate AI thất bại')
        } finally {
            setGenerating(false)
        }
    }

    const handleApprove = async (
        tone: string,
        replyText: string
    ) => {
        try {
            setApprovingTone(tone)
            setError('')

            await approveReview(review.id, tone, replyText)

            setReplies(null)

            await refreshReviews()
        } catch (error) {
            console.error(error)
            setError('Approve thất bại')
        } finally {
            setApprovingTone('')
        }
    }

    const isResolved = review.status === 'resolved'

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                background: '#fff',
            }}
        >
            <div>
                <h3 style={{ marginBottom: '6px' }}>
                    {review.authorName}
                </h3>

                {review.placeName && (
                    <p style={{ margin: '4px 0', color: '#555' }}>
                        {review.placeName}
                    </p>
                )}

                <p>⭐ {review.rating}</p>

                <p>{review.reviewText}</p>

                <p>
                    Status:{' '}
                    <strong
                        style={{
                            color: isResolved ? 'green' : 'orange',
                        }}
                    >
                        {review.status}
                    </strong>
                </p>
            </div>

            {isResolved && (
                <div
                    style={{
                        marginTop: '12px',
                        padding: '12px',
                        background: '#f0fff4',
                        border: '1px solid #b7ebc6',
                        borderRadius: '8px',
                    }}
                >
                    <strong>
                        Approved reply
                        {review.approvedTone
                            ? ` (${review.approvedTone})`
                            : ''}
                        :
                    </strong>

                    <p style={{ marginTop: '8px' }}>
                        {review.approvedReply}
                    </p>
                </div>
            )}

            {!isResolved && (
                <button
                    onClick={handleGenerateAI}
                    disabled={generating}
                    style={{
                        marginTop: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        cursor: generating ? 'not-allowed' : 'pointer',
                    }}
                >
                    {generating ? 'Generating...' : 'Generate AI'}
                </button>
            )}

            {error && (
                <p style={{ color: 'red', marginTop: '8px' }}>
                    {error}
                </p>
            )}

            {replies && !isResolved && (
                <div style={{ marginTop: '16px' }}>
                    <h4>AI Suggestions</h4>

                    {Object.entries(replies).map(([tone, replyText]) => (
                        <div
                            key={tone}
                            style={{
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                padding: '12px',
                                marginTop: '10px',
                                background: '#fafafa',
                            }}
                        >
                            <strong>{tone}</strong>

                            <p style={{ marginTop: '8px' }}>
                                {replyText}
                            </p>

                            <button
                                onClick={() =>
                                    handleApprove(tone, replyText)
                                }
                                disabled={approvingTone === tone}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor:
                                        approvingTone === tone
                                            ? 'not-allowed'
                                            : 'pointer',
                                }}
                            >
                                {approvingTone === tone
                                    ? 'Approving...'
                                    : 'Approve'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewCard