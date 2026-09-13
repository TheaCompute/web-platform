import { Sparkle } from "./ui";

const items = [
  "I run Llama 3.3 70B for 40 units",
  "Qwen3 8B costs 8 units",
  "DeepSeek R1 is 18 units",
  "Mistral 7B is 8 units",
  "my blocks land every 100ms",
  "my fees stay under a cent",
  "logs I keep: zero",
  "75-85% of each job goes to GPU owners",
  "I buy back and burn every week, on-chain",
];

function TickerHalf({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {items.map((item) => (
        <span key={item} className="flex items-center whitespace-nowrap font-display text-lg font-bold text-cream">
          <span className="px-6">{item}</span>
          <Sparkle className="h-3.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}

export function TickerBar() {
  return (
    <div className="relative z-10 -mx-4 -rotate-[1.5deg] overflow-hidden border-y-2 border-ink bg-ink py-4">
      <div className="marquee-track">
        <TickerHalf />
        <TickerHalf ariaHidden />
      </div>
    </div>
  );
}
