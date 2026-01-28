"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, ArrowRight, FileText } from "lucide-react";

interface Inquiry {
  id: string;
  productId: string;
  date: string;
  preview: string;
}

// TODO: 실제 데이터는 Supabase에서 가져오도록 구현 필요
const mockInquiries: Inquiry[] = [];

export default function MyPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);

  const handleDelete = (id: string) => {
    setInquiries(inquiries.filter((inq) => inq.id !== id));
  };

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
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/products/${inquiry.productId}`}
                          className="font-semibold hover:text-accent"
                        >
                          Product {inquiry.productId}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          &middot;
                        </span>
                        <time className="text-sm text-muted-foreground">
                          {new Date(inquiry.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {inquiry.preview}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <Link href={`/products/${inquiry.productId}`}>
                          View Product
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete inquiry</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this inquiry? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(inquiry.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <Link href="/products">
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
