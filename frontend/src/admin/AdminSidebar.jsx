import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/admin/assets.js'

const AdminSidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-gray-200 bg-white'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l font-medium text-gray-700' to="/samay/add">
            <img className='w-5 h-5' src={assets.add_icon} alt="Add" />
            <p className='hidden md:block'>Add Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l font-medium text-gray-700' to="/samay/list">
            <img className='w-5 h-5' src={assets.order_icon} alt="List" />
            <p className='hidden md:block'>List Items</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l font-medium text-gray-700' to="/samay/orders">
            <img className='w-5 h-5' src={assets.order_icon} alt="Orders" />
            <p className='hidden md:block'>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar
