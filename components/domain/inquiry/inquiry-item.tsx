// 문의 아이템 컴포넌트

"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

import type { InquiryListItem } from "@/types/domain";

import { deleteInquiry } from "@/app/actions/inquiries";
import { routes } from "@/lib/constants/routes";
import { formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function InquiryItem({ inquiry }: { inquiry: InquiryListItem }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteInquiry(inquiry.id);
      // 간단하게 새로고침하여 RSC 목록을 갱신한다.
      window.location.reload();
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Link href={routes.product(inquiry.productId)} className="font-semibold hover:text-accent">
              제품 상세 보기
            </Link>
            <span className="text-sm text-muted-foreground">&middot;</span>
            <time className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</time>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{inquiry.preview}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={routes.product(inquiry.productId)}>제품 보기</Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">문의 삭제</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>문의 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  이 문의를 삭제할까요? 삭제 후에는 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? "삭제 중…" : "삭제"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
