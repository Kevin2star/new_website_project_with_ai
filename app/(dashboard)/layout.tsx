// 대시보드 레이아웃 (인증 체크)

import { requireUser } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts에서도 보호하지만, RSC 레벨에서 한 번 더 안전하게 체크
  await requireUser();
  return <>{children}</>;
}
