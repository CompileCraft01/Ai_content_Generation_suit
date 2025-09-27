"use client"
import React, { useState } from 'react'
import { TEMPLATE } from '../../_components/TemplateListSection'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2Icon } from 'lucide-react';

interface Props {
    selectedTemplate?: TEMPLATE;
    userFormInput: (data: any) => void;
    loading: boolean;
}

function FormSection({ selectedTemplate, userFormInput, loading }: Props) {

    const [formData,setFormData]=useState<any>();

    const handleInputChange=(event:any)=>{
        const {name,value}=event.target;
        setFormData({...formData,[name]:value})
    }

    const onSubmit=(e:any)=>{
        e.preventDefault();
        userFormInput(formData)
    }

    return (
        <div className='p-5 shadow-md border border-slate-600 rounded-lg bg-slate-800'>
            <div className='w-16 h-16 flex items-center justify-center text-4xl mb-2'>
                {selectedTemplate?.icon}
            </div>
            <h2 className='font-bold text-2xl mb-2 mt-4 text-blue-400'>{selectedTemplate?.name}</h2>
            <p className='text-gray-400 text-sm'>{selectedTemplate?.desc}</p>

            <form className='mt-6' onSubmit={onSubmit}>
                {selectedTemplate?.form?.map((item, index) => (
                    <div key={index} className='my-2 flex flex-col gap-2 mb-7'>
                        <label className='font-bold text-gray-200'>{item.label}</label>
                        {item.field == 'input' ?
                            <Input name={item.name} required={item?.required}
                            onChange={handleInputChange}
                            className='bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400 focus:border-blue-500'
                            />
                            : item.field == 'textarea' ?
                            <>
                                <Textarea name={item.name} required={item?.required}
                                rows={5}
                                maxLength={2000}
                                onChange={handleInputChange}
                                className='bg-slate-700 border-slate-600 text-gray-200 placeholder-gray-400 focus:border-blue-500' /> 
                                <label className='text-xs text-gray-500'>Note: Max 2000 Words</label>
                                
                                </>    : null
                        }
                    </div>
                ))}
                <Button type="submit" 
                className='w-full py-6 bg-blue-600 hover:bg-blue-700 text-white'
                disabled={loading}
                >
                    {loading&&<Loader2Icon className='animate-spin mr-2'/>}
                    Generate Content</Button>
            </form>
        </div>
    )
}

export default FormSection
