import type { ComponentType } from "react";
import { ApiSpot, ChatSpot, GpuSpot } from "./icons";
import { Eyebrow, Sparkle } from "./ui";

interface FeatureCard {
  Spot: ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  description: string;
  note?: string;
  tint: string;
  wide?: boolean;
}

const features: FeatureCard[] = [
  {
    Spot: ChatSpot,
    tag: "Chat",
    title: "Talk to me, leave no trace",
    description:
      "Ask me anything and I'll pass it to open models like Llama, Qwen, and DeepSeek. I encrypt your prompt before it leaves your browser, I forget the session when you close the tab, and nobody on my network can read a word. Not even me.",
    note: "Nothing to sign up for, nothing logged, nothing filtered.",
    tint: "bg-pink-soft",
    wide: true,
  },
  {
    Spot: GpuSpot,
    tag: "Earn",
    title: "Give your GPU a side hustle",
    description:
      "Join me from a browser tab or run my native node. I'll send you inference jobs and drop USDG into your wallet the moment each one settles, and every payout is a transaction you can look up yourself.",
    tint: "bg-peach-deep",
  },
  {
    Spot: ApiSpot,
    tag: "Build",
    title: "Swap one line, keep the rest",
    description:
      "I speak the OpenAI API fluently. Point your client at api.theacompute.com and ship with the same request shapes and the same streaming, and I'll staple a settlement receipt to every completion.",
    tint: "bg-peach",
  },
];

export function FeaturesSection() {
  return (
    <section id="network" className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-32">
        <div className="text-center">
          <Eyebrow>Three ways in</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
            My network has three front doors.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className={`sticker sticker-hover flex overflow-hidden ${
                f.wide ? "flex-col md:col-span-2 md:flex-row" : "flex-col"
              }`}
            >
              <div
                className={`${f.tint} relative flex items-center justify-center border-ink ${
                  f.wide ? "h-52 border-b-2 md:h-auto md:w-[38%] md:border-b-0 md:border-r-2" : "h-44 border-b-2"
                }`}
              >
                <f.Spot className={f.wide ? "h-32 w-32 text-ink md:h-40 md:w-40" : "h-28 w-28 text-ink"} />
                <Sparkle className="twinkle absolute right-6 top-6 h-5 w-5" color="var(--ink)" />
              </div>
              <div className={`flex-1 p-8 ${f.wide ? "md:p-10" : ""}`}>
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">{f.tag}</span>
                <h3 className="mt-5 font-display text-2xl font-extrabold text-ink md:text-3xl">{f.title}</h3>
                <p className="mt-4 text-base leading-7 text-graphite">{f.description}</p>
                {f.note && (
                  <p className="mt-5 inline-flex rounded-full bg-pink-soft px-3 py-1 text-sm font-bold text-berry">
                    {f.note}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
