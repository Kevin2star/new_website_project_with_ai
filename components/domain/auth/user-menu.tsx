// 사용자 메뉴 컴포넌트

"use client";

import { useMemo, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function UserMenu({ displayName }: { displayName: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await supabase.auth.signOut();
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:inline">{displayName}</span>
      <Button variant="outline" size="sm" onClick={handleLogout} disabled={isPending}>
        {isPending ? "Signing out…" : "Logout"}
      </Button>
    </div>
  );
}
