import { Router } from "express";
import { getReviews, seedReviews } from "../controllers/review.controller";

const reviewRouter = Router();

reviewRouter.get("/", getReviews)
reviewRouter.post("/seed", seedReviews)

export default reviewRouter;