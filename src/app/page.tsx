import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { TickerBar } from "@/components/home/TickerBar";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { NodeSection } from "@/components/home/NodeSection";
import { ExplorerSection } from "@/components/home/ExplorerSection";
import { PrivacySection } from "@/components/home/PrivacySection";
import { StakingSection } from "@/components/home/StakingSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-ink">
      <Navbar />
      <main>
        <HeroSection />
        <TickerBar />
        <FeaturesSection />
        <PricingSection />
        <NodeSection />
        <ExplorerSection />
        <PrivacySection />
        <StakingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
