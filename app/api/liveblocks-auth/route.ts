import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Generate consistent color based on user ID
function getUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#6B7280', '#374151', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#4B5563'
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Generate avatar URL or fallback to initials
function getUserAvatar(user: any, userName: string): string {
  if (user?.imageUrl) {
    return user.imageUrl;
  }
  
  // Generate initials from name
  const initials = userName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
  
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#6366F1"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="system-ui" font-size="12" font-weight="600">
        ${initials}
      </text>
    </svg>
  `)}`;
}

export async function POST(request: Request) {
  try {
    // Get the current user from Clerk auth
    const { userId } = await auth();
    
    // Ensure the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body safely
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    // Get user details for better identification
    const user = await currentUser();
    const userName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] 
      || `User ${userId.slice(-4)}`;

    // Start a session with Liveblocks
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userName,
        color: getUserColor(userId),
        avatar: getUserAvatar(user, userName),
      },
    });

    // Handle room permissions
    const { room } = body;
    if (room && typeof room === 'string') {
      // Allow full access to the specified room
      session.allow(room, session.FULL_ACCESS);
    } else {
      // Allow access to any room for this user (fallback)
      session.allow("*", session.FULL_ACCESS);
    }

    // Authorize the user and return the result
    const { status, body: responseBody } = await session.authorize();
    return new Response(responseBody, { status });
  } catch (error) {
    console.error("Liveblocks auth error:", error);
    
    // Return more specific error information in development
    if (process.env.NODE_ENV === 'development') {
      return new NextResponse(`Auth Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
