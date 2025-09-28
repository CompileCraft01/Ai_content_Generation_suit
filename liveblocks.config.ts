// File: liveblocks.config.ts
import { createClient, LiveObject } from "@liveblocks/client";
import { createRoomContext, createLiveblocksContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
  isTyping: boolean;
};

// Define the structure of a mind map node
type MindMapNode = {
  id: string;
  text: string;
  children: MindMapNode[];
  x?: number;
  y?: number;
};

type Storage = {
  content: string;
  // mindMap will hold the entire state of our mind map.
  mindMap: LiveObject<{
    root: MindMapNode;
  }>;
  // Track if content has been initialized to prevent duplicates
  contentInitialized: LiveObject<{
    initialized: boolean;
  }>;
};


type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    avatar: string;
  };
};

// Create Liveblocks context
export const {
  LiveblocksProvider,
} = createLiveblocksContext(client);

// Create room context with proper typing
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useSelf,
  useOthers,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta>(client);
