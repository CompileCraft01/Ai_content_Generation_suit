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

// Create context for search functionality
const SearchContext = createContext<{
  searchInput: string;
  setSearchInput: (value: string) => void;
}>({
  searchInput: '',
  setSearchInput: () => {}
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

    // Search context state
    const [searchInput, setSearchInput] = useState<string>('');

  return (
    <DocumentContext.Provider value={{...documentInfo, setDocumentInfo}}>
      <SearchContext.Provider value={{ searchInput, setSearchInput }}>
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
                <Header onSearchInput={setSearchInput}/>
              {children}
              </div>
          </div>
        </LiveblocksProvider>
      </SearchContext.Provider>
    </DocumentContext.Provider>
  )
}

export { SearchContext };
export default layout