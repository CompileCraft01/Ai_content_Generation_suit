import Templates from '@/app/(data)/Templates'
import React, { useEffect, useState } from 'react'
import { HoverEffect } from "@/components/ui/hover-effect"

export interface TEMPLATE{
    name:string,
    desc:string,
    icon:string,
    category:string,
    slug:string,
    aiPrompt:string,
    form?:FORM[]
}

export interface FORM{
    label:string,
    field:string,
    name:string,
    required?:boolean
}

function TemplateListSection({userSearchInput}:any) {

  const [templateList,setTemplateList]=useState(Templates)
  useEffect(()=>{
    
    if(userSearchInput)
      {
        const filterData=Templates.filter(item=>
          item.name.toLowerCase().includes(userSearchInput.toLowerCase())
        );
        setTemplateList(filterData);
      }
      else{
        setTemplateList(Templates)
      }
  },[userSearchInput])

  // Transform the data for HoverEffect component
  const transformedItems = templateList.map((template) => ({
    title: template.name,
    description: template.desc,
    icon: template.icon,
    // CRITICAL: This preserves the unique document linking functionality.
    link: `/dashboard/content/${template.slug}/${Date.now()}`
  }));

  return (
    <div className='p-10 bg-black'>
      <div className="max-w-7xl mx-auto">
        <HoverEffect items={transformedItems} />
      </div>
    </div>
  )
}

export default TemplateListSection
