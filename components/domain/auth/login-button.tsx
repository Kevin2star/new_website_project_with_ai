// Google 로그인 버튼 컴포넌트

"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";

export function LoginButton({ nextPath }: { nextPath?: string }) {
  const href = nextPath ? `${routes.login}?next=${encodeURIComponent(nextPath)}` : routes.login;
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={href}>Login</Link>
    </Button>
  );
}
