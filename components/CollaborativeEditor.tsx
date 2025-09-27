// File: components/CollaborativeEditor.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import LiveblocksYjsProvider from '@liveblocks/yjs';
import * as Y from 'yjs';
import { useRoom, useSelf } from '../liveblocks.config';

interface CollaborativeEditorProps {
    document: Y.Doc;
    initialContent: string;
}

export function CollaborativeEditor({ document, initialContent }: CollaborativeEditorProps) {
    const room = useRoom();
    const userInfo = useSelf();
    const [provider, setProvider] = useState<any>(null);

    // Memoize user data to prevent unnecessary re-renders
    const userData = useMemo(() => ({
        name: userInfo?.info?.name ?? 'Anonymous',
        color: userInfo?.info?.color ?? '#f783ac',
    }), [userInfo?.info?.name, userInfo?.info?.color]);

    const editor = useEditor({
        immediatelyRender: false, // fix hydration mismatches on SSR
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px]',
            },
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
    }, [provider]);

    // Set up provider only once when room and document are available
    useEffect(() => {
        if (!room || !document || provider) return;
        
        const newProvider = new LiveblocksYjsProvider(room, document);
        setProvider(newProvider);
        
        return () => {
            newProvider?.destroy();
        };
    }, [room, document]);

    // Keep editor content in sync with incoming initialContent (AI output)
    useEffect(() => {
        if (!editor) return;
        if (typeof initialContent !== 'string') return;

        const currentText = editor.getText().trim();
        const nextText = initialContent.trim();

        // Only update if different to avoid unnecessary cursor jumps
        if (nextText && currentText !== nextText) {
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
