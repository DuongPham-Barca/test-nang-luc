import express from 'express';
import dotenv, { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import webRouter from './routes/web';
dotenv.config();
const app = express()
const port = process.env.PORT


dotenv.config();

// config cors
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

//middleware
app.use(express.json());
app.use(cookieParser());

// parse URL-encoded
app.use(express.urlencoded({ extended: true }));

//config router
webRouter(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})