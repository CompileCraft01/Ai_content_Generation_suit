import { Search } from 'lucide-react'
import React from 'react'

function SearchSection({onSearchInput}:any) {
  return (
    <div className='p-10 bg-slate-900 flex flex-col justify-center items-center'>
        <h2 className='text-3xl font-bold text-gray-200'>Browse All Templates</h2>
        <p className='text-gray-400'>What would you like to create today?</p>
        <div className='w-full flex justify-center'>
            <div className='flex gap-2 items-center
             p-2 border border-slate-600 rounded-md bg-slate-700 my-5 w-[50%]'>
                <Search className='text-gray-300' />
                <input type="text" placeholder='Search'
                onChange={(event)=>onSearchInput(event.target.value)}
                className='bg-transparent w-full outline-none text-gray-200 placeholder-gray-400'
                />
            </div>
        </div>
    </div>
  )
}

export default SearchSection