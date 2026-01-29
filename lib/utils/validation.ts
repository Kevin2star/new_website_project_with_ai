// 유효성 검사 유틸리티

import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const inquiryContentSchema = z
  .string()
  .trim()
  .min(1, "문의 내용을 입력해 주세요.")
  .max(2000, "문의 내용은 2000자 이하로 입력해 주세요.");

export const createInquiryInputSchema = z.object({
  productId: uuidSchema,
  content: inquiryContentSchema,
});

export type CreateInquiryInput = z.infer<typeof createInquiryInputSchema>;
