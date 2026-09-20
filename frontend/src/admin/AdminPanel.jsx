import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLogin from './AdminLogin'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import AddProduct from './AddProduct'
import ListProducts from './ListProducts'
import AdminOrders from './AdminOrders'

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const navigate = useNavigate();
  const location = useLocation();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const currency = '₹';

  // Handle robots meta tag while AdminPanel is mounted
  useEffect(() => {
    let meta = document.querySelector("meta[name='robots']");
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      created = true;
      document.head.appendChild(meta);
    }
    const prevContent = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created) {
        meta.remove();
      } else if (prevContent !== null) {
        meta.setAttribute('content', prevContent);
      } else {
        meta.removeAttribute('content');
      }
    };
  }, []);

  // Axios interceptor for handling 401 responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminToken');
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

  useEffect(() => {
    localStorage.setItem('adminToken', token);
  }, [token]);

  useEffect(() => {
    if (token && (location.pathname === '/samay' || location.pathname === '/samay/')) {
      navigate('/samay/add');
    }
  }, [location.pathname, token, navigate]);

  if (!token) {
    return <AdminLogin setToken={setToken} backendUrl={backendUrl} />;
  }

  return (
    <div className='bg-gray-50 min-h-screen text-gray-800 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw]'>
      <AdminNavbar setToken={setToken} />
      <hr className='border-gray-200' />
      <div className="flex w-full">
        <AdminSidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<AddProduct token={token} backendUrl={backendUrl} />} />
            <Route path='/add' element={<AddProduct token={token} backendUrl={backendUrl} />} />
            <Route path='/list' element={<ListProducts token={token} backendUrl={backendUrl} currency={currency} />} />
            <Route path='/order' element={<AdminOrders token={token} backendUrl={backendUrl} currency={currency} />} />
            <Route path='/orders' element={<AdminOrders token={token} backendUrl={backendUrl} currency={currency} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
