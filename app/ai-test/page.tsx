import { MultiEngineChat } from "@/components/ai/multi-engine-chat";

export default function AiTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-2">Multi-Model AI Lab</h1>
      <p className="text-center text-muted-foreground mb-8">
        Google Gemini 1.5 Flash와 Groq Llama 3의 속도와 품질을 비교해보세요.
      </p>
      <MultiEngineChat />
    </div>
  );
}
