"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

import type { Product } from "@/types/domain";
import { routes } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductRegistrationForm } from "./product-registration-form";

interface ProductEditDialogProps {
  product: Product;
}

export function ProductEditDialog({ product }: ProductEditDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit className="h-4 w-4" />
          수정하기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>제품 수정</DialogTitle>
          <DialogDescription>
            제품 정보를 수정합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProductRegistrationForm
            initialData={product}
            onSuccess={() => {
              setOpen(false);
              router.push(routes.products);
            }}
            onCancel={() => {
              setOpen(false);
              router.push(routes.products);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
