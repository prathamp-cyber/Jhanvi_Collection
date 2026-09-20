import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetter from '../components/NewsLetter'
const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='about_img' />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 ">
          <p>Janvi Collection was born out of a passion for fine design and elegant style. Our journey began with a simple vision — to bring exquisite imitation jewellery to customers looking for timeless beauty, quality craftsmanship, and versatile designs.</p>
          <p>We carefully curate a wide array of imitation jewellery pieces, ranging from traditional bridal sets and intricate necklaces to everyday earrings and statement bangles. Every item is selected to help you shine on every occasion.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Our mission at Janvi Collection is to provide high-quality imitation jewellery with exceptional style and service, ensuring a seamless shopping experience for every customer.</p>
        </div>
      </div>

      <div className="text-3xl py-4">
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 felx flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We carefully select and evaluate every product to ensure it meets our rigorous quality standards.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 felx flex-col gap-5">
          <b>Convenience:</b>
          <p className='text-gray-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 felx flex-col gap-5">
          <b>Exception Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction remains our top priority.</p>
        </div>
      </div>

      <NewsLetter/>
    </div>
  )
}

export default About

