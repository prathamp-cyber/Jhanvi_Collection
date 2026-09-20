import React from 'react'
import { assets } from '../assets/assets';
const OurPolicy = () => {
    return (
        <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
            <div>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt='Quality Icon' />
                <p className='font-semibold'>Quality Assured</p>
                <p className='text-gray-400'>Curated imitation jewellery pieces</p>
            </div>

            <div>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt='Exchange Icon' />
                <p className='font-semibold'>Return & Exchange Policy</p>
                <p className='text-gray-400'>TODO: Update return and exchange policy details</p>
            </div>
            <div>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt='Support Icon' />
                <p className='font-semibold'>Customer Support</p>
                <p className='text-gray-400'>TODO: Add customer support contact details & hours</p>
            </div>
        </div>
    )
}

export default OurPolicy