"use client";

import { useState } from "react";
import { Loader2, Send, AlertCircle, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// I'll assume standard shadcn/ui components exist or I can use standard HTML select if they don't to avoid complexity.
// Based on package.json, user has `@radix-ui/react-select` ... wait, no. 
// User has `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`. 
// I don't see `@radix-ui/react-select` in package.json provided earlier.
// So I should stick to standard HTML <select> or build a simple one to avoid missing dependency errors.
// BUT, I can try to use a simple styled div/select.

type Provider = "google" | "groq";

export function MultiEngineChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<Provider>("google");
  const [stats, setStats] = useState<{ duration: number; provider: string } | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setStats(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          category: "user_chat",
          provider: provider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.code === "QUOTA_EXCEEDED") {
             throw new Error("구글 할당량이 초과되었습니다. Groq 엔진으로 변경하여 시도해 보세요.");
        }
        throw new Error(data.error || "AI 요청 중 문제가 발생했습니다.");
      }

      setResponse(data.response);
      setStats({ duration: data.duration, provider: data.provider });
      
      console.log(`[Frontend] Used ${data.provider} in ${data.duration}ms`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">AI Assistant</CardTitle>
        <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <select
                className="h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                disabled={isLoading}
            >
                <option value="google">Google Gemini (Flash)</option>
                <option value="groq">Groq (Llama 3)</option>
            </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <Textarea
          placeholder="질문을 입력하세요..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="min-h-[100px]"
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="p-4 bg-muted/50 rounded-md">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm text-foreground">AI 답변</h4>
                {stats && (
                    <span className="text-xs text-muted-foreground">
                        {stats.provider === 'google' ? 'Gemini' : 'Llama'} • {stats.duration}ms
                    </span>
                )}
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {response}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading || !prompt.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {provider === 'google' ? 'Gemini 생각 중...' : 'Groq 생각 중...'}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              전송
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
