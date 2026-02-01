import express from 'express'
import { protect } from '../middleware/auth.js'
import { createChat, deleteChat, getChat } from '../controllers/chatController.js'

const chatRouter = express.Router()

chatRouter.post('/create', protect, createChat)
chatRouter.get('/get', protect, getChat)
chatRouter.delete('/delete', protect, deleteChat)

export default chatRouter;