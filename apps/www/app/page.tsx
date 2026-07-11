import { HeroSection, FeatureSection, OutputShowcase, PricingPreview, FAQSection, CTASection } from "@ai-copy/ui";
import { MOCK_FEATURES, MOCK_OUTPUT_EXAMPLE, MOCK_PLANS, MOCK_FAQS } from "@ai-copy/shared";

export default function HomePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  return (
    <>
      <HeroSection appUrl={appUrl} />
      <FeatureSection features={MOCK_FEATURES} />
      <OutputShowcase content={MOCK_OUTPUT_EXAMPLE} />
      <PricingPreview plans={MOCK_PLANS} />
      <FAQSection items={MOCK_FAQS} />
      <CTASection appUrl={appUrl} />
    </>
  );
}
