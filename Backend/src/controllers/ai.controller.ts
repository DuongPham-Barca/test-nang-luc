import { Request, Response } from 'express'
import { generateAIReplies } from "../services/ai.service"
import { db } from '../config/firebase'

export const generateReplies = async (
    req: Request,
    res: Response
) => {
    try {
        const { reviewId } = req.params

        const reviewDoc = await db
            .collection('reviews')
            .doc(reviewId as string)
            .get()

        if (!reviewDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Review not found',
            })
        }

        const review = reviewDoc.data()

        const replies = await generateAIReplies(
            review?.reviewText
        )

        const replyEntries = Object.entries(replies)

        for (const [tone, replyText] of replyEntries) {
            await db.collection('ai_replies').add({
                reviewId,

                tone,

                replyText,

                approved: false,

                createdAt: new Date(),
            })
        }

        res.json({
            success: true,
            replies,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Failed to generate AI replies',
        })
    }
}