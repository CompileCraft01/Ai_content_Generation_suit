"use client"
import React, { useContext } from 'react'
import TemplateListSection from './_components/TemplateListSection'
import { SearchContext } from './layout'

function Dashboard() {
  const { searchInput } = useContext(SearchContext);
  
  return (
    <div>
        {/* Header Section with Title */}
        <div className='p-10 bg-black flex flex-col justify-center items-center'>
            <h2 className='text-xl font-bold text-gray-200'>Browse All Templates</h2>
            <p className='text-gray-400'>What would you like to create today?</p>
        </div>

        {/* Template List Section  */}
        <TemplateListSection userSearchInput={searchInput} />
    </div>
  )
}

export default Dashboard