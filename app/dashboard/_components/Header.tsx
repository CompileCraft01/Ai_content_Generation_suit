import { UserButton } from '@clerk/nextjs'
import { Search } from 'lucide-react'
import React from 'react'

interface HeaderProps {
  onSearchInput?: (value: string) => void;
}

function Header({ onSearchInput }: HeaderProps) {
  return (
    <div className='p-5 shadow-sm border-b border-slate-700 bg-black flex justify-between items-center'>
      <div className='flex gap-2 items-center p-3 border border-slate-600 rounded-md bg-black max-w-md'>
        <Search className='text-gray-300' />
        <input 
          type='text' 
          placeholder='Search templates...'
          onChange={(event) => onSearchInput && onSearchInput(event.target.value)}
          className='outline-none bg-transparent text-gray-200 placeholder-gray-400 w-full'
        />
      </div>
      <div className='flex gap-5 items-center'>
        <UserButton appearance={{
          elements: {
            avatarBox: "w-12 h-12",
            userButtonAvatarBox: "w-12 h-12",
            userButtonPopoverCard: "bg-slate-800 border-slate-600",
            userButtonPopoverMain: "bg-slate-800",
            userButtonPopoverActionButton: "text-gray-200 hover:bg-slate-700",
            userButtonPopoverActionButtonText: "text-gray-200",
            userButtonPopoverFooter: "bg-slate-800"
          }
        }} />
      </div>
    </div>
  )
}

export default Header