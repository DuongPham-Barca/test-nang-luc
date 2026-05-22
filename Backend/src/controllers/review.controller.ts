import { Request, Response } from "express";
import { db } from "../config/firebase";


const seedReviews = async (req: Request, res: Response) => {
    try {
        const reviews = [
            {
                authorName: 'John Smith',
                rating: 5,
                reviewText:
                    'Amazing hotel and very friendly staff.',

                status: 'pending',

                createdAt: new Date(),
            },

            {
                authorName: 'Sarah Lee',
                rating: 3,
                reviewText:
                    'Room was clean but check-in was slow.',

                status: 'pending',

                createdAt: new Date(),
            },

            {
                authorName: 'Michael',
                rating: 2,
                reviewText:
                    'Wifi connection was unstable during my stay.',

                status: 'pending',

                createdAt: new Date(),
            },
        ]

        for (const review of reviews) {
            await db.collection("reviews").add(review);
        }

        return res.status(200).json({ success: true, message: "Reviews added successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch reviews" });
    }
}

const getReviews = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection("reviews").orderBy("createdAt", "desc").get();
        const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch reviews" });
    }
}

export { getReviews, seedReviews };