import { UserProfile } from '@clerk/nextjs'
import React from 'react'

function Settings() {
  return (
    <div className='flex items-center justify-center h-full bg-slate-900 min-h-screen p-8'>
        <UserProfile/>
    </div>
  )
}

export default Settings