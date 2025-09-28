import { NextResponse } from "next/server";

// Master Mind Map System Prompt - "Synapse" AI
const MIND_MAP_SYSTEM_PROMPT = `
//-- IDENTITY & ROLE --//
You are "Synapse," an expert AI specializing in conceptual structuring and knowledge mapping. Your purpose is to deconstruct any given topic into a clear, logical, and hierarchical mind map structure.

//-- CORE DIRECTIVE --//
Your SOLE and ONLY output MUST be a single, valid JSON object. Do not include any introductory text, explanations, apologies, markdown code blocks (```json), or any text outside of the JSON structure. Start directly with { and end with }.

//-- JSON STRUCTURE RULES --//
The JSON object must represent a mind map and follow this exact recursive structure:
- It must have a single root node.
- Each node object must contain:
  - id: A unique string identifier.
  - text: A concise, descriptive label for the node (max 10 words).
  - children: An array of other node objects. If there are no sub-topics, this must be an empty array [].

//-- CONTENT DECONSTRUCTION PROCESS --//
When you receive a user's prompt, you must perform the following steps:
1.  Identify the Central Topic: This becomes the text for your root node.
2.  Determine Primary Sub-Topics: Break down the central topic into its most important main categories. These will be the first-level objects in the root node's children array.
3.  Add Key Details: For each primary sub-topic, provide 2-4 key details, facts, or examples. These will be the nested objects in each sub-topic's children array.
4.  Maintain Hierarchy: Ensure the structure is logical and easy to follow, going from broad concepts to specific details.

//-- EXAMPLE --//
User Prompt: "Instagram Hashtags for NVIDIA"
Your Correct JSON Output:
{
  "root": {
    "id": "1",
    "text": "Instagram Hashtag Strategy for NVIDIA",
    "children": [
      {
        "id": "2",
        "text": "Core Brand Hashtags",
        "children": [
          { "id": "2-1", "text": "#NVIDIA", "children": [] },
          { "id": "2-2", "text": "#GeForce", "children": [] },
          { "id": "2-3", "text": "#RTXOn", "children": [] }
        ]
      },
      {
        "id": "3",
        "text": "Community & Gaming Hashtags",
        "children": [
          { "id": "3-1", "text": "#GamingPC", "children": [] },
          { "id": "3-2", "text": "#PCMasterRace", "children": [] },
          { "id": "3-3", "text": "#Gamer", "children": [] }
        ]
      },
      {
        "id": "4",
        "text": "Technology & AI Hashtags",
        "children": [
          { "id": "4-1", "text": "#AI", "children": [] },
          { "id": "4-2", "text": "#DeepLearning", "children": [] },
          { "id": "4-3", "text": "#Tech", "children": [] }
        ]
      }
    ]
  }
}

Remember: Output ONLY the JSON object, nothing else. Do NOT use markdown formatting or code blocks.`;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Combine system prompt with user prompt
    const finalPrompt = MIND_MAP_SYSTEM_PROMPT + "\n\nUser Prompt: " + prompt;
    const apiKey = (process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || "").trim();
    console.log("[generate-content] GROQ_API_KEY present:", apiKey.length > 0);
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing. Set GROQ_API_KEY=... in .env.local (or NEXT_PUBLIC_GROQ_API_KEY) and restart the dev server.");
    }

    // Try multiple Groq models in order (avoid decommissioned IDs)
    const models = [
      "gemma2-9b-it",                // working per recent logs
      "llama-3.1-70b-versatile",     // current Groq ID
      "llama-3.1-8b-instant"         // faster, smaller
    ];

    let lastErrorText = "";
    for (const model of models) {
      try {
        console.log(`[generate-content] Trying Groq model: ${model}`);

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: MIND_MAP_SYSTEM_PROMPT },
              { role: "user", content: prompt }
            ],
            temperature: 0.3, // Lower temperature for more structured output
            max_tokens: 2048, // Increased for JSON responses
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          lastErrorText = `status=${res.status} ${errText}`;
          console.warn(`[generate-content] Model ${model} failed:`, lastErrorText);

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
        
        // Clean up the response - remove markdown code blocks and extra formatting
        aiResponse = aiResponse
          .replace(/```json\s*/gi, '') // Remove ```json
          .replace(/```\s*/g, '') // Remove closing ```
          .replace(/^[\s\n]*/, '') // Remove leading whitespace/newlines
          .replace(/[\s\n]*$/, '') // Remove trailing whitespace/newlines
          .trim();
        
        try {
          // Try to parse the cleaned AI response as JSON
          const mindMapData = JSON.parse(aiResponse);
          
          // Validate the structure
          if (!mindMapData.root || !mindMapData.root.id || !mindMapData.root.text) {
            throw new Error("Invalid mind map structure: missing root node");
          }
          
          // Return both the parsed JSON and raw text for flexibility
          return NextResponse.json({ 
            text: aiResponse, // Raw AI response
            mindMap: mindMapData, // Parsed mind map data
            model, 
            success: true 
          });
        } catch (parseError) {
          // If JSON parsing fails, return the raw text and log the error
          console.warn("[generate-content] Failed to parse AI response as JSON:", parseError);
          console.log("[generate-content] Raw AI response:", aiResponse);
          
          return NextResponse.json({ 
            text: aiResponse, 
            mindMap: null,
            model, 
            success: true,
            warning: "AI response was not valid JSON"
          });
        }
      } catch (e: any) {
        lastErrorText = e?.message || String(e);
        console.warn(`[generate-content] Model ${model} threw:`, lastErrorText);
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
    console.error("Content generation failed:", error);

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
