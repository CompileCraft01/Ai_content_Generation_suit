"use client"
import { FileClock, Home, Settings } from 'lucide-react'
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
    <div className='h-screen relative p-5 shadow-sm border-r border-slate-700 bg-black'>
        <div className='mt-8'>
            {MenuList.map((menu,index)=>(
                <Link key={index} href={menu.path}>
                    <div className={`relative group mb-3 p-2`}>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${path==menu.path ? 'opacity-100' : ''}`}></div>
                        <div className={`relative flex gap-3 p-4 rounded-lg border border-slate-600 group-hover:border-pink-500 transition-all duration-300 cursor-pointer items-center text-gray-200 group-hover:text-white ${path==menu.path ? 'bg-black border-pink-500 text-white' : 'bg-black'}`}>
                            <menu.icon className='h-6 w-6'/>
                            <h2 className='text-lg font-medium'>{menu.name}</h2>
                        </div>
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
