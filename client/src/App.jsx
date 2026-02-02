import React, { useState } from 'react'
import 'animate.css';
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets';
import './assets/prism.css'
import Loading from './pages/Loading';
import { useAppContext } from './context/AppContext';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

const App = () => {

  const { user, loadingUser } = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === "/loading" || loadingUser) return <Loading />

  return (
    <>
      {
        !isMenuOpen &&
        <img onClick={() => setIsMenuOpen(true)} src={assets.menu_icon} className='not-dark:invert cursor-pointer md:hidden size-7 absolute top-3 left-3' />
      }

      {
        user ?
          <div className="dark:bg-linear-to-b from-[#242124] to-[#000000] dark:text-white ">
            <div className="flex w-screen h-screen">
              <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Routes>
                <Route path='/' element={<ChatBox />} />
                <Route path='/credits' element={<Credits />} />
                <Route path='community' element={<Community />} />
              </Routes>
            </div>
          </div>
          :
          <div className="flex items-center justify-center w-full h-screen">
            <Login />
          </div>
      }
      <Toaster />
    </>
  )
}

export default App