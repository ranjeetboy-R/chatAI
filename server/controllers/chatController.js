import Chat from "../models/Chat.js";

// Create chat 
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id;

        const chatData = {
            userId,
            name: 'New Chat',
            userName: req.user.name,
            message: []
        }

        await Chat.create(chatData)

        res.status(200).json({ success: true, message: "Chat created" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Getting all chat 
export const getChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        res.status(200).json({ success: true, chats })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Delete selected chat 
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId } = req.body;
        const deleteChat = await Chat.findOneAndDelete({ _id: chatId, userId })

        if (!deleteChat) {
          return res.status(404).json({ success: false, message: "Chat not found" })  
        }

        res.status(200).json({ success: true, message: "Chat history delete successfully" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

