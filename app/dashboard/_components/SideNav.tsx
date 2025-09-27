"use client"
import { FileClock, Home, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import VersionHistory from './VersionHistory'

interface SideNavProps {
  documentId?: string;
  currentContent?: string;
  onVersionSelect?: (content: string, version: number) => void;
}

function SideNav({ documentId, currentContent, onVersionSelect }: SideNavProps) {

    const MenuList=[
        {
            name:'Home',
            icon:Home,
            path:'/dashboard'
        },
        {
            name:'History',
            icon:FileClock,
            path:'/dashboard/history'
        },
        {
            name:'Setting',
            icon:Settings,
            path:'/dashboard/settings'
        },

    ]

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[])

  return (
    <div className='h-screen relative p-5 shadow-sm border-r border-slate-700 bg-slate-800'>
        <div className='flex justify-center'>
        <Image src={'/logo.svg'} alt='logo' width={120} height={100} />
        </div>
        <hr className='my-6 border border-slate-600' />
        <div className='mt-3'>
            {MenuList.map((menu,index)=>(
                <Link key={index} href={menu.path}>
                    <div className={`flex gap-2 mb-2 p-3
                    hover:bg-blue-600 hover:text-white rounded-lg
                    cursor-pointer items-center text-gray-200
                    ${path==menu.path&&'bg-blue-600 text-white'}
                    `}>
                        <menu.icon className='h-6 w-6'/>
                        <h2 className='text-lg'>{menu.name}</h2>
                    </div>
                </Link>
            ))}
        </div>
        
        {/* Version History - only show on document pages */}
        {documentId && onVersionSelect && (
          <div className='mt-6 border-t border-slate-600 pt-4'>
            <VersionHistory 
              documentId={documentId}
              onVersionSelect={onVersionSelect}
              currentContent={currentContent || ''}
            />
          </div>
        )}
        
    </div>
  )
}

export default SideNav
