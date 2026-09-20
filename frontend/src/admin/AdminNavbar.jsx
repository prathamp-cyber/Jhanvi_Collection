import React from 'react'
import { assets } from '../assets/admin/assets.js'
import { BRAND_NAME } from '../config/brand.js'

const AdminNavbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-3 px-[4%] bg-white border-b border-gray-200'>
      <div className='flex items-center gap-3'>
        <img src={assets.jhanvi_mark} className='h-10 sm:h-12 w-auto object-contain' alt={BRAND_NAME} />
        <span className='text-lg sm:text-xl font-bold tracking-wide text-[#0a1f44] prata-regular'>{BRAND_NAME} Admin Panel</span>
      </div>
      <button onClick={()=>setToken('')} className='bg-gray-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition'>Logout</button>
    </div>
  )
}

export default AdminNavbar
