// 제품 카드 컴포넌트

import Link from "next/link";

import type { Product } from "@/types/domain";

import { routes } from "@/lib/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="transition-colors hover:border-accent/30">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-snug">{product.name}</CardTitle>
          {product.productType && (
            <Badge variant="secondary">{product.productType}</Badge>
          )}
        </div>
        {product.summary ? (
          <p className="text-sm text-muted-foreground">{product.summary}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            제품 요약 정보가 아직 등록되지 않았습니다.
          </p>
        )}
      </CardHeader>
      <CardContent />
      <CardFooter className="justify-end">
        <Button asChild>
          <Link href={routes.product(product.id)}>상세 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
