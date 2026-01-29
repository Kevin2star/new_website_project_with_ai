// 앱 설정 상수

function requirePublicEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Client 번들에 포함될 수 있는 NEXT_PUBLIC_* 값만 노출.
 * (서버 전용 키는 여기서 export 하지 않음)
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  supabaseUrl: requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;

export function getServerEnv() {
  // Server-only secrets (Route Handler / Server Actions에서만 사용)
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const openAiApiKey = process.env.OPENAI_API_KEY ?? "";
  const googleAiApiKey = process.env.GOOGLE_AI_API_KEY ?? "";

  return {
    supabaseServiceRoleKey,
    openAiApiKey,
    googleAiApiKey,
  } as const;
}
