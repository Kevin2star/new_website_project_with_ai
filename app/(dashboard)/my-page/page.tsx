import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

import { getMyInquiries } from "@/app/actions/inquiries";
import { InquiryList } from "@/components/domain/inquiry/inquiry-list";
import { routes } from "@/lib/constants/routes";
import { toInquiryListItem } from "@/lib/utils/map-db-to-domain";

export default async function MyPage() {
  const rows = await getMyInquiries();
  const inquiries = rows.map(toInquiryListItem);

  return (
    <main className="flex-1">
      <section className="border-b border-border bg-background py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            My Inquiries
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your submitted product inquiries
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          {inquiries.length > 0 ? (
            <InquiryList inquiries={inquiries} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No inquiries yet</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Start by browsing our products and submitting your first
                inquiry.
              </p>
              <Button asChild className="gap-2">
                <Link href={routes.products}>
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
