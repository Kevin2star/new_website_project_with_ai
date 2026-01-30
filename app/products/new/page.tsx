import { redirect } from "next/navigation";

import { requireUser } from "@/app/actions/auth";
import { ProductRegistrationForm } from "@/components/domain/product/product-registration-form";

export default async function NewProductPage() {
  await requireUser();

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">새 제품 등록</h1>
          <p className="mt-2 text-muted-foreground">제품 정보를 입력하여 카탈로그에 추가합니다.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <ProductRegistrationForm />
        </div>
      </section>
    </main>
  );
}
