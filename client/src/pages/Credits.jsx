import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from './Loading'
import { DollarSign } from "lucide-react";
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const {axios, token} = useAppContext()

  // Getting plans 
  const loadPlans = async () => {
    try {
      const {data} = await axios.get('/api/credit/plan')
      if (data.success) {
        setPlans(data.plans)
      }
      else{
        toast.error(data.message)
      }
    } 
    catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  // Purchasing Plans
  const purchasePlan = async (planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase', {planId}, {headers: {Authorization: token}})
      window.location.href = data.url
    } 
    catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <h1 className='text-lg font-medium shadow-md dark:bg-slate-800/20 flex items-center dark:rounded dark:shadow-[3px_3px_10px_rgba(0,0,0,0.5)] p-2 text-gray-700 dark:text-gray-200 w-lg justify-center'>
      <DollarSign size={20} className='dark:text-gray-200'/> Credit Plans
      </h1>

      <div className="flex gap-8 items-center mt-12">
        {
          plans.map((plan, index) => (
            <div key={index} className={`border dark:bg-slate-800/30 relative group hover:shadow-lg transition-all duration-300 border-gray-300 dark:border-gray-500 dark: hover:border-gray-300 shadow p-5 rounded-lg ${plan._id === 'pro' && 'border-teal-600 dark:border-teal-500 bg-teal-100 dark:bg-linear-to-br from-cyan-600 to-slate-900 scale-105'}`}>
              <small className={`absolute text-gray-500 dark:text-gray-300 text-xs top-2 right-2 ${plan._id === 'pro' ? 'block' : 'hidden'}`}>Recomended</small>
              <h1 className='font-medium'>{plan.name}</h1>
              <p className={`text-lg font-medium text-teal-600 ${plan._id === 'pro' && 'dark:text-teal-300'}`}>${plan.price} 
                <span className='text-xs text-gray-800 dark:text-white'> / {plan.credits} credits</span>
              </p>
              <ul className='mt-2 text-sm list-disc list-inside dark:text-gray-300'>
                {
                  plan.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                }
              </ul>
              <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: "Processing..."})} className="bg-linear-to-br from-cyan-400 to-teal-800 group-hover:scale-105 transition-all duration-300 text-white w-full mt-4 text-xs rounded cursor-pointer py-2">Get Started</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Credits