import Link from "next/link";
import { PixelHeart, Sparkle } from "./ui";

export function StakingSection() {
  return (
    <section className="px-5 py-24 lg:py-32">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border-2 border-ink bg-pink px-8 py-12 shadow-[8px_8px_0_var(--ink)] md:px-14 md:py-16">
        <Sparkle className="twinkle absolute right-10 top-8 h-8 w-8" color="var(--ink)" />
        <Sparkle className="twinkle absolute bottom-10 right-40 h-5 w-5 [animation-delay:1s]" color="var(--paper)" />
        <PixelHeart className="bob absolute bottom-8 right-12 hidden h-12 w-14 md:block" color="var(--paper)" />

        <div className="relative max-w-3xl">
          <span className="eyebrow bg-paper">Stake with me</span>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Stake $THEA and share in every job I settle
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink">
            I pay half of my protocol fees to stakers in USDG. With the other
            half I buy back and burn $THEA every week, and I publish the
            transaction as proof. No GPU needed: lock your stake for 30, 90, or
            180 days and earn up to a 1.5x multiplier.
          </p>
          <Link href="/app/earn" className="btn btn-dark btn-lg mt-9">
            Lock in a stake
          </Link>
        </div>
      </div>
    </section>
  );
}
