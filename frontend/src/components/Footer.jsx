import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        <div>
          <img src={assets.logo} alt='Logo' className='mb-5 w-32' />
          <p className='w-full md-2/3 text-gray-600'>Discover exquisite imitation jewellery crafted with elegance for every occasion.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'> COMPANY </p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div >

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Email: TODO: Add store email address</li>
            <li>Phone/WhatsApp: TODO: Add phone number</li>
            <li>Instagram: TODO: Add Instagram handle</li>
          </ul>
        </div>
      </div >

       <div className='text-gray-600'>
          <hr />
          <p className='py-5 text-sm text-center'>Copyright 2026 Jhanvi Collection - All Rights Reserved</p>
        </div>
    </div >
  )
}

export default Footer