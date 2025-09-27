import { NextResponse } from "next/server";

export async function GET() {
  const rawGroq = process.env.GROQ_API_KEY || "";
  const rawGroqPublic = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

  return NextResponse.json({
    GROQ_API_KEY_present: rawGroq.trim().length > 0,
    NEXT_PUBLIC_GROQ_API_KEY_present: rawGroqPublic.trim().length > 0,
    // Do NOT return secrets themselves
  });
}
