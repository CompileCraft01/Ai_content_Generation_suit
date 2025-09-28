import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 },
      );
    }

    // Try GROQ first, then fallback to generate-content API
    const groqApiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (groqApiKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [{
              role: 'user',
              content: `Provide a quick, concise summary about: "${query}". Include key facts, recent developments, and important details. Keep it informative but brief (2-3 paragraphs maximum).`
            }],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.choices?.[0]?.message?.content || "No response generated";
          
          return NextResponse.json({
            result,
            query,
            success: true
          });
        }
      } catch (error) {
        console.log('GROQ failed, trying fallback...');
      }
    }

    // Fallback to template content API for better text responses
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-template-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Provide a quick, concise summary about: "${query}". Include key facts, recent developments, and important details. Keep it informative but brief (2-3 paragraphs maximum).`
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fallback API error:', errorText);
      return NextResponse.json(
        { error: "Failed to get response from all APIs" },
        { status: 500 },
      );
    }

    const data = await response.json();
    
    // Handle the response structure from template content API
    const result = data.text || data.result || "No response generated";

    return NextResponse.json({
      result,
      query,
      success: true
    });

  } catch (error: any) {
    console.error("Quick search failed:", error);
    return NextResponse.json(
      {
        error: "Quick search service is temporarily unavailable",
        details: error?.message || "Unknown error occurred",
        success: false,
      },
      { status: 500 },
    );
  }
}
