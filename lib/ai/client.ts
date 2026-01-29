// AI 클라이언트 (OpenAI/Gemini)

import { getServerEnv } from "@/lib/constants/config";

type ProductContext = {
  name: string;
  category: string;
  summary: string | null;
  description: string | null;
};

function buildPrompt(content: string, product: ProductContext) {
  const parts = [
    `당신은 산업용 카본/그래파이트 B2B 상담 보조 AI입니다.`,
    ``,
    `제품 정보:`,
    `- 제품명: ${product.name}`,
    `- 카테고리: ${product.category}`,
    `- 요약: ${product.summary ?? "없음"}`,
    `- 상세: ${product.description ?? "없음"}`,
    ``,
    `고객 문의:`,
    content.trim(),
    ``,
    `요청:`,
    `- 문의를 1~2문장으로 요약`,
    `- 추가 확인이 필요한 질문 2~4개`,
    `- 가능한 다음 단계(예: 스펙 확인/샘플/견적/납기) 제안`,
    ``,
    `형식: 한국어로, 불필요한 과장 없이 명확하게 작성`,
  ];
  return parts.join("\n");
}

/**
 * Phase 1: 키가 없는 경우에도 앱 흐름을 유지하기 위해
 * 명확한 에러를 던져 UI에서 실패/재시도 상태로 전환한다.
 */
export async function generateInquiryResponse(content: string, product: ProductContext) {
  const { openAiApiKey, googleAiApiKey } = getServerEnv();
  if (!openAiApiKey && !googleAiApiKey) {
    throw new Error("AI API key is not configured (OPENAI_API_KEY or GOOGLE_AI_API_KEY).");
  }

  // 현재는 OpenAI만 지원 (키가 있으면 사용). Gemini는 Phase 1에서 선택.
  if (!openAiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const prompt = buildPrompt(content, product);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI request failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = (await res.json()) as any;
  const output = json?.choices?.[0]?.message?.content;
  if (!output || typeof output !== "string") {
    throw new Error("OpenAI response missing content.");
  }
  return output.trim();
}
