"use client"
import React, { useState, useEffect } from 'react'
import FormSection from '../../_components/FormSection'
import { TEMPLATE } from '../../../_components/TemplateListSection'
import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { RoomProvider } from '@/liveblocks.config'
import { CollaborativeEditor } from '@/components/CollaborativeEditor'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import * as Y from 'yjs'

interface Props {
    params: {
        'template-slug': string;
        'documentId': string;
    }
    initialContent?: string;
}

export default function ContentClient({ params, initialContent }: Props) {
    
    const selectedTemplate: TEMPLATE | undefined = Templates?.find((item) => item.slug == params['template-slug']);
    const [loading, setLoading] = useState(false);
    const [aiOutput, setAiOutput] = useState<string>(initialContent || '');
    const [isContentLoaded, setIsContentLoaded] = useState(false);
    const [currentContent, setCurrentContent] = useState<string>(initialContent || '');
    const [document] = useState(() => new Y.Doc());
    
    const { user } = useUser();
    
    // Use documentId from the URL to create a unique room ID for collaboration
    const roomId = `document-${params.documentId}`;
    
    /**
     * Used to generate content from AI by sending a structured prompt.
     */
    const GenerateAIContent = async (formData: any) => {
        setLoading(true);

        const selectedTemplatePrompt = selectedTemplate?.aiPrompt;
        const userRequest = JSON.stringify(formData) + ", " + selectedTemplatePrompt;

        const systemPrompt = `
            You are "Creator AI," an expert content creation assistant. 
            Your goal is to provide a helpful, well-structured response.
    
            Follow these formatting rules strictly:
            1. Start with a brief, friendly introductory sentence.
            2. Use a double newline (press Enter twice) to create separate paragraphs.
            3. For lists, start each item on a new line with a single asterisk (*).
            4. CRITICAL: The entire response must be plain text with markdown for structure. Do not use any HTML tags (like <p>, <b>).
    
            Here is the user's request:
        `;
    
        const FinalAIPrompt = systemPrompt + userRequest;

        try {
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: FinalAIPrompt })
            });
            
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            
            setAiOutput(data.text);
            setCurrentContent(data.text);
            await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, data.text)
        } catch (error) {
            console.error('Content generation failed:', error);
            setAiOutput('Failed to generate content. Please try again.');
        }
        setLoading(false);
    }

    const SaveInDb = async (formData: any, slug: any, aiResp: string) => {
        const result = await db.insert(AIOutput).values({
            formData: formData,
            templateSlug: slug,
            documentId: params.documentId,
            aiResponse: aiResp,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD/MM/yyyy'),
        });

        console.log(result);
    }
    
    // Load any previously saved content for this documentId when the component mounts
    useEffect(() => {
        const loadDocumentContent = async () => {
            try {
                const res: any = await db.query.AIOutput.findMany({
                    where: (row: any, { eq }: any) => eq(row.documentId, params.documentId),
                    orderBy: (row: any, { desc }: any) => desc(row.id),
                    limit: 1
                } as any);
                
                if (res && res.length > 0 && res[0]?.aiResponse) {
                    setAiOutput(res[0].aiResponse as string);
                    setCurrentContent(res[0].aiResponse as string);
                    console.log('Loaded existing content for document:', params.documentId);
                } else {
                    console.log('No existing content found for document:', params.documentId);
                }
                setIsContentLoaded(true);
            } catch (e) {
                console.error('Failed to load document content', e);
                setIsContentLoaded(true);
            }
        };
        loadDocumentContent();
    }, [params.documentId])

    // Handle version selection
    const handleVersionSelect = (content: string, version: number) => {
        setAiOutput(content);
        setCurrentContent(content);
        console.log(`Switched to version ${version}`);
    };

    // Handle content changes from editor
    const handleContentChange = (content: string) => {
        setCurrentContent(content);
    };

    return (
        <div className='p-5'>
            <div className='mb-5'>
                <Link href="/dashboard">
                    <Button variant="outline" className='mb-3'>
                        <ArrowLeft className='w-4 h-4 mr-2'/> Back to Templates
                    </Button>
                </Link>
                <h1 className='text-2xl font-bold'>{selectedTemplate?.name}</h1>
                <p className='text-gray-600'>{selectedTemplate?.desc}</p>
            </div>
            
            {/* Form always visible for both creator and collaborators */}
            <div className='mb-5'>
                <FormSection 
                    selectedTemplate={selectedTemplate}
                    userFormInput={(v: any) => GenerateAIContent(v)}
                    loading={loading} 
                />
            </div>

            {/* Immediate AI Output preview (plain text) */}
            {aiOutput && (
                <div className='mb-6 bg-white border rounded-lg shadow-sm'>
                    <div className='p-4 border-b'>
                        <h3 className='font-medium text-lg'>AI Output Preview</h3>
                        <p className='text-xs text-gray-500'>Plain text preview of the latest generated content</p>
                    </div>
                    <div className='p-4'>
                        <pre className='whitespace-pre-wrap text-sm text-gray-800'>{aiOutput}</pre>
                    </div>
                </div>
            )}

            {/* Collaborative Editor Section - Full Width */}
            <div className='bg-white shadow-lg border rounded-lg'>
                <div className='p-5 pb-3'>
                    <h3 className='font-medium text-lg'>Collaborative Editor</h3>
                    <p className='text-sm text-gray-600'>Generate content above, then edit collaboratively below. Both users can generate new content and edit. Changes sync in real-time.</p>
                </div>
                <div className='p-5'>
                    {isContentLoaded ? (
                        <RoomProvider 
                            id={roomId} 
                            initialPresence={{ cursor: null, isTyping: false }} 
                            initialStorage={{ content: aiOutput || '' }}
                        >
                            <CollaborativeEditor 
                                document={document}
                                initialContent={aiOutput}
                            />
                            <div className="mt-2 text-xs text-gray-400 flex justify-between items-center">
                                <span>Room ID: {roomId} | Content loaded: {aiOutput ? 'Yes' : 'No'}</span>
                                <span className="text-green-600">🟢 Collaborative editing active</span>
                            </div>
                        </RoomProvider>
                    ) : (
                        <div className="min-h-[400px] flex items-center justify-center text-gray-500">
                            Loading collaborative editor...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
