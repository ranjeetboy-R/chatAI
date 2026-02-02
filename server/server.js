import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from "cors";
import userRouter from './routes/userRoute.js';
import database from './configs/database.js';
import chatRouter from './routes/chatRoute.js';
import messageRouter from './routes/messageRouter.js';
import creditRouter from './routes/creditRouter.js';
import { stripeWebHooks } from './controllers/webhooks.js';

const app = express()
const port = process.env.PORT || 4000;

// Database 
database()

// Stripe webhooks 
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send(`Hello Ranjeet, Server is running on port ${port}`)
})

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})