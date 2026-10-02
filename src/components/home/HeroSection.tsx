import Image from "next/image";
import { ButtonLink, Eyebrow, PixelHeart, Sparkle } from "./ui";

const stats = [
  { label: "GPUs on my team", value: "79", note: "across 13 countries", pos: "left-0 top-[15%] -rotate-6", bg: "bg-paper" },
  { label: "jobs I've settled", value: "213", note: "every one on-chain", pos: "right-0 top-[11%] rotate-3", bg: "bg-pink-soft" },
  { label: "to my first word", value: "119ms", note: "median wait", pos: "left-[2%] bottom-[10%] rotate-3", bg: "bg-peach-deep" },
  { label: "I've paid out", value: "$639", note: "all in USDG", pos: "right-[1%] bottom-[4%] -rotate-3", bg: "bg-paper" },
];

const TOKEN_ADDRESS = "";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="dot-paper absolute inset-0 opacity-60" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-20 pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-44">
        <div>
          <Eyebrow>
            <PixelHeart className="h-3 w-3.5" />
            $THEA: 0xd305874bb46d8ec5a29cbea757f0172cc698b686
          </Eyebrow>

          <p className="mt-7 font-display text-2xl font-bold text-berry">Hi, I&apos;m Thea.</p>
          <h1 className="mt-2 text-balance font-display text-[44px] font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-[68px]">
            I run AI for you. No gatekeepers, all{" "}
            <span className="relative inline-block">
              <span className="relative z-10">receipts.</span>
              <span
                aria-hidden
                className="absolute inset-x-[-4px] bottom-[0.08em] z-0 h-[0.38em] -rotate-1 rounded-md bg-pink"
              />
            </span>
          </h1>

          <p className="mt-7 max-w-[540px] text-lg font-medium leading-8 text-graphite">
            Right now a few companies stand between you and every model. They
            filter your questions, log your answers, and charge whatever they
            like. I skip them entirely. I run open-weight models on thousands of
            independent GPUs, you pay me per job from any Ethereum wallet, and I
            write every settlement to Robinhood Chain where anyone can look it up.
          </p>

          <p className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-ink">
            {["Skip the account", "I keep no logs", "I never filter you"].map((t) => (
              <span key={t} className="rounded-full border-[1.5px] border-ink bg-paper px-3 py-1">
                {t}
              </span>
            ))}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/app/chat" size="lg">Chat with me</ButtonLink>
            <ButtonLink href="/app/earn" variant="secondary" size="lg">
              Lend me your GPU
            </ButtonLink>
          </div>
        </div>

        {/* Thea, surrounded by live network stickers */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-[12%] rounded-full border-2 border-ink bg-peach-deep shadow-[8px_8px_0_var(--ink)]" />
          <div className="absolute inset-[12%] overflow-hidden rounded-full">
            <Image
              src="/images/logo-transparent.png"
              alt="Thea, the pixel-art girl who runs TheaCompute"
              width={640}
              height={640}
              priority
              className="bob-slow absolute left-1/2 top-[13%] w-[96%] max-w-none -translate-x-1/2"
            />
          </div>

          <div className="bob absolute left-[27%] top-0 rounded-2xl rounded-bl-sm border-2 border-ink bg-paper px-4 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_var(--ink)] [--tilt:-3deg]">
            psst, I never keep logs
          </div>

          {stats.map((s) => (
            <div
              key={s.label}
              className={`absolute ${s.pos} ${s.bg} w-[124px] rounded-2xl border-2 border-ink px-3 py-2 shadow-[4px_4px_0_var(--ink)] sm:w-[170px] sm:px-4 sm:py-3`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-graphite sm:text-[11px]">{s.label}</p>
              <p className="font-display text-2xl font-extrabold leading-tight text-ink sm:text-3xl">{s.value}</p>
              <p className="text-xs font-medium text-graphite">{s.note}</p>
            </div>
          ))}

          <Sparkle className="twinkle absolute left-[8%] top-[52%] h-6 w-6" />
          <Sparkle className="twinkle absolute right-[14%] top-[42%] h-4 w-4 [animation-delay:0.8s]" color="var(--clay)" />
          <Sparkle className="twinkle absolute bottom-[24%] left-[44%] h-5 w-5 [animation-delay:1.4s]" color="var(--ink)" />
        </div>
      </div>
    </section>
  );
}
