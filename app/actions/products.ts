// 제품 관련 Server Actions

"use server";

import { requireUser } from "@/app/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toProduct } from "@/lib/utils/map-db-to-domain";
import type { Product } from "@/types/domain";

export async function getProducts(): Promise<Product[]> {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toProduct(data);
}
