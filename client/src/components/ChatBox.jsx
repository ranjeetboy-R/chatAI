import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import { Images, Send, SquareStop, TextInitial } from "lucide-react";
import { Select } from 'antd';
import toast from 'react-hot-toast';

const ChatBox = () => {

  const { selectedChat, theme, axios, token, setUser, user } = useAppContext()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState('text')
  const [isPublished, setIsPublished] = useState(false)

  const containerRef = useRef()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!user) return toast.error("Login to send message")
      setLoading(true)
      const promptCopy = prompt
      setPrompt('')
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])

      const { data } = await axios.post(`/api/message/${mode}`, { chatId: selectedChat._id, prompt, isPublished }, { headers: { Authorization: token } })

      if (data.success) {
        setMessages(prev => [...prev, data.reply])

        if (mode === "image") {
          setUser(prev => ({ ...prev, credits: prev.credits - 2 }))
        }
        else {
          setUser(prev => ({ ...prev, credits: prev.credits - 1 }))
        }
      }
      else {
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
    finally {
      setPrompt('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages])

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-5 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 pb-5 overflow-y-scroll">
        {
          messages?.length === 0 &&
          <div className="h-full flex flex-col items-center justify-center gap-5 text-primary">
            <img src={theme === 'dark' ? assets.dark_logo : assets.light_logo} className='w-full md:max-w-100 max-w-70 animate-pulse' />
            <h1 className='md:text-6xl text-2xl text-center font-medium '>Ask me anything.</h1>
          </div>
        }

        {/* Show Messages */}
        {
          messages?.map((message, index) => (
            <Message key={index} message={message} />
          ))
        }
        {/* Show Loading Animation */}
        {loading && <div className="loader"></div>}
      </div>

      {
        mode === 'image' &&
        <label className='mx-auto flex items-center gap-2 mb-2 cursor-pointer'>
          <p className='text-xs font-medium text-gray-500'>Publish Generated Image to Community</p>
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className='cursor-pointer' />
        </label>
      }

      {/* Send Chat  */}
      <form onSubmit={onSubmit} className='flex justify-center items-center gap-5'>

        <div className="border-b border-gray-300 hover:dark:bg-slate-800/20 transition-all duration-300 dark:border-slate-500/50 hover:border-gray-400">
          <Select
            value={mode}
            onChange={(value) => setMode(value)}
            className="w-full md:max-w-50 border-none! bg-transparent!"
            size="large"
            classNames={{
              popup: { root: "my-select-dropdown" }
            }}

          >
            <Select.Option value="text">
              <label className='flex dark:text-white items-center cursor-pointer transition-all gap-1 text-sm font-medium'><TextInitial size={15} /> Text</label>
            </Select.Option>
            <Select.Option value="image">
              <label className='flex dark:text-white items-center cursor-pointer transition-all gap-1 text-sm font-medium'><Images size={15} /> Create Image</label>
            </Select.Option>
          </Select>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 dark:bg-slate-800/30 hover:dark:border-gray-400 hover:border-teal-700 transition-all duration-300 hover:shadow w-full flex items-center max-w-3xl rounded-full">
          <input autoFocus autoCorrect='on' value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder='Ask anything...' className='flex-1 pl-5 outline-none p-3 dark:text-white' />
          <button disabled={loading} className="bg-linear-to-b from-cyan-600 to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 dark:disabled:opacity-40 w-8 h-8 flex items-center justify-center text-white transition-all duration-300 cursor-pointer mr-2 rounded-full">
            {loading ? <SquareStop className='w-full max-w-5' /> : <Send className='w-full max-w-5' />}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatBox