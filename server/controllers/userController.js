import User from "../models/userModel.js"
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import Chat from "../models/Chat.js";

// Generate token 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' })
}

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(404).json({ success: false, message: "All fields are required !!" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exist, please login !!" })
        }

        const hasedPassword = await bcrypt.hash(password, 12)

        const newUser = await User.create({
            name, email, password: hasedPassword
        })

        const token = generateToken(newUser._id)

        res.status(201).json({
            success: true,
            message: "User register successfully",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).json({ success: false, message: "All fields are required !!" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const isMatched = await bcrypt.compare(password, existingUser.password)
        if (!isMatched) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const token = generateToken(existingUser._id)

        res.status(200).json({
            success: true,
            message: "User login successfully",
            token,
            user: {
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ success: true, user })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// API to get published images 
export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessage = await Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "messages.isImage": true,
                    "messages.isPublished": true
                }
            },
            {
                $project: {
                    _id: 0,
                    imageUrl: "$messages.content",
                    userName: "$userName"
                }
            }
        ])

        res.status(200).json({success: true, images: publishedImageMessage.reverse()})
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}