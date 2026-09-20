import React, { useContext } from 'react'
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import { formatPrice } from '../utils/formatPrice';

const CartTotal = () => {
  const { delivery_fee, getCartAmount } = useContext(ShopContext);
  const cartAmount = getCartAmount();

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{formatPrice(cartAmount)}</p>
        </div>

        <hr className='text-gray-300'/>
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{formatPrice(cartAmount === 0 ? 0 : delivery_fee)}</p>
        </div>

        <hr className='text-gray-300'/>
        <div className='flex justify-between'>
          <b>Total</b>
          <b>{formatPrice(cartAmount === 0 ? 0 : cartAmount + delivery_fee)}</b>
        </div>
      
      </div>

    </div>
  )
}

export default CartTotal