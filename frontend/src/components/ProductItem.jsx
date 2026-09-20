import React from 'react'
import {Link} from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

const ProductItem = ({id, image, name, price}) => {
    return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img src={image[0]} alt={name} className="hover:scale-110 transition ease-in-out" />
      </div>
        <h2 className="pt-2 pb-1 text-sm">{name}</h2>
        <p className="text-sm font-medium">{formatPrice(price)}</p>
    </Link>
   )
}

export default ProductItem