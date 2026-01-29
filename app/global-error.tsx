"use client";

import Link from "next/link";
import { useEffect } from "react";

import "./globals.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ErrorWithDigest = Error & { digest?: string };

function getSafeErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "알 수 없는 오류가 발생했습니다.";
}

export default function GlobalError({
  error,
  reset,
}: {
  error: ErrorWithDigest;
  reset: () => void;
}) {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    console.error(error);
  }, [error]);

  const message = getSafeErrorMessage(error);
  const digest = error?.digest;

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-14">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">문제가 발생했습니다</CardTitle>
                <CardDescription>
                  시스템에서 오류가 발생했습니다. 메인 화면으로 돌아가 다시
                  시도해 주세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border bg-muted/30 p-4">
                  <p className="text-sm font-medium text-foreground">오류 내용</p>
                  <p className="mt-1 break-words font-mono text-sm text-muted-foreground">
                    {message}
                  </p>
                  {digest ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      error digest:{" "}
                      <span className="font-mono text-xs text-foreground">
                        {digest}
                      </span>
                    </p>
                  ) : null}
                </div>

                {isProduction ? null : (
                  <details className="rounded-md border border-border p-4">
                    <summary className="cursor-pointer text-sm font-medium">
                      기술 정보(개발자용)
                    </summary>
                    <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/30 p-3 text-xs text-muted-foreground">
                      {String(error?.stack ?? "")}
                    </pre>
                  </details>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={reset}>
                  다시 시도
                </Button>
                <Button asChild>
                  <Link href="/">메인 화면으로</Link>
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      </body>
    </html>
  );
}

