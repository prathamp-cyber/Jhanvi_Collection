import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import Verify from './pages/Verify'

// Lazy load admin module so storefront bundle does not include admin code
const AdminPanel = lazy(() => import('./admin/AdminPanel'));

const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f6f3ec] text-[#0a1f44]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-[#0a1f44] border-r-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium text-[#6b7280]">Loading Admin Panel...</span>
    </div>
  </div>
);

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/samay');

  return (
    <div className={isAdminRoute ? '' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'}>
      <ToastContainer />
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <SearchBar />}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route
          path='/samay/*'
          element={
            <Suspense fallback={<AdminLoadingFallback />}>
              <AdminPanel />
            </Suspense>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App