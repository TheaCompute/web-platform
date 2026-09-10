import { ButtonLink, Eyebrow } from "./ui";

const tiers = [
  { tier: "Lite", models: "1B-3B quantized", units: 2, usd: "$0.02", chip: "bg-paper" },
  { tier: "Standard", models: "7B-8B", units: 8, usd: "$0.08", chip: "bg-peach" },
  { tier: "Pro", models: "13B-27B", units: 18, usd: "$0.18", chip: "bg-peach-deep" },
  { tier: "Max", models: "70B and bigger", units: 40, usd: "$0.40", chip: "bg-pink" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-28 border-y-2 border-ink bg-peach">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
        <div>
          <Eyebrow className="bg-paper">What I charge</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
            My jobs start at just 2&nbsp;units
          </h2>
          <p className="mt-6 text-lg leading-8 text-ink-2">
            One unit is $0.01, paid in USDG. Your units never expire, I
            don&apos;t do subscriptions, and I bill long streaming replies per
            1,000 output tokens.
          </p>
          <p className="mt-4 text-base leading-7 text-graphite">
            I hand 75% of every job to the worker who ran it, or 85% if they
            stake, and the rest goes to the treasury. Please don&apos;t just
            trust me on that: every split settles publicly on Robinhood Chain.
          </p>
          <div className="mt-9">
            <ButtonLink href="/app/settings" size="lg">Get more units</ButtonLink>
          </div>
        </div>

        <div className="sticker overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-6 py-4">
            <span className="font-display text-lg font-bold text-cream">My rate card</span>
            <span className="rounded-full bg-pink px-3 py-1 text-xs font-bold text-ink">1 unit is $0.01</span>
          </div>
          <ul>
            {tiers.map((row) => (
              <li
                key={row.tier}
                className="flex items-center gap-4 border-b-2 border-dashed border-line px-6 py-5 last:border-b-0"
              >
                <span className={`${row.chip} w-24 shrink-0 rounded-full border-2 border-ink py-1 text-center text-sm font-bold text-ink`}>
                  {row.tier}
                </span>
                <span className="flex-1 text-sm font-medium text-graphite">{row.models}</span>
                <span className="text-right">
                  <span className="font-display text-3xl font-extrabold text-ink">{row.units}</span>
                  <span className="ml-1 text-sm font-bold text-graphite">units</span>
                  <span className="block text-xs font-medium text-pebble">{row.usd} per job</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
