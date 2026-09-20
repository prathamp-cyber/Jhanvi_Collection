import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Order from './pages/Orders.jsx'
import Login from './components/Login.jsx'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

export const backendUrl = import.meta.env.VITE_BACKEND_URL; 
export const currency = '$';

const App = () => {
  const [token, setToken] = useState( localStorage.getItem('token')? localStorage.getItem('token') : '');

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          setToken('');
          toast.error(error.response.data?.message || 'Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(()=>{
    localStorage.setItem('token',token);
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
    {
      token === "" ? 
      <Login setToken={setToken} />
      :
      <>
        <Navbar setToken={setToken} />
        <hr/>
        <div className="flex w-full">
          <Sidebar />
          <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
            <Routes>
              <Route path='/add' element={<Add token={token} />} />
              <Route path='/list' element={<List token={token} />} />
              <Route path='/order' element={<Order token={token} />} />

            </Routes>
          </div>
        </div>
      </>

    }
      
    </div>
  )
}

export default App