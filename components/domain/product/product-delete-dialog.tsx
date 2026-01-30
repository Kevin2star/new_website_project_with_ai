"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteProduct } from "@/app/actions/products";
import { routes } from "@/lib/constants/routes";
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

interface ProductDeleteDialogProps {
  productId: string;
  productName: string;
}

export function ProductDeleteDialog({ productId, productName }: ProductDeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (step === 3) {
        // Step 3 (Success) closing -> Redirect
        router.push(routes.products);
      } else {
        // Reset if closed early
        setOpen(false);
        setStep(1);
      }
    } else {
      setOpen(true);
    }
  };

  const handleConfirmStep1 = () => {
    setStep(2);
  };

  const handleConfirmStep2 = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      setStep(3);
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
      setOpen(false);
      setStep(1);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmStep3 = () => {
    setOpen(false);
    router.push(routes.products);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          삭제하기
        </Button>
      </AlertDialogTrigger>
      {step === 1 && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제품 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {productName} 제품을 리스트에서 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStep(1)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => {
              e.preventDefault(); // Prevent closing
              handleConfirmStep1();
            }}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {step === 2 && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>경고!</AlertDialogTitle>
            <AlertDialogDescription>
              이 동작은 복구 불가능합니다! 정말로 이 제품을 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmStep2();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {step === 3 && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 완료</AlertDialogTitle>
            <AlertDialogDescription>
              제품이 삭제되었습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleConfirmStep3}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
