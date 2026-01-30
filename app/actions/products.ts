// 제품 관련 Server Actions

"use server";

import { requireUser } from "@/app/actions/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toProduct } from "@/lib/utils/map-db-to-domain";
import type { Database, ProductRow } from "@/types/database";
import type { Product } from "@/types/domain";
import type { ProductType } from "@/types/domain";

export interface CreateProductInput {
  name: string;
  productType?: ProductType;
  summary?: string;
  description?: string;
  applications?: string[];
  specifications?: Record<string, { value: string; unit: string }>;
}

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

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  // 입력 검증
  if (!input.name || !input.name.trim()) {
    throw new Error("제품명은 필수입니다.");
  }
  if (
    input.productType &&
    !["Molded", "Extruded", "CIP (Isotropic)"].includes(input.productType)
  ) {
    throw new Error("제품 타입은 Molded, Extruded, 또는 CIP (Isotropic)여야 합니다.");
  }

  const insertData: Database["public"]["Tables"]["products"]["Insert"] = {
    name: input.name.trim(),
    product_type: input.productType || null,
    summary: input.summary?.trim() || null,
    description: input.description?.trim() || null,
    applications: input.applications && input.applications.length > 0 ? input.applications : [],
    specifications: input.specifications && Object.keys(input.specifications).length > 0 ? input.specifications : {},
    created_by: user.id,
  };

  const { data, error } = await supabaseAny.from("products").insert(insertData).select().single();

  if (error) {
    throw new Error(`제품 등록 실패: ${error.message}`);
  }

  return toProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // 소유권 확인
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !product) {
    throw new Error("제품을 찾을 수 없습니다.");
  }

  const productRow = product as ProductRow;
  if (productRow.created_by !== user.id) {
    throw new Error("삭제 권한이 없습니다.");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(`제품 삭제 실패: ${error.message}`);
  }
}

export async function updateProduct(id: string, input: CreateProductInput): Promise<Product> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const supabaseAny = supabase as any;

  // 소유권 확인
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !product) {
    throw new Error("제품을 찾을 수 없습니다.");
  }

  const productRow = product as ProductRow;
  if (productRow.created_by !== user.id) {
    throw new Error("수정 권한이 없습니다.");
  }

  // 입력 검증
  if (!input.name || !input.name.trim()) {
    throw new Error("제품명은 필수입니다.");
  }
  if (
    input.productType &&
    !["Molded", "Extruded", "CIP (Isotropic)"].includes(input.productType)
  ) {
    throw new Error("제품 타입은 Molded, Extruded, 또는 CIP (Isotropic)여야 합니다.");
  }

  const updateData: Database["public"]["Tables"]["products"]["Update"] = {
    name: input.name.trim(),
    product_type: input.productType || null,
    summary: input.summary?.trim() || null,
    description: input.description?.trim() || null,
    applications: input.applications && input.applications.length > 0 ? input.applications : [],
    specifications: input.specifications && Object.keys(input.specifications).length > 0 ? input.specifications : {},
  };

  const { data, error } = await supabaseAny
    .from("products")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`제품 수정 실패: ${error.message}`);
  }

  return toProduct(data);
}
