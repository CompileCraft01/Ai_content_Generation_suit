import type { Metadata } from "next";
import { Inter,Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorAI",
  description: "AI Content Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-900 text-white min-h-screen`}>{children}</body>
      
    </html>
    </ClerkProvider>
  );
}
