import type { ComponentType } from "react";
import { KeyIcon, LockIcon, NoLogsIcon, WalletIcon } from "./icons";
import { Eyebrow } from "./ui";

const privacyFeatures: {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
  tint: string;
}[] = [
  {
    Icon: LockIcon,
    title: "I lock it before it leaves",
    text: "I encrypt your prompt with AES-256-GCM before it leaves your browser. Nobody on my network can read it. Not even me.",
    tint: "bg-pink",
  },
  {
    Icon: KeyIcon,
    title: "A fresh key every time",
    text: "I give every job its own one-time session key, and workers only decrypt it in memory while inference is running.",
    tint: "bg-peach-deep",
  },
  {
    Icon: NoLogsIcon,
    title: "I never write it down",
    text: "Nobody on my network writes logs to persistent storage: not the workers, not the orchestrators, not the protocol itself.",
    tint: "bg-peach",
  },
  {
    Icon: WalletIcon,
    title: "You're just a wallet to me",
    text: "My network only ever sees your wallet address. It never asks for an email, a phone number, or KYC.",
    tint: "bg-pink-soft",
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-28 border-y-2 border-ink bg-peach">
      <div className="mx-auto max-w-6xl px-5 py-24 lg:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="bg-paper">Private by design</Eyebrow>
            <h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              How I keep your secrets
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-ink-2">
            Most apps treat privacy as a toggle. I built it into how I work,
            because a toggle can vanish in the next terms update and my
            architecture can&apos;t.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2">
          {privacyFeatures.map((f, i) => (
            <div key={f.title} className={`sticker sticker-hover flex gap-5 p-7`}>
              <div className={`${f.tint} flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-ink`}>
                <f.Icon className="h-9 w-9 text-ink" />
              </div>
              <div>
                <p className="text-xs font-bold text-pebble">Promise {i + 1}</p>
                <h3 className="mt-1 font-display text-xl font-extrabold text-ink">{f.title}</h3>
                <p className="mt-2 text-base leading-7 text-graphite">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
