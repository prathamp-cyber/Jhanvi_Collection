import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin/assets.js'
import { BRAND_NAME } from '../config/brand.js'

const AdminLogin = ({ setToken, backendUrl }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e)=>{
        try{
            e.preventDefault();
            const url = (backendUrl || 'http://localhost:4000') + '/api/user/admin';
            const response = await axios.post(url, {email, password})
            if(response.data.success){
                setToken(response.data.token)
                toast.success("Admin Logged In Successfully")
            } else {
                toast.error(response.data.message)
            }
        } catch(error){
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                toast.error("Backend server is not running on port 4000! Start backend with: cd backend; npm run dev");
            } else {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className='min-h-[70vh] flex items-center justify-center w-full py-10'>
            <div className='bg-white shadow-lg border border-gray-200 rounded-xl px-8 py-8 max-w-md w-full'>
                <div className='flex flex-col items-center mb-4'>
                    <img src={assets.jhanvi_mark} className='h-12 w-auto object-contain mb-2' alt={BRAND_NAME} />
                    <h1 className='text-2xl font-bold text-center text-[#0a1f44] prata-regular'>{BRAND_NAME} Admin Panel</h1>
                </div>
                <p className='text-sm text-gray-500 text-center mb-6'>Enter admin credentials to log in</p>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-4 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Admin Email Address</p>
                        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-black' type='email' placeholder='admin@gmail.com' required />
                    </div>
                    <div className='mb-4 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-black' type='password' placeholder='Enter your password' required />
                    </div> 
                    <button className='mt-2 py-2.5 px-4 bg-black text-white font-medium rounded-md w-full hover:bg-gray-800 transition' type='submit'>Login to Admin Panel</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
