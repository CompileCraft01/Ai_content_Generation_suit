// File: app/dashboard/content/[template-slug]/[documentId]/page.tsx
"use client"
import React, { useState, useEffect, useMemo } from 'react'
import FormSection from '../../_components/FormSection'
import { TEMPLATE } from '../../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { RoomProvider, useOthers, useMyPresence } from '@/liveblocks.config'
import { LiveObject } from '@liveblocks/client'
import { CollaborativeEditor } from '@/components/CollaborativeEditor'
import CollaborativeMindMap from '@/components/CollaborativeMindMap'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import * as Y from 'yjs';
import Image from 'next/image'

// A component to show the avatars of other users
function ActiveCollaborators() {
    const others = useOthers();
    return (
        <div className="flex -space-x-2">
            {others.map(({ connectionId, info }) => {
                const userName = info?.name ?? 'Anonymous';
                const userAvatar = info?.avatar;
                
                return (
                    <div key={connectionId} className="relative">
                        {userAvatar ? (
                            <Image 
                                src={userAvatar} 
                                alt={userName} 
                                width={32} 
                                height={32} 
                                className="rounded-full border-2 border-white" 
                                title={userName}
                            />
                        ) : (
                            <div 
                                className="w-8 h-8 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-white text-xs font-semibold"
                                title={userName}
                            >
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// A component to show who is currently typing
function TypingIndicator() {
    const others = useOthers();
    const typingUsers = others.filter(({ presence }) => presence?.isTyping);
    
    if (typingUsers.length === 0) return null;
    
    return (
        <div className="text-sm text-gray-400 italic">
            {typingUsers.length === 1 ? (
                <span>{typingUsers[0].info?.name ?? 'Someone'} is typing...</span>
            ) : typingUsers.length === 2 ? (
                <span>{typingUsers[0].info?.name ?? 'Someone'} and {typingUsers[1].info?.name ?? 'someone'} are typing...</span>
            ) : (
                <span>{typingUsers.length} people are typing...</span>
            )}
        </div>
    );
}

interface PROPS{
    params:{
        'template-slug':string,
        'documentId': string
    }
}

function CreateNewContent(props:PROPS) {
    const selectedTemplate:TEMPLATE|undefined=Templates?.find((item)=>item.slug==props.params['template-slug']);
    const [loading,setLoading]=useState(false);
    const [aiOutput,setAiOutput]=useState<string>('');
    const [initialContent,setInitialContent]=useState<string>('');
    const [showForm,setShowForm]=useState<boolean>(true);
    const [activeView, setActiveView] = useState<'editor' | 'mindmap'>('editor');
    const {user}=useUser();
    
    const roomId = props.params.documentId;
    const yDoc = useMemo(() => new Y.Doc(), []);

    const GenerateAIContent=async(formData:any)=>{
        setLoading(true);
        const selectedTemplatePrompt=selectedTemplate?.aiPrompt;
        const userRequest = JSON.stringify(formData)+", "+selectedTemplatePrompt;

        const systemPrompt = `You are "Creator AI," an expert content creation assistant. Your goal is to provide a helpful, well-structured response. Follow these formatting rules strictly: 1. Start with a brief, friendly introductory sentence. 2. Structure the main content with paragraphs and bullet points using newlines. 3. CRITICAL: The entire response must be plain text. Do not use any HTML or Markdown formatting.`;
        const FinalAIPrompt = systemPrompt + userRequest;
        
        try {
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: FinalAIPrompt })
            });
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            setAiOutput(data.text);
            setInitialContent(data.text);
            await SaveInDb(JSON.stringify(formData),selectedTemplate?.slug,data.text)
        } catch (error) {
            console.error('Content generation failed:', error);
            setAiOutput('Failed to generate content. Please try again.');
        }
        setLoading(false);
    }

    const SaveInDb=async(formData:any,slug:any,aiResp:string)=>{
        const result=await db.insert(AIOutput).values({
            formData:formData,
            templateSlug:slug,
            documentId: props.params.documentId,
            aiResponse:aiResp,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD/MM/yyyy'),
        });
        console.log(result);
    }

    // Load previously saved content
    useEffect(()=>{
        const load = async()=>{
            try {
                const res:any = await db.query.AIOutput.findFirst({
                    where: (row:any, { eq }:any) => eq(row.documentId, props.params.documentId),
                    orderBy: (row:any, { desc }:any) => desc(row.id)
                });
                if(res?.aiResponse){
                    setAiOutput(res.aiResponse);
                    setInitialContent(res.aiResponse);
                    console.log('Loaded existing content from database');
                }
                // Always show the form
                setShowForm(true);
            } catch (error) {
                console.error('Error loading content from database:', error);
                // Still show the form even if loading fails
                setShowForm(true);
            }
        };
        load();
    },[props.params.documentId])

 return (
    <div className='p-5 bg-slate-900 min-h-screen'>
        <div className='mb-5'>
            <Link href="/dashboard">
                <Button variant="outline" className='mb-3'>
                    <ArrowLeft className='w-4 h-4 mr-2'/> Back to Templates
                </Button>
            </Link>
            <h1 className='text-2xl font-bold text-white'>{selectedTemplate?.name}</h1>
            <p className='text-gray-300'>{selectedTemplate?.desc}</p>
        </div>
        
        {showForm && (
            <div className='mb-5'>
                <FormSection 
                    selectedTemplate={selectedTemplate}
                    userFormInput={(v:any)=>GenerateAIContent(v)}
                    loading={loading} 
                />
            </div>
        )}
        
        <RoomProvider 
            id={roomId} 
            initialPresence={{ cursor: null, isTyping: false }}
            initialStorage={{ 
                content: initialContent || '',
                mindMap: new LiveObject({
                    root: {
                        id: 'root',
                        text: 'Central Topic',
                        children: [
                            {
                                id: 'child1',
                                text: 'Branch 1',
                                children: []
                            },
                            {
                                id: 'child2',
                                text: 'Branch 2',
                                children: []
                            }
                        ]
                    }
                })
            }}
        >
            <div className='bg-slate-800 shadow-lg border border-slate-700 rounded-lg'>
                <div className='p-5 flex justify-between items-center border-b border-slate-700'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-4'>
                            <h3 className='font-medium text-lg text-white'>Collaborative Workspace</h3>
                            <div className='flex bg-slate-700 rounded-lg p-1'>
                                <button
                                    onClick={() => setActiveView('editor')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        activeView === 'editor'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Text Editor
                                </button>
                                <button
                                    onClick={() => setActiveView('mindmap')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        activeView === 'mindmap'
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Mind Map
                                </button>
                            </div>
                        </div>
                        <TypingIndicator />
                    </div>
                    <ActiveCollaborators />
                </div>
                <div className='p-2'>
                    {activeView === 'editor' ? (
                        <CollaborativeEditor 
                            document={yDoc}
                            initialContent={initialContent}
                        />
                    ) : (
                        <CollaborativeMindMap content={initialContent} />
                    )}
                </div>
            </div>
        </RoomProvider>
    </div>
  )
}

export default CreateNewContent
