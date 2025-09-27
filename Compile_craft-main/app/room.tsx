"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room" initialPresence={{ cursor: null }}>
      {children}
    </RoomProvider>
  );
}
