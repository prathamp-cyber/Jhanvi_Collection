import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { formatPrice } from '../utils/formatPrice';

const Product = () => {
  const { productId } = useParams();
  const { products, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState('');

  const fetchData = () => {
    if (productId && products.length > 0) {
      const foundProduct = products.find((item) => item._id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image[0]);
      }
      return null;
    }
  }

  useEffect(() => {
    fetchData();
  }, [productId, products])
  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* ---------------Product Data--------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* ---------------Product Images--------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image.map((img, index) => (
                <img key={index} onClick={() => setImage(img)} className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer' src={img} alt={`Product Image ${index + 1}`} />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image}></img>
          </div>
        </div>
        {/* ---------------Product Info-------------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img className='w-3.5' src={assets.star_icon} alt="" />
            <img className='w-3.5' src={assets.star_icon} alt="" />
            <img className='w-3.5' src={assets.star_icon} alt="" />
            <img className='w-3.5' src={assets.star_icon} alt="" />
            <img className='w-3.5' src={assets.star_dull_icon} alt="" />
            <p className='pl-2'>(112)</p>
          </div>
          <p className='font-medium text-3xl mt-5'>{formatPrice(productData.price)}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button className={`border py-2 px-4 bg-gray-100 ${size === item ? 'border-orange-500' : ''}`} key={index} onClick={() => setSize(item)}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)}  className='bg-black text-white px-8 py-3 text-sm active:bg-zinc-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 text-gray-500' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1' >
            <p>Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>TODO: Update return and exchange policy details.</p>
          </div>
        </div>
      </div>
      {/* ------------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border border-gray-300 px-5 py-3 text-sm'>Description</b>
          <p className='border border-gray-300 px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border border-gray-200 px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that allows consumers to purchase goods or services over the Internet.</p>
          <p>It provides a convenient way for customers to browse and shop for products from the comfort of their own homes.</p>
        </div>
      </div>

       {/*Display related products */}
       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div >
  ) : <div className='opacity-0'></div>
}

export default Product