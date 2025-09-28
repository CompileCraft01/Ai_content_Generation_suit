import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const apiKey = (process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "").trim();
    console.log("[generate-template-content] GROQ_API_KEY present:", apiKey.length > 0);
    
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing. Set GROQ_API_KEY=... in .env.local (or NEXT_PUBLIC_GROQ_API_KEY) and restart the dev server.");
    }

    // Try multiple Groq models in order
    const models = [
      "gemma2-9b-it",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant"
    ];

    let lastErrorText = "";
    for (const model of models) {
      try {
        console.log(`[generate-template-content] Trying Groq model: ${model}`);

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "user", content: prompt }
            ],
            temperature: 0.7, // Higher temperature for creative content
            max_tokens: 4000, // Increased for longer content
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          lastErrorText = `status=${res.status} ${errText}`;
          console.warn(`[generate-template-content] Model ${model} failed:`, lastErrorText);

          // Try next model for 400/404/503/429; only hard-fail on 401/403
          if (res.status === 401 || res.status === 403) {
            return NextResponse.json(
              {
                error: "Invalid or unauthorized GROQ_API_KEY.",
                details: errText,
                success: false,
              },
              { status: 401 },
            );
          }
          continue;
        }

        const data = await res.json();
        let aiResponse = data?.choices?.[0]?.message?.content ?? "";
        
        // Clean up the response - remove any unwanted formatting
        aiResponse = aiResponse
          .replace(/```json\s*/gi, '') // Remove ```json
          .replace(/```\s*/g, '') // Remove closing ```
          .trim();
        
        // Return the clean text response
        return NextResponse.json({ 
          text: aiResponse,
          model, 
          success: true 
        });

      } catch (e: any) {
        lastErrorText = e?.message || String(e);
        console.warn(`[generate-template-content] Model ${model} threw:`, lastErrorText);
        continue;
      }
    }

    // If we got here, all models failed
    return NextResponse.json(
      {
        error: "All AI models are currently unavailable",
        details: lastErrorText,
        success: false,
      },
      { status: 503 },
    );
  } catch (error: any) {
    console.error("Template content generation failed:", error);

    return NextResponse.json(
      {
        error: "Content generation service is temporarily unavailable",
        details: error?.message || "Unknown error occurred",
        success: false,
      },
      { status: 500 },
    );
  }
}
