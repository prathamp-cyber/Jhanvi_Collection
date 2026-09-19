import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const ListProducts = ({ token, backendUrl, currency }) => {
  const [list, setList] = useState([])
  
  const fetchList = async ()=>{
    try{
      const url = (backendUrl || 'http://localhost:4000') + '/api/product/list';
      const response = await axios.get(url);
      if(response.data.success){
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch(error){
      toast.error(error.message);
    }
  }

  const removeProduct = async (id)=>{
    try{
      const url = (backendUrl || 'http://localhost:4000') + '/api/product/remove';
      const response = await axios.post(url, {id}, {headers: {token}});
      if(response.data.success){
        toast.success(response.data.message);
        await fetchList(); 
      } else {
        toast.error(response.data.message)
      }
    } catch(error){
      toast.error(error.message);
    }
  }

  useEffect(()=>{
    fetchList()
  },[])
  
  return (
    <div>
      <p className='mb-3 font-semibold text-lg'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* List Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 border border-gray-300 bg-gray-100 text-sm font-bold'>
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className='text-center'>Action</span>
        </div>

        {/* Product Items */}
        {
          list.map((item)=>(
            <div key={item._id} className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm bg-white rounded'>
              <img className='w-12 h-12 object-cover rounded' src={item.image[0]} alt={item.name} />
              <p className='font-medium'>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency || '$'}{item.price}</p>  
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-red-500 font-bold hover:text-red-700'>X</p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ListProducts
