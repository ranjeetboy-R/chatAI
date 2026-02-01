import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment, { } from "moment";
import Markdown, {  } from "react-markdown";
import Prism from "prismjs";

const Message = ({ message }) => {

  useEffect(()=>{
    Prism.highlightAll()
  }, [message.content])

  return (
    <div>
      {
        message.role === 'user' ?
          <div className="flex items-start justify-end my-4 gap-2">
            <div className="flex flex-col py-2 px-3 bg-blue-300 shadow-[3px_3px_5px_rgba(0,0,0,0.3)] dark:bg-violet-600/20 border border-[#80609F]/30 rounded-xl max-w-2xl ">
              <p className='dark:text-primary'>{message.content}</p>
              <span className="text-xs flex justify-end text-gray-600 dark:text-[#B1A6C0]">{moment(message.timestamp).fromNow()}</span>
            </div>
            <img src={assets.user_icon} className="w-8 rounded-full" />
          </div>
          :
          <div className="inline-flex flex-col gap-1 p-2 px-4 shadow-[3px_3px_5px_rgba(0,0,0,0.1)] max-w-2xl bg-gray-50 drop-shadow transition-all duration-300 dark:bg-slate-500/30 border border-gray-200 dark:border-gray-600 rounded-xl py-4">
            {
              message.isImage ?
                <img src={message.content} className="w-full max-w-md mt-2 rounded-md" />
                :
                <div className="dark:text-primary reset-tw"><Markdown>{message.content}</Markdown></div>
            }
            <span className="text-xs text-gray-400 flex justify-end dark:text-[#B1A6C0]">{moment(message.timestamp).fromNow()}</span>
          </div>
      }
    </div>
  )
}

export default Message