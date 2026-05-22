import { Router } from 'express'

import { generateReplies } from '../controllers/ai.controller'

const aiRouter = Router()

aiRouter.post('/generate/:reviewId', generateReplies)

export default aiRouter