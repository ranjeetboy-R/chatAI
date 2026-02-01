import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized user !!"})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded?.id

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({message: "User not found !!"})
        }

        req.user = user;
        next()
    } 
    catch (error) {
      return res.status(401).json({success: false, message: error.message || "Invalid or expired token !!"})  
    }
}