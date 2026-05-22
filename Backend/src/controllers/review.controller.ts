import { Request, Response } from 'express'
import { fetchGooglePlaceReviews } from '../services/gg.service'
import { db } from '../config/firebase'



export const fetchReviews = async (
    req: Request,
    res: Response
) => {
    try {
        const { placeId } = req.body

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: 'placeId is required',
            })
        }

        const reviews = await fetchGooglePlaceReviews(placeId)

        if (reviews.length === 0) {
            return res.json({
                success: true,
                count: 0,
                reviews: [],
            })
        }

        const batch = db.batch()

        reviews.forEach((review) => {
            const ref = db.collection('reviews').doc()

            batch.set(ref, review)
        })

        await batch.commit()

        return res.json({
            success: true,
            count: reviews.length,
            reviews,
        })
    } catch (error) {
        console.error('Fetch Google reviews error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Google reviews',
        })
    }
}

export const getReviews = async (
    req: Request,
    res: Response
) => {
    try {
        const snapshot = await db
            .collection('reviews')
            .orderBy('createdAt', 'desc')
            .get()

        const reviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        return res.json(reviews)
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            success: false,
            message: 'Failed to get reviews',
        })
    }
}

export const approveReview = async (req: Request, res: Response) => {
    try {
        const { reviewId, tone, replyText } = req.body

        if (!reviewId || !tone || !replyText) {
            return res.status(400).json({
                success: false,
                message: 'reviewId, tone and replyText are required',
            })
        }

        await db.collection('reviews').doc(reviewId).update({
            status: 'resolved',
            approvedTone: tone,
            approvedReply: replyText,
            approvedAt: new Date(),
        })

        const snapshot = await db
            .collection('ai_replies')
            .where('reviewId', '==', reviewId)
            .where('tone', '==', tone)
            .get()

        const batch = db.batch()

        snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, {
                approved: true,
            })
        })

        await batch.commit()

        return res.json({
            success: true,
            message: 'Review approved successfully',
        })
    } catch (error) {
        console.error('Approve review error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to approve review',
        })
    }
}