import { Request, Response } from 'express'
import { generateAIReplies } from '../services/ai.service'
import type { AIProviderError, AIReplies } from '../services/ai.service'
import { db } from '../config/firebase'

type ReplyTone = keyof AIReplies

const REPLY_TONES: ReplyTone[] = ['standard', 'friendly', 'recovery']

const FALLBACK_REPLIES: AIReplies = {
    standard: 'Cảm ơn quý khách đã chia sẻ đánh giá. Chúng tôi ghi nhận phản hồi này và sẽ tiếp tục cải thiện chất lượng dịch vụ.',
    friendly: 'Cảm ơn bạn rất nhiều vì đã để lại đánh giá. Khách sạn rất vui khi nhận được góp ý và mong có dịp phục vụ bạn tốt hơn trong lần tới.',
    recovery: 'Chúng tôi rất tiếc vì trải nghiệm của quý khách chưa như mong đợi. Đội ngũ sẽ xem xét phản hồi này nghiêm túc và cải thiện trong thời gian sớm nhất.',
}

const getCachedReplies = (
    docs: FirebaseFirestore.QueryDocumentSnapshot[],
): AIReplies | null => {
    const replies = {} as Partial<AIReplies>

    docs.forEach((doc) => {
        const data = doc.data()

        if (
            REPLY_TONES.includes(data.tone) &&
            typeof data.replyText === 'string'
        ) {
            replies[data.tone as ReplyTone] = data.replyText
        }
    })

    if (
        replies.standard &&
        replies.friendly &&
        replies.recovery
    ) {
        return {
            standard: replies.standard,
            friendly: replies.friendly,
            recovery: replies.recovery,
        }
    }

    return null
}

const saveReplies = async (
    reviewId: string,
    replies: AIReplies,
) => {
    const batch = db.batch()

    REPLY_TONES.forEach((tone) => {
        const ref = db.collection('ai_replies').doc()

        batch.set(ref, {
            reviewId,
            tone,
            replyText: replies[tone],
            approved: false,
            createdAt: new Date(),
        })
    })

    await batch.commit()
}

const deleteCachedReplies = async (
    docs: FirebaseFirestore.QueryDocumentSnapshot[],
) => {
    if (docs.length === 0) return

    const batch = db.batch()

    docs.forEach((doc) => {
        batch.delete(doc.ref)
    })

    await batch.commit()
}

const sendAIError = (
    error: AIProviderError,
    res: Response,
) => {
    if (error.status === 401) {
        return res.status(401).json({
            success: false,
            code: 'AI_AUTHENTICATION_FAILED',
            message: 'AI API key is invalid or missing.',
        })
    }

    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            code: error.code || 'AI_RATE_LIMIT_EXCEEDED',
            message: 'AI provider quota or rate limit exceeded. Please retry later or check your API key billing/quota.',
            retryDelay: error.retryDelay || null,
        })
    }

    return res.status(500).json({
        success: false,
        message: 'Failed to generate AI replies',
    })
}

const isQuotaError = (error: AIProviderError) => {
    return error.status === 429
}

export const generateReplies = async (
    req: Request,
    res: Response,
) => {
    try {
        const { reviewId } = req.params
        const force = req.body?.force === true

        if (typeof reviewId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'reviewId is required',
            })
        }

        const reviewDoc = await db
            .collection('reviews')
            .doc(reviewId)
            .get()

        if (!reviewDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            })
        }

        const cachedSnapshot = await db
            .collection('ai_replies')
            .where('reviewId', '==', reviewId)
            .get()

        if (!force) {
            const cachedReplies = getCachedReplies(cachedSnapshot.docs)

            if (cachedReplies) {
                return res.json({
                    success: true,
                    cached: true,
                    replies: cachedReplies,
                })
            }
        }

        const review = reviewDoc.data()
        const reviewText = typeof review?.reviewText === 'string'
            ? review.reviewText
            : ''

        let fallback = false
        let replies: AIReplies

        try {
            replies = await generateAIReplies(reviewText)
        } catch (error) {
            const aiError = error as AIProviderError

            if (!isQuotaError(aiError)) {
                throw error
            }

            fallback = true
            replies = FALLBACK_REPLIES
        }

        if (force) {
            await deleteCachedReplies(cachedSnapshot.docs)
        }

        await saveReplies(reviewId, replies)

        return res.json({
            success: true,
            cached: false,
            fallback,
            replies,
        })
    } catch (error) {
        console.error(error)

        return sendAIError(error as AIProviderError, res)
    }
}
