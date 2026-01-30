import { notFound } from "next/navigation";

import { getProductById } from "@/app/actions/products";
import { getUser } from "@/app/actions/auth";
import { ProductDetail } from "@/components/domain/product/product-detail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const user = await getUser();

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} currentUserId={user?.id} />;
}
