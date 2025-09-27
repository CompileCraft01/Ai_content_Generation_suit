// File: components/CollaborativeEditor.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import LiveblocksYjsProvider from '@liveblocks/yjs';
import * as Y from 'yjs';
import { useRoom, useSelf, useMyPresence } from '../liveblocks.config';

interface CollaborativeEditorProps {
    document: Y.Doc;
    initialContent: string;
}

export function CollaborativeEditor({ document, initialContent }: CollaborativeEditorProps) {
    const room = useRoom();
    const userInfo = useSelf();
    const [myPresence, updateMyPresence] = useMyPresence();
    const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null);

    // Memoize user data to prevent unnecessary re-renders
    const userData = useMemo(() => ({
        name: userInfo?.info?.name ?? 'Anonymous',
        color: userInfo?.info?.color ?? '#f783ac',
    }), [userInfo?.info?.name, userInfo?.info?.color]);

    // Debounced function to stop typing indicator
    const debouncedStopTyping = useCallback(() => {
        const timeoutId = setTimeout(() => {
            updateMyPresence({ isTyping: false });
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [updateMyPresence]);

    // Set up provider only once when room and document are available
    useEffect(() => {
        if (!room || !document) return;
        
        const newProvider = new LiveblocksYjsProvider(room, document);
        setProvider(newProvider);
        
        return () => {
            newProvider?.destroy();
        };
    }, [room, document]);

    const editor = useEditor({
        immediatelyRender: false, // fix hydration mismatches on SSR
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: () => {
            // Set typing indicator when user types
            updateMyPresence({ isTyping: true });
            // Clear typing indicator after 2 seconds of inactivity
            debouncedStopTyping();
        },
        extensions: provider
            ? [
                  StarterKit.configure({ history: false }),
                  Collaboration.configure({ document }),
                  CollaborationCursor.configure({
                      provider,
                      user: userData,
                  }),
              ]
            : [StarterKit.configure({ history: false })],
    }, [provider, userData, updateMyPresence, debouncedStopTyping]);

    // Keep editor content in sync with incoming initialContent (AI output)
    // CRITICAL FIX: Only set content if editor is completely empty
    useEffect(() => {
        if (!editor) return;
        if (typeof initialContent !== 'string') return;

        // Only set initial content if the editor is completely empty
        // This prevents wiping out collaborative edits on page refresh
        if (initialContent && editor.isEmpty) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    return editor ? (
        <EditorContent editor={editor} />
    ) : (
        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 min-h-[400px] flex items-center justify-center text-gray-400">
            Loading editor...
        </div>
    );
}
