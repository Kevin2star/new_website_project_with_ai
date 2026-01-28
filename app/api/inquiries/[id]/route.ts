import { NextResponse } from "next/server";

// TODO: 문의 개별 조회/수정/삭제 로직 구현 필요
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Supabase에서 문의 조회
  return NextResponse.json({ id, message: "Inquiry endpoint - to be implemented" });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Supabase에서 문의 삭제
  return NextResponse.json({ id, message: "Inquiry deleted - to be implemented" });
}
