import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='p-5 shadow-sm border-b border-slate-700 bg-slate-800 flex justify-between items-center'>
      <div className='flex gap-2 items-center
       p-2 border border-slate-600 rounded-md max-w-lg bg-slate-700'>
        <Search className='text-gray-300'/>
        <input type='text' placeholder='Search...'
        className='outline-none bg-transparent text-gray-200 placeholder-gray-400'
        />
      </div>
      <div className='flex gap-5 items-center'>
      <UserButton/>
      </div>
    </div>
  )
}

export default Header