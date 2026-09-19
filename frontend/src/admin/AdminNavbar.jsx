import React from 'react'

const AdminNavbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-3 px-[4%] bg-white border-b border-gray-200'>
      <div className='flex items-center gap-3'>
        <span className='text-xl font-bold tracking-wide text-black'>SAMAY ADMIN PANEL</span>
      </div>
      <button onClick={()=>setToken('')} className='bg-gray-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-black transition'>Logout</button>
    </div>
  )
}

export default AdminNavbar
