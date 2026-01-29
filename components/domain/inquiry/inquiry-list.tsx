// 문의 목록 컴포넌트

import type { InquiryListItem } from "@/types/domain";

import { InquiryItem } from "@/components/domain/inquiry/inquiry-item";

export function InquiryList({ inquiries }: { inquiries: InquiryListItem[] }) {
  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <InquiryItem key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
}
