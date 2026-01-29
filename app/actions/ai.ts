// AI 관련 Server Actions

"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateInquiryResponse } from "@/lib/ai/client";
import type { ProductRow } from "@/types/database";

export async function generateAIResponse(content: string, productId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle<ProductRow>();

  if (error) throw error;
  if (!product) throw new Error("Product not found.");

  return generateInquiryResponse(content, {
    name: product.name,
    category: product.category,
    summary: product.summary,
    description: product.description,
  });
}
