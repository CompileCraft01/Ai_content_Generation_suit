"use client"
import React from 'react'
import { TEMPLATE } from './TemplateListSection'
import { useRouter } from 'next/navigation'

function TemplateCard(item:TEMPLATE) {
  const router = useRouter();
  
  const handleTemplateClick = () => {
    const documentId = Date.now().toString();
    const newPath = `/dashboard/content/${item.slug}/${documentId}`;
    router.push(newPath);
  };

  return (
    <div onClick={handleTemplateClick} className='p-5 shadow-md rounded-md border border-slate-600 bg-slate-800 
      flex flex-col gap-3 cursor-pointer h-full hover:scale-105 transition-all hover:border-blue-500'>
        <div className='w-12 h-12 flex items-center justify-center text-3xl'>
          {item.icon}
        </div>
        <h2 className='font-medium text-lg text-gray-200'>{item.name}</h2>
        <p className='text-gray-400 line-clamp-3'>{item.desc}</p>
    </div>
  )
}

export default TemplateCard
