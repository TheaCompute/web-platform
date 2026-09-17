import Link from "next/link";
import { SparkleIcon, PlatformIcon, ShieldIcon } from "./icons";
import { EarnPreview } from "./stacking-previews/EarnPreview";
import { ChatPreview } from "./stacking-previews/ChatPreview";
import { JobsPreview } from "./stacking-previews/JobsPreview";
import type { ReactNode } from "react";
import type { StackingCard } from "@/types/content";

const CARDS: (Omit<StackingCard, "image"> & { iconSlot: ReactNode; previewSlot: ReactNode })[] = [
  {
    iconSlot: <SparkleIcon className="h-7 w-7 text-gold" />,
    title: "Put your idle GPU on the payroll.",
    body: "A single browser tab is enough to join: WebGPU does the work and there is nothing to install. Prefer more horsepower? The theacompute-node daemon hosts larger models and pays better per job. Every job you serve settles in USDG, and staking $THEA lifts your take to 85 percent of each job's value.",
    ctaLabel: "Share your GPU",
    ctaHref: "/app",
    previewSlot: <EarnPreview />,
  },
  {
    iconSlot: <PlatformIcon className="h-7 w-7 text-gold" />,
    title: "Ask the model, not a middleman.",
    body: "Encryption happens in your browser before a prompt goes anywhere, and the worker that serves you never learns who you are. Close the session and it is gone for good. Pick from open-weight models like Llama, Qwen, DeepSeek, Mistral, and Gemma, and get their answers straight, with no filter bolted on top.",
    ctaLabel: "Try it now",
    ctaHref: "/app",
    previewSlot: <ChatPreview />,
  },
  {
    iconSlot: <ShieldIcon className="h-7 w-7 text-gold" />,
    title: "Every job leaves a public receipt.",
    body: "Payment locks in escrow on Robinhood Chain before a single token is generated, and the moment a job verifies as complete, the worker gets paid automatically. Open Blockscout and audit any transaction yourself; nothing here asks you to take our word for it.",
    ctaLabel: "See it on-chain",
    ctaHref: "/app",
    previewSlot: <JobsPreview />,
  },
];

export function StackingCards() {
  return (
    <section
      id="features"
      className="py-12 lg:py-20"
      style={{ background: "var(--surface-dark)" }}
      aria-label="TheaCompute core capabilities"
    >
      <div className="mx-auto max-w-[1300px] px-6">
        <div className="space-y-6 lg:space-y-8">
          {CARDS.map((card, idx) => (
            <Card key={idx} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ card }: { card: Omit<StackingCard, "image"> & { iconSlot: ReactNode; previewSlot: ReactNode } }) {
  return (
    <article
      className="overflow-hidden rounded-[16px]"
      style={{
        background: "var(--surface-dark-2)",
        border: "1px solid oklch(1 0 0 / 0.08)",
        boxShadow: "0 1px 4px oklch(0 0 0 / 0.3)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="mb-4">{card.iconSlot}</div>
          <h3 className="mb-6 text-[28px] leading-[1.15] tracking-[-0.02em] text-white md:text-[34px] lg:text-[38px]">
            {card.title}
          </h3>
          <p className="mb-8 text-[16px] leading-[1.65] text-white/50 lg:text-[17px]">
            {card.body}
          </p>
          <div>
            <Link href={card.ctaHref} className="gl-btn-outline-light">
              {card.ctaLabel}
            </Link>
          </div>
        </div>

        <div
          className="relative flex aspect-[4/3] items-stretch justify-stretch overflow-hidden lg:aspect-auto lg:min-h-[491px]"
          style={{ background: "#111" }}
        >
          {card.previewSlot}
        </div>
      </div>
    </article>
  );
}
