export function BuiltForHowYouWork() {
  return (
    <section
      className="py-16 lg:py-24"
      style={{ background: "var(--surface-dark)" }}
      aria-labelledby="built-for-how-heading"
    >
      <div className="mx-auto max-w-[1168px] px-6">
        <h2
          id="built-for-how-heading"
          className="max-w-[1000px] text-[44px] leading-[1.04] tracking-[-0.025em] text-white sm:text-[64px] md:text-[88px] lg:text-[112px] lg:leading-[112px] lg:tracking-[-3.36px]"
        >
          Supply the compute. Or spend it.
        </h2>
        <p className="mt-6 max-w-[600px] text-[18px] leading-[1.65] text-white/50 md:text-[22px]">
          TheaCompute is a market with two doors. Through one, GPU owners plug into the network and collect USDG for every job they serve. Through the other, anyone with a wallet queries open-weight models: no account to create, no prompt ever stored, no policy layer deciding which questions are acceptable. Both doors lead to the same place, and everything that happens inside settles on Robinhood Chain.
        </p>
      </div>
    </section>
  );
}
