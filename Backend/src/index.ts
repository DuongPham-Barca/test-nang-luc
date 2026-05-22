import express from 'express';
import dotenv, { config } from 'dotenv';
import { Request, Response } from 'express';
const app = express()
const port = process.env.PORT || 4000


dotenv.config();
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})