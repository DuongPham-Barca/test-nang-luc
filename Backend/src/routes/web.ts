import express, { Express } from "express";
import reviewRouter from "./reviews.route";
import aiRouter from "./ai.route";



const webRouter = (app: Express) => {
    app.use("/api/reviews", reviewRouter);
    app.use("/api/ai", aiRouter)
};

export default webRouter;

