import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { AiOutlineDelete } from 'react-icons/ai';

function Cart() {
  return (
    <div className='max-w-8xl p-[4rem] flex flex-col justify-between'>
      <div className='flex pt-2 pb-4 justify-between text-lg font-medium w-full'>
        <div className='text-xl font-semibold'>Cart Items</div>
        <div className=' p-2 bg-blue-400 font-extrabold rounded-full text-blue-900 text-xs'>1</div>
      </div>

      <div className='flex justify-between w-full rounded-xl '>
        <div className='bg-slate-950 p-2 rounded-xl max-w-5xl w-full flex flex-col overflow-auto'>
          <CartItem />
          <CartItem />
          <CartItem />
        </div>

        <div className='rounded-xl w-full bg-slate-400 ml-4 max-w-3xl'>
          Checkout
        </div>
      </div>

    </div>
  )
}

export default Cart

function CartItem() {
  return (
    <div className='w-5xl h-[6rem] my-2 shadow-lg bg-slate-100 rounded-xl flex dark:bg-slate-700'>
      <Image
        className="h-[6rem] w-[8rem] bg-slate-700 rounded-tl-xl rounded-bl-xl relative"
        src='/images1.jpg'
        alt="Next.js Logo"
        width={128}
        height={96}
        style={{
          objectFit: 'cover',
        }}
        priority
      />

      <div className='flex ml-4 justify-between'>
        <div className='px-4 justify-center  py-auto flex flex-col'>
          {/* course name */}
          <div className='text-sm max-w-2xl w-full line-clamp-2 text-ellipsis  dark:text-gray-300'>Master Full Stack</div>

          {/* course price */}
          <div className='text-lg font-semibold dark:text-gray-100'>299 $</div>
        </div>

        {/*  */}
        <div className='justify-center py-auto flex ml-40 my-2'>
          {/* <div className='justify-center my-auto flex flex-col text-blue-500 dark:text-white p-2 rounded-xl border border-gray-500 font-bold ml-4 text-sm'>x1</div> */}
          <div className='my-auto p-2 bg-gray-950 text-red-500 cursor-pointer pointer-events-auto rounded-full justify-center flex flex-col'>
            <AiOutlineDelete size={18} />
          </div>
        </div>
      </div>

    </div>
  )
}

