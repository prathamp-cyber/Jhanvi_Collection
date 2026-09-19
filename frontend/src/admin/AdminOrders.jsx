import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin/assets.js'

const AdminOrders = ({ token, backendUrl, currency }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const url = (backendUrl || 'http://localhost:4000') + '/api/order/list';
      const response = await axios.post(url, {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const url = (backendUrl || 'http://localhost:4000') + '/api/order/status';
      const response = await axios.post(url, { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        toast.success("Order status updated");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className='font-semibold text-lg mb-4'>Orders Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-sm' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt='parcel_icon' />
              <div>
                <div>
                  {order.items.map((item, idx) => {
                    if (idx === order.items.length - 1) {
                      return <p className='py-0.5 font-medium' key={idx}>{item.name} x {item.quantity} <span className='text-gray-500'>({item.size})</span></p>
                    } else {
                      return <p className='py-0.5 font-medium' key={idx}>{item.name} x {item.quantity} <span className='text-gray-500'>({item.size})</span>,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-semibold text-gray-900'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p className='mt-1 text-gray-500'>Phone: {order.address.phone}</p>
              </div>

              <div>
                <p className='text-sm sm:text-[15px] font-medium'>Items: {order.items.length}</p>
                <p className='mt-2'>Method: {order.paymentMethod}</p>
                <p>Payment: <span className={order.payment ? "text-green-600 font-semibold" : "text-amber-600"}>{order.payment ? "Done" : "Pending"}</span></p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px] font-bold text-black'>{currency || '$'}{order.amount}</p>
              <select onChange={(event)=>statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold border border-gray-300 rounded bg-gray-50 outline-none'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminOrders
