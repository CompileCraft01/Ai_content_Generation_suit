"use client"
import React, { useState, createContext } from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { LiveblocksProvider } from '@/liveblocks.config'; // <-- IMPORT THIS

// Create context for document info
const DocumentContext = createContext<{
  documentId?: string;
  currentContent?: string;
  onVersionSelect?: (content: string, version: number) => void;
  setDocumentInfo: (info: { documentId?: string; currentContent?: string; onVersionSelect?: (content: string, version: number) => void }) => void;
}>({
  setDocumentInfo: () => {}
});

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    
    // Document context state
    const [documentInfo, setDocumentInfo] = useState<{
      documentId?: string;
      currentContent?: string;
      onVersionSelect?: (content: string, version: number) => void;
    }>({});

  return (
    <DocumentContext.Provider value={{...documentInfo, setDocumentInfo}}>
      {/* Wrap the entire dashboard in the LiveblocksProvider */}
      <LiveblocksProvider>
        <div className='bg-slate-900 min-h-screen'>
            <div className='md:w-64 hidden md:block fixed'>
                <SideNav 
                  documentId={documentInfo.documentId}
                  currentContent={documentInfo.currentContent}
                  onVersionSelect={documentInfo.onVersionSelect}
                />
            </div>
            <div className='md:ml-64'>
              <Header/>
            {children}
            </div>
        </div>
      </LiveblocksProvider>
    </DocumentContext.Provider>
  )
}

export default layout
export { DocumentContext }