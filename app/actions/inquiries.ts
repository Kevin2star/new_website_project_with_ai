// 문의 관련 Server Actions

"use server";

import { requireUser } from "@/app/actions/auth";
import { generateAIResponse } from "@/app/actions/ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createInquiryInputSchema, uuidSchema } from "@/lib/utils/validation";
import type { InquiryInsert, InquiryRow, ProductRow } from "@/types/database";

export async function createInquiry(input: { productId: string; content: string }) {
  const parsed = createInquiryInputSchema.parse(input);
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  // product 존재 검증 (RLS: products_select_authenticated)
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", parsed.productId)
    .maybeSingle<ProductRow>();
  if (productError) throw productError;
  if (!product) throw new Error("Product not found.");

  const payload: InquiryInsert = {
    user_id: user.id,
    product_id: parsed.productId,
    content: parsed.content,
    ai_response: null,
  };

  const { data, error } = await supabaseAny.from("inquiries").insert(payload).select("id").single();

  if (error) throw error;
  return { id: data.id };
}

export async function updateInquiryAiResponse(id: string, aiResponse: string) {
  const inquiryId = uuidSchema.parse(id);
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { error } = await supabaseAny
    .from("inquiries")
    .update({ ai_response: aiResponse })
    .eq("id", inquiryId)
    .eq("user_id", user.id);

  if (error) throw error;
}

/**
 * FLOW 고정 시퀀스:
 * 1) INSERT Inquiry (ai_response=null)
 * 2) AI 호출
 * 3) UPDATE Inquiry.ai_response
 *
 * AI 실패 시에도 Inquiry는 유지하며, 동일 id로 재시도 가능해야 함.
 */
export async function submitInquiry(input: { productId: string; content: string }) {
  const { id } = await createInquiry(input);

  try {
    const aiResponse = await generateAIResponse(input.content, input.productId);
    await updateInquiryAiResponse(id, aiResponse);
    return { id, aiResponse } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed.";
    return { id, error: message } as const;
  }
}

/**
 * AI 실패 복구용 재시도:
 * inquiryId로 inquiry를 조회해서 (content, product_id)를 가져오고,
 * 동일한 2) AI → 3) UPDATE만 수행한다.
 */
export async function retryInquiryAI(inquiryId: string) {
  const id = uuidSchema.parse(inquiryId);
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { data: inquiry, error } = await supabaseAny
    .from("inquiries")
    .select("id, product_id, content")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (error) throw error;

  const aiResponse = await generateAIResponse(inquiry.content, inquiry.product_id);
  await updateInquiryAiResponse(inquiry.id, aiResponse);
  return { id: inquiry.id, aiResponse } as const;
}

export async function getMyInquiries() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { data, error } = await supabaseAny
    .from("inquiries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as InquiryRow[];
}

export async function deleteInquiry(id: string) {
  const inquiryId = uuidSchema.parse(id);
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  const { error } = await supabaseAny
    .from("inquiries")
    .delete()
    .eq("id", inquiryId)
    .eq("user_id", user.id);

  if (error) throw error;
  return { success: true } as const;
}
