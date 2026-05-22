import { Router } from 'express'
import { approveReview, fetchReviews, getReviews } from '../controllers/review.controller'


const router = Router()

router.post('/fetch', fetchReviews)
router.get('/', getReviews)
router.post('/approve', approveReview)

export default router