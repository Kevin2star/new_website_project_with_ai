import { HeroSection } from "@/components/posts/hero-section";
import { HowItWorksSection } from "@/components/posts/how-it-works-section";
import { ProductCategoriesSection } from "@/components/posts/product-categories-section";
import { CTASection } from "@/components/posts/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <ProductCategoriesSection />
      <CTASection />
    </>
  );
}
