import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Community = () => {

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const {axios} = useAppContext()

  const loadImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images')
      if (data.success) {
        setImages(data.images)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadImages()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="flex flex-col p-5">
      <h1 className='text-lg font-medium shadow dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)] p-2 text-gray-700 dark:text-gray-200'>Community Images</h1>

      <div className="grid grid-cols-4 gap-5 overflow-y-auto mt-5">
        {
          images.map((image, index) => (
            <a key={index} href={image.imageUrl} target='_blank' className="relative group shadow-[3px_3px_5px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden">
              <img src={image.imageUrl} className='w-full h-full object-cover hover:scale-150 transition-all duration-500' />
              <h1 className='bg-white dark:bg-black/90 px-2 py-1 text-xs rounded font-medium rounded-br-lg transition-all duration-300 shadow-lg drop-shadow-lg group-hover:opacity-100 opacity-0 absolute bottom-1 right-1'>Created by {image.userName}</h1>
            </a>
          ))
        }
      </div>
    </div>
  )
}

export default Community