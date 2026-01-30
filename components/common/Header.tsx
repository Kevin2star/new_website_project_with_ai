"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

import { LoginButton } from "@/components/domain/auth/login-button";
import { UserMenu } from "@/components/domain/auth/user-menu";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/ai-test", label: "AI Chat" },
    { href: "/my-page", label: "My Inquiries" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary">
            <span className="font-mono text-sm font-bold text-primary-foreground">
              DY
            </span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            DY Carbon
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? null : user ? (
            <UserMenu displayName={user.user_metadata?.name ?? user.email ?? "User"} />
          ) : (
            <LoginButton nextPath={pathname} />
          )}
        </div>
      </div>
    </header>
  );
}
