import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loading = () => {

  const navigate = useNavigate()

  useEffect(()=>{
    const timeOut = setTimeout(()=>{
      navigate('/')
    }, 8000)
    return ()=> clearTimeout(timeOut)
  }, [])

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-200 dark:bg-black/90">
      <div className="bg-slate-100 dark:bg-gray-500/30 shadow-[3px_3px_10px_rgba(0,0,0,0.2)] flex items-center justify-center py-10 rounded-full w-30 h-30 animate-pulse">
        <div className="w-10 h-10 border-3 rounded-full animate-spin border-gray-600 dark:border-gray-100 dark:border-t-gray-700 border-t-gray-200"></div>
      </div>
    </div>
  )
}

export default Loading