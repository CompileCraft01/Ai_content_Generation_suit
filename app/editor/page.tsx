'use client';

import { RoomProvider } from '@/liveblocks.config';
import { LiveObject } from '@liveblocks/client';
import { CollaborativeEditor } from '@/components/CollaborativeEditor';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import * as Y from 'yjs';

export default function EditorPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [document] = useState(() => new Y.Doc());

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">
      <div>Loading...</div>
    </div>;
  }

  if (!isSignedIn) {
    router.push('/dashboard');
    return null;
  }

  // Use a static room ID for testing collaborative editing
  const roomId = "shared-editor-room";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-5">
        <Link href="/dashboard">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Button>
        </Link>
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold">Collaborative Editor</h1>
              <p className="text-gray-600 mt-2">
                Share this URL with others to collaborate in real-time: <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </code>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Room ID: <span className="font-mono">{roomId}</span>
              </p>
            </div>
            
            <div className="p-6">
              <RoomProvider 
                id={roomId} 
                initialPresence={{ cursor: null, isTyping: false }}
                initialStorage={{ 
                  content: "Start typing to test collaborative editing...",
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
                <CollaborativeEditor document={document} initialContent="Start typing to test collaborative editing..." />
              </RoomProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
