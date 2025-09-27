// File: liveblocks.config.ts
import { createClient } from "@liveblocks/client";
import { createRoomContext, createLiveblocksContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type Storage = {
  content: string;
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
