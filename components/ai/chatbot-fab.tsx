"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Floating Action Button (FAB) for quick access to AI Chat
 * Can be added to product pages, homepage, or other key pages
 */
export function ChatbotFAB() {
  return (
    <Link href="/ai-test" className="fixed bottom-6 right-6 z-40">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        title="AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open AI Chat</span>
      </Button>
    </Link>
  );
}
