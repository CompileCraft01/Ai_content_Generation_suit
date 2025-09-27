"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { LiveObject } from "@liveblocks/client";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider 
      id="my-room" 
      initialPresence={{ cursor: null, isTyping: false }}
      initialStorage={{ 
        content: "",
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
      {children}
    </RoomProvider>
  );
}
