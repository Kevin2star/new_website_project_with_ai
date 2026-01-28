"use client";

import React from "react"

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getProductById } from "@/lib/products";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send, Bot, User, Loader2 } from "lucide-react";

export function InquiryForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const product = productId ? getProductById(productId) : null;

  const [inquiry, setInquiry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.trim()) return;

    setIsSubmitting(true);
    setSubmittedInquiry(inquiry);

    // Simulate AI response (in production, this would call an API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockAiResponse = generateMockResponse(inquiry, product?.name);
    setAiResponse(mockAiResponse);
    setIsSubmitting(false);
  };

  const handleNewInquiry = () => {
    setInquiry("");
    setSubmittedInquiry(null);
    setAiResponse(null);
  };

  return (
    <div>
      {/* Product Context */}
      {product && (
        <div className="mb-8 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inquiring about</p>
              <p className="font-semibold">{product.name}</p>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="text-sm text-accent hover:underline"
            >
              View product
            </Link>
          </div>
        </div>
      )}

      {!product && (
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Select a product first
          </Link>
        </div>
      )}

      {/* Inquiry Form or Response */}
      {!submittedInquiry ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="inquiry"
              className="mb-2 block text-sm font-medium"
            >
              Your Inquiry
            </label>
            <Textarea
              id="inquiry"
              placeholder="Describe your usage scenario, technical requirements, or questions about this product. For example: 'We need carbon blocks for a high-temperature furnace application. What are the recommended specifications for temperatures up to 2500°C?'"
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              className="min-h-40 resize-none"
              required
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Be specific about your application, quantity needs, or technical
              questions for the best assistance.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!inquiry.trim() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Inquiry
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* User Inquiry */}
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-medium">Your Inquiry</span>
            </div>
            <div className="p-4">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {submittedInquiry}
              </p>
            </div>
          </div>

          {/* AI Response */}
          <div
            className={cn(
              "rounded-lg border bg-accent/5",
              aiResponse ? "border-accent/20" : "border-border"
            )}
          >
            <div className="flex items-center gap-3 border-b border-accent/20 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <Bot className="h-4 w-4 text-accent" />
              </div>
              <span className="font-medium">AI Assistant</span>
            </div>
            <div className="p-4">
              {isSubmitting ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing your inquiry...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-wrap">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleNewInquiry} variant="outline">
              Submit Another Inquiry
            </Button>
            <Button asChild>
              <Link href="/my-page">View My Inquiries</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function generateMockResponse(
  inquiry: string,
  productName?: string
): string {
  const productContext = productName
    ? `Based on your inquiry about the ${productName}, `
    : "Based on your inquiry, ";

  const responses = [
    `${productContext}I can help you with the following information:\n\n1. **Product Suitability**: The specifications you've described align well with our standard product offerings. For high-temperature applications, we recommend reviewing the thermal conductivity and maximum operating temperature specifications.\n\n2. **Customization Options**: If standard specifications don't fully meet your requirements, we offer custom manufacturing options. Our engineering team can work with you to develop specifications tailored to your application.\n\n3. **Next Steps**: Our sales team will review your inquiry and contact you within 1-2 business days with a detailed proposal. In the meantime, feel free to submit additional questions or specify any other requirements.`,

    `${productContext}here's my analysis:\n\n**Technical Assessment**:\nYour application requirements are within the typical operating parameters for this product category. The key factors to consider are:\n- Operating temperature range\n- Chemical environment exposure\n- Mechanical stress conditions\n\n**Recommendations**:\nI suggest starting with our standard grade for initial testing. Our technical team can provide samples for evaluation before committing to larger quantities.\n\n**Quote Process**:\nA detailed quotation will be prepared by our sales team within 48 hours. They will include pricing, lead times, and available customization options.`,

    `${productContext}I've analyzed your requirements:\n\n**Compatibility Check**:\n✓ Temperature requirements - Compatible\n✓ Application type - Suitable\n✓ Industry standards - Met\n\n**Additional Information**:\nFor your specific use case, you may want to consider the enhanced thermal shock resistance of our premium grades. This can significantly extend product life in cycling temperature applications.\n\n**Follow-up**:\nOur product specialists will reach out to discuss your specific needs in detail. They can also arrange technical consultations if needed for complex applications.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
