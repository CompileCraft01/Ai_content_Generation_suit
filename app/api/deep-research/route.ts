import { NextResponse } from "next/server";
import https from 'https';

export async function POST(request: Request) {
  try {
    const { query, url } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 },
      );
    }

    const jinaToken = process.env.JINA_API_KEY || 'jina_aaac03f1c1bb47c283387210d427ac86NNvO-SVHr9JygP3mmAUfqgrsvilg';
    
    // Try Jina AI first for web research
    try {
      const searchUrl = url || `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`;
      const jinaUrl = `https://r.jina.ai/${searchUrl}`;

      const jinaResponse = await fetch(jinaUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jinaToken}`,
          'Accept': 'text/plain',
          'User-Agent': 'Mozilla/5.0 (compatible; DeepResearch/1.0)',
        },
      });

      if (jinaResponse.ok) {
        let jinaData = await jinaResponse.text();
        
        // Clean and process the Jina response
        if (jinaData && jinaData.length > 100) {
          // Remove JSON error messages if present
          if (jinaData.includes('"code":') || jinaData.includes('"status":')) {
            throw new Error('Jina returned error response');
          }
          
          // Clean up the content
          jinaData = jinaData
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .replace(/\s{3,}/g, ' ') // Remove excessive spaces
            .trim();
          
          // Limit length for readability
          if (jinaData.length > 2000) {
            const paragraphs = jinaData.split('\n\n').filter(p => p.trim().length > 50);
            jinaData = paragraphs.slice(0, 6).join('\n\n');
            if (jinaData.length > 1800) {
              jinaData = jinaData.substring(0, 1800) + '...\n\n[Content truncated for readability]';
            }
          }
          
          return NextResponse.json({
            result: jinaData,
            query,
            sourceUrl: searchUrl,
            success: true
          });
        }
      }
    } catch (error) {
      console.log('Jina AI failed, trying fallback...', error);
    }

    // Fallback to template content API for better text responses
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/generate-template-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Provide comprehensive, detailed research about: "${query}". Include:
        1. Overview and definition
        2. Key characteristics and features
        3. Benefits and advantages
        4. Potential challenges or considerations
        5. Current trends and developments
        6. Practical applications or examples
        
        Make it informative and well-structured (4-6 paragraphs).`
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
    console.error("Deep research failed:", error);
    return NextResponse.json(
      {
        error: "Deep research service is temporarily unavailable",
        details: error?.message || "Unknown error occurred",
        success: false,
      },
      { status: 500 },
    );
  }
}
