import express from 'express';
import dotenv, { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import webRouter from './routes/web';
dotenv.config();
const app = express()
const port = process.env.PORT


dotenv.config();
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