import express from 'express'
import { getPublishedImages, getUser, login, register } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/getUser', protect, getUser)
userRouter.get('/published-images', getPublishedImages)

export default userRouter