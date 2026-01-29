// 문의 작성 폼 컴포넌트

"use client";

import { useMemo, useState, useTransition } from "react";

import { retryInquiryAI, submitInquiry } from "@/app/actions/inquiries";
import { AiResponse } from "@/components/domain/inquiry/ai-response";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { inquiryContentSchema } from "@/lib/utils/validation";

export function InquiryForm({ productId }: { productId: string }) {
  const [content, setContent] = useState("");
  const [inquiryId, setInquiryId] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fieldError = useMemo(() => {
    const res = inquiryContentSchema.safeParse(content);
    return res.success ? null : res.error.issues[0]?.message ?? "입력값을 확인해 주세요.";
  }, [content]);

  const onSubmit = () => {
    setError(null);
    setAiResponse(null);

    startTransition(async () => {
      const res = await submitInquiry({ productId, content });
      setInquiryId(res.id);
      if ("error" in res) {
        setError(res.error ?? "AI 생성에 실패했습니다.");
        return;
      }
      setAiResponse(res.aiResponse);
    });
  };

  const onRetry = inquiryId
    ? () => {
        setError(null);
        setAiResponse(null);
        startTransition(async () => {
          const res = await retryInquiryAI(inquiryId);
          setInquiryId(res.id);
          setAiResponse(res.aiResponse);
        });
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold">문의 내용</h2>
          <p className="text-sm text-muted-foreground">
            요구 사항을 입력하면 AI가 빠르게 정리해 드립니다. (최대 2000자)
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="inquiry-content" className="text-sm font-medium">
            문의 텍스트
          </label>
          <Textarea
            id="inquiry-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예) 내열성이 높은 Graphite 소재가 필요합니다. 사용 온도 범위는 ..."
            className="min-h-[160px]"
            disabled={isPending}
          />
          {fieldError ? (
            <p className="text-sm text-destructive">{fieldError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              입력 후 “AI 응답 생성”을 누르면 문의가 저장됩니다.
            </p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onSubmit} disabled={isPending || !!fieldError}>
            {isPending ? "처리 중…" : "AI 응답 생성"}
          </Button>
        </div>
      </div>

      <AiResponse
        inquiryId={inquiryId}
        aiResponse={aiResponse}
        error={error}
        onRetry={onRetry}
      />
    </div>
  );
}
