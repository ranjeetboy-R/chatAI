import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import moment from "moment";
import { Tooltip } from 'antd';
import { BrushCleaning, Loader, Plus } from "lucide-react";
import toast from 'react-hot-toast';

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat, theme, setTheme, navigate, newChatLoading, createNewChat, fetchUserChat, token, setToken, axios } = useAppContext();
  const [search, setSearch] = useState('')
  const asideRef = useRef()

  const filter = chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase()))

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    toast.success("Logged out")
  }

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      const { data } = await axios.delete('/api/chat/delete', {
        data: { chatId },
        headers: {
          Authorization: token,
        },
      });

      if (data.success) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
        await fetchUserChat()
        toast.success(data.message)
      }
    }
    catch (error) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (asideRef.current && !asideRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={asideRef} className={`flex flex-col h-screen min-w-72 p-5 dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80609F]/30 bg-white dark:bg-black transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* Logo */}
      <img src={theme === 'dark' ? assets.dark_logo : assets.light_logo} className='w-full max-w-44' />

      {/* New chat button */}
      <button disabled={newChatLoading} onClick={createNewChat} className="flex disabled:cursor-not-allowed disabled:opacity-50 justify-center items-center active:scale-95 transition-all w-full py-2 mt-5 text-white bg-linear-to-r from-cyan-500 to-cyan-700 rounded cursor-pointer ">
        {
          newChatLoading ?
            <p className='flex items-center gap-2'>
              <Loader className='size-5 animate-spin' />
              <span>Creating...</span>
            </p>
            :
            <p className='flex items-center gap-2'>
              <Plus className='size-5'/>
              New Chat
            </p>
        }
      </button>

      {/* Search Conversations */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 hover:border-teal-500 dark:hover:border-white/40 transition-all dark:border-white/20 rounded">
        <img src={assets.search_icon} className='w-4 not-dark:invert' />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search conversations...'
          className='text-sm placeholder:text-gray-400 outline-none w-full'
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className='mt-4 text-sm dark:text-gray-400 text-gray-700'>Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-2 text-sm space-y-3">
        {
          filter.length > 0 ?
            filter.map((chat) => (
              <div
                key={chat._id}
                className={`relative p-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-900/40 dark:bg-[#57317C]/10 border border-gray-200 hover:border-gray-300 dark:hover:border-white/20 transition-all dark:border-[#80609F]/15 rounded-lg cursor-pointer flex justify-between group ${chat._id === selectedChat._id && 'dark:bg-gray-900/40 dark:border-white/20 bg-gray-100 border-gray-400'}`}
              >
                <div onClick={() => { navigate('/'); setIsMenuOpen(false); setSelectedChat(chat) }} className='hover:pl-1 transition-all duration-300'>
                  <p className='truncate w-50 capitalize'>{chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}</p>
                  <label className='group/2 cursor-pointer w-fit flex items-center gap-1'>
                    <p className='text-xs text-gray-600 dark:text-[#B1A6C0]'>{moment(chat.updatedAt).fromNow()}</p>
                    <p className='text-xs opacity-0 group-hover/2:opacity-100 text-gray-500 dark:text-[#B1A6C0]'>- {moment(chat.updatedAt).format("DD MMM, hh:mm")}</p>
                  </label>
                </div>
                <Tooltip title="Remove chats">
                  <button onClick={(e) => { toast.promise(deleteChat(e, chat._id), { loading: "Deleting..." }) }} className="border cursor-pointer md:bg-white hover:bg-black/10 md:dark:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 dark:border-gray-600 border-gray-200 shadow absolute top-1/2 -translate-y-1/2 right-2 md:hidden group-hover:block p-2 rounded-full">
                    <img src={assets.bin_icon} className='w-4 not-dark:invert' />
                  </button>
                </Tooltip>
              </div>
            ))
            :
            <p className="flex items-center gap-2 mt-3 font-medium text-gray-700 dark:text-gray-400"><BrushCleaning className='size-4 text-gray-500 dark:text-gray-400' /> No Result Found</p>
        }
      </div>

      {/* Credits Purchases Option */}
      <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className="flex items-center hover:shadow gap-2 duration-300 p-3 border-b border-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-all dark:border-white/10  cursor-pointer">
        <img src={assets.diamond_icon} className='w-4.5 dark:invert' />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits}</p>
          <p className='text-xs text-gray-700 dark:text-gray-400'>Purchase credits to use Chat AI</p>
        </div>
      </div>

      {/* Community Image */}
      <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className="flex items-center hover:shadow gap-2 duration-300 p-3 border-b border-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-all dark:border-white/10  cursor-pointer">
        <img src={assets.gallery_icon} className='w-4.5 not-dark:invert' />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between hover:shadow gap-2 p-3 border-b border-gray-200 duration-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all dark:border-white/10  cursor-pointer">
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} className='w-4.5 dark:rotate-180 transition-all duration-1000 not-dark:invert' />
          <p>Dark Mode</p>
        </div>
        <label className="relative inline-flex cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            checked={theme === 'dark'}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-linear-to-b from-cyan-500 to-purple-900 transition-all"></div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
      </div>

      {/* User */}
      <div className=" group flex items-center justify-between hover:shadow gap-2 duration-300 p-3 border-b border-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition-all dark:border-white/10 rounded cursor-pointer">
        <div className="flex items-center gap-2">
          <img src={assets.user_icon} className='w-7 ' />
          <p className='font-light'>{user?.name}</p>
        </div>
        <Tooltip title="Logout user">
          <img onClick={logout} src={assets.logout_icon} className='size-5 not-dark:invert opacity-0 group-hover:opacity-100 transition-all' />
        </Tooltip>
      </div>

      {/* Close Icon  */}
      <button className="md:hidden block cursor-pointer absolute top-5 right-5 bg-black/10 dark:bg-white/20 p-2 rounded-md">
        <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='not-dark:invert size-4' />
      </button>
    </div>
  )
}

export default Sidebar