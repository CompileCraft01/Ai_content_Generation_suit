// File: components/CollaborativeEditor.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import LiveblocksYjsProvider from '@liveblocks/yjs';
import * as Y from 'yjs';
import { useRoom, useSelf, useMyPresence, useMutation } from '../liveblocks.config';
import RichTextToolbar from './RichTextToolbar';
import '../styles/rich-text-editor.css';

interface CollaborativeEditorProps {
    document: Y.Doc;
    initialContent: string;
}

export function CollaborativeEditor({ document, initialContent }: CollaborativeEditorProps) {
    const room = useRoom();
    const userInfo = useSelf();
    const [myPresence, updateMyPresence] = useMyPresence();
    const [provider, setProvider] = useState<any>(null);

    // Mutation to sync editor content to Liveblocks storage
    const syncContentToStorageMutation = useMutation(({ storage }, content: string) => {
        try {
            const currentContent = storage.get('content');
            // Only update if content is different to prevent unnecessary updates
            if (currentContent !== content) {
                storage.set('content', content);
                console.log('Synced content to storage:', content.substring(0, 50) + '...');
            }
        } catch (error) {
            console.log('Storage not ready yet:', error);
        }
    }, []);

    // Safe function to sync content that checks connection first
    const syncContentToStorage = useCallback((content: string) => {
        if (!room || room.getConnectionState() !== 'open') {
            console.log('Room not connected, skipping storage sync');
            return;
        }
        
        try {
            syncContentToStorageMutation(content);
        } catch (error) {
            console.log('Failed to sync content to storage:', error);
        }
    }, [room, syncContentToStorageMutation]);

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
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px] p-4 text-black',
            },
        },
        onUpdate: ({ editor }) => {
            // Set typing indicator when user types
            updateMyPresence({ isTyping: true });
            // Clear typing indicator after 2 seconds of inactivity
            debouncedStopTyping();
            
            // Sync content to Liveblocks storage for mind map
            const content = editor.getText();
            if (content && content.trim().length > 0) {
                syncContentToStorage(content);
            }
        },
        extensions: provider
            ? [
                  StarterKit.configure({ 
                      history: false,
                      codeBlock: false,
                      blockquote: false,
                      horizontalRule: false,
                      bulletList: false,
                      orderedList: false,
                      listItem: false,
                  }),
                  TextStyle,
                  Color,
                  Highlight.configure({
                      multicolor: true,
                  }),
                  FontFamily,
                  TextAlign.configure({
                      types: ['heading', 'paragraph'],
                  }),
                  Underline,
                  Strike,
                  Superscript,
                  Subscript,
                  CodeBlock,
                  Blockquote,
                  HorizontalRule,
                  BulletList,
                  OrderedList,
                  ListItem,
                  TaskList,
                  TaskItem.configure({
                      nested: true,
                  }),
                  Link.configure({
                      openOnClick: false,
                      HTMLAttributes: {
                          class: 'text-gray-500 underline cursor-pointer',
                      },
                  }),
                  Image.configure({
                      HTMLAttributes: {
                          class: 'max-w-full h-auto',
                      },
                  }),
                  Collaboration.configure({ document }),
                  CollaborationCursor.configure({
                      provider,
                      user: userData,
                  }),
              ]
            : [
                  StarterKit.configure({ 
                      history: false,
                      codeBlock: false,
                      blockquote: false,
                      horizontalRule: false,
                      bulletList: false,
                      orderedList: false,
                      listItem: false,
                  }),
                  TextStyle,
                  Color,
                  Highlight.configure({
                      multicolor: true,
                  }),
                  FontFamily,
                  TextAlign.configure({
                      types: ['heading', 'paragraph'],
                  }),
                  Underline,
                  Strike,
                  Superscript,
                  Subscript,
                  CodeBlock,
                  Blockquote,
                  HorizontalRule,
                  BulletList,
                  OrderedList,
                  ListItem,
                  TaskList,
                  TaskItem.configure({
                      nested: true,
                  }),
                  Link.configure({
                      openOnClick: false,
                      HTMLAttributes: {
                          class: 'text-gray-500 underline cursor-pointer',
                      },
                  }),
                  Image.configure({
                      HTMLAttributes: {
                          class: 'max-w-full h-auto',
                      },
                  }),
              ],
    }, [provider, userData, updateMyPresence, debouncedStopTyping]);

    // Keep editor content in sync with incoming initialContent (AI output)
    // CRITICAL FIX: Only set content if editor is completely empty and we haven't set it before
    const [hasSetInitialContent, setHasSetInitialContent] = useState(false);
    
    useEffect(() => {
        if (!editor) return;
        if (typeof initialContent !== 'string') return;
        if (hasSetInitialContent) return; // Prevent multiple sets

        // Only set initial content if the editor is completely empty
        // This prevents wiping out collaborative edits on page refresh
        if (initialContent && initialContent.trim().length > 0 && editor.isEmpty) {
            console.log('Setting initial content in editor:', initialContent.substring(0, 100) + '...');
            editor.commands.setContent(initialContent);
            setHasSetInitialContent(true);
            
            // Also sync to storage for mind map
            syncContentToStorage(initialContent);
        }
    }, [editor, initialContent, syncContentToStorage, room, hasSetInitialContent]);

    return editor ? (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <RichTextToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    ) : (
        <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 min-h-[400px] flex items-center justify-center text-gray-400">
            Loading editor...
        </div>
    );
}
