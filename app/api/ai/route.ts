import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateText } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";

import { getServerEnv } from "@/lib/constants/config";
import type { Database } from "@/types/database";

export async function POST(req: NextRequest) {
  try {
    const { prompt, category, provider = "google" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { googleAiApiKey, groqApiKey } = getServerEnv();
    
    if (provider === "google" && !googleAiApiKey) {
       return NextResponse.json({ error: "Google API Key is missing" }, { status: 500 });
    }
    if (provider === "groq" && !groqApiKey) {
       return NextResponse.json({ error: "Groq API Key is missing" }, { status: 500 });
    }

    // 1. Select Model
    let model;
    if (provider === "groq") {
      model = groq("llama-3.3-70b-versatile");
    } else {
      // Use explicit provider initialization with v1 endpoint via baseURL
      const googleProvider = createGoogleGenerativeAI({
        apiKey: googleAiApiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1",
      });
      model = googleProvider("gemini-1.5-flash");
    }

    // 2. Generate Text
    const startTime = Date.now();
    let text = "";
    let usage = { totalTokens: 0, promptTokens: 0, completionTokens: 0 };

    try {
      const result = await generateText({
        model: model as any,
        prompt,
        maxTokens: 300,
        system: "You are a helpful assistant. Answer concisely and to the point.",
      });

      text = result.text;
      usage = result.usage;

      // Check for empty response or invalid usage
      if (!text || text.length === 0) {
        console.warn(`[AI] ${provider} returned empty text. Result:`, JSON.stringify(result, null, 2));
      }
      
    } catch (error: any) {
      console.error(`[AI] ${provider} API Error details:`, {
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        provider: provider
      });
      
      // Handle Quota Exceeded for Google
      if (provider === "google" && (error.message?.includes("429") || error.statusCode === 429)) {
         return NextResponse.json(
             { 
                 error: "Google 할당량이 초과되었습니다. Groq 엔진으로 변경하여 시도해 보세요.",
                 code: "QUOTA_EXCEEDED"
             }, 
             { status: 429 }
         );
      }
      return NextResponse.json(
        { error: `${provider} API Error: ${error.message || "Unknown error"}` },
        { status: 502 } // Bad Gateway
      );
    }

    const duration = Date.now() - startTime;
    console.log(`[AI] Success - Provider: ${provider}, Duration: ${duration}ms, Text Length: ${text.length}, Usage:`, usage);

    // 3. Save to Supabase
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {}
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase
      .from("ai_responses")
      // @ts-ignore
      .insert({
        user_id: user?.id || null,
        prompt: prompt,
        response: text,
        category: category || "general",
        token_usage: usage,
        provider: provider
      });

    if (dbError) {
      console.error("Supabase Save Error:", dbError);
    }

    return NextResponse.json({ 
        response: text, 
        provider,
        duration,
        usage,
        saved: !dbError 
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
