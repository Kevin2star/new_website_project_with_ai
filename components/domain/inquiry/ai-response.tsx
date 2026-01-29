// AI 응답 표시 컴포넌트

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export function AiResponse({
  inquiryId,
  aiResponse,
  error,
  onRetry,
}: {
  inquiryId: string;
  aiResponse: string | null;
  error: string | null;
  onRetry: (() => void) | null;
}) {
  if (!inquiryId) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">AI 응답</h2>
        <div className="flex items-center gap-2">
          {onRetry ? (
            <Button variant="outline" onClick={onRetry}>
              재시도
            </Button>
          ) : null}
          <Button asChild>
            <Link href={routes.myPage}>마이페이지로</Link>
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">생성에 실패했습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            문의는 저장되어 있습니다. 재시도하면 같은 문의(id:{" "}
            <span className="font-mono text-foreground">{inquiryId}</span>)에 AI 응답을
            다시 저장합니다.
          </p>
        </div>
      ) : aiResponse ? (
        <div className="whitespace-pre-line rounded-md border border-border bg-muted/30 p-4 text-sm text-foreground">
          {aiResponse}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">응답을 생성하는 중입니다…</p>
      )}
    </div>
  );
}
