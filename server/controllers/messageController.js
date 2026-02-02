import axios from "axios";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";
import Chat from "../models/Chat.js"
import User from "../models/userModel.js"

// Text generate in gemini-3-flash-preview 
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        if (req.user.credits < 1) {
            return res.status(201).json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })

        chat?.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        res.status(200).json({ success: true, reply })

        chat?.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: `Text Message Error: ${error.message}` })
    }
}

// Image generate in gemini-3-flash-preview
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        if (req.user.credits < 2) {
            return res.status(201).json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const { chatId, prompt, isPublished } = req.body
        const chat = await Chat.findOne({ userId, _id: chatId })
        chat?.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false })

        // Encode the prompt 
        const encodedPrompt = encodeURIComponent(prompt)

        // Construct ImageKit AI generation URL 
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/chaiAi/${Date.now()}.png?tr=w-800,h-800`;

        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })

        // Convert to Base64 
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        // Upload to Imagekit Media Library 
        const uploadResponse = await imagekit.files.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "chatAI"
        })

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }

        res.status(200).json({ success: true, reply })

        chat?.messages.push(reply)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}