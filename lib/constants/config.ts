// 앱 설정 상수

// ⚠️ 주의: 브라우저 번들에서는 `process.env[name]` 같은
// 동적 접근이 동작하지 않는다. (Next.js는 정적 키만 치환)
// 따라서 공개용 환경변수는 정적 프로퍼티로 읽어야 한다.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/**
 * Client 번들에 포함될 수 있는 NEXT_PUBLIC_* 값만 노출.
 * (서버 전용 키는 여기서 export 하지 않음)
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  supabaseUrl,
  supabaseAnonKey,
} as const;

export function getServerEnv() {
  // Server-only secrets (Route Handler / Server Actions에서만 사용)
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const openAiApiKey = process.env.OPENAI_API_KEY ?? "";
  const googleAiApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "";
  const groqApiKey = process.env.GROQ_API_KEY ?? "";

  return {
    supabaseServiceRoleKey,
    openAiApiKey,
    googleAiApiKey,
    groqApiKey,
  } as const;
}
