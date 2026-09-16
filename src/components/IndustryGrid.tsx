import {
  IndustryFinancialIcon,
  IndustryPublicSectorIcon,
  IndustryTelecomIcon,
  IndustryAutomotiveIcon,
  IndustryEducationIcon,
  IndustryAerospaceIcon,
} from "./icons";
import type { ReactNode } from "react";

type Item = {
  icon: ReactNode;
  title: string;
  body: string;
};

const ITEMS: Item[] = [
  {
    icon: <IndustryFinancialIcon className="h-7 w-7 text-gold" />,
    title: "Anyone with a GPU",
    body: "The card in your gaming rig sits idle most of the day. Open a browser tab and WebGPU puts it to work for USDG, or install the theacompute-node daemon to host bigger models and take home more per job. No data center required, ever.",
  },
  {
    icon: <IndustryPublicSectorIcon className="h-7 w-7 text-gold" />,
    title: "Developers",
    body: "Swap one base URL and your OpenAI client is talking to TheaCompute. Same request shape, open-weight models behind it, billing you can verify on-chain, and nobody upstream deciding what your app is allowed to ask.",
  },
  {
    icon: <IndustryTelecomIcon className="h-7 w-7 text-gold" />,
    title: "Privacy-minded users",
    body: "Prompts are encrypted on your device before they go anywhere, and nothing sticks around after the session ends. A wallet is the only thing you need: no signup, no email, and gas is sponsored, so you never touch ETH.",
  },
  {
    icon: <IndustryAutomotiveIcon className="h-7 w-7 text-gold" />,
    title: "Researchers",
    body: "Red-team models, probe failure modes, and build datasets without a refusal wall in the way. Open weights from Llama to DeepSeek, served raw, on infrastructure that stays neutral about what you study.",
  },
  {
    icon: <IndustryEducationIcon className="h-7 w-7 text-gold" />,
    title: "Writers and creators",
    body: "Work through rough drafts and half-formed ideas knowing none of it feeds someone else's training run. Sessions vanish the moment you close them, so what you typed stays yours alone.",
  },
  {
    icon: <IndustryAerospaceIcon className="h-7 w-7 text-gold" />,
    title: "Production teams",
    body: "Attach an API key to an Ethereum wallet, fund it with USDG, and ship. Each request lands as a transaction on Robinhood Chain, so finance can audit the spend line by line from any explorer.",
  },
];

export function IndustryGrid() {
  return (
    <section
      id="use-cases"
      className="py-16 lg:py-24"
      style={{ background: "var(--surface-dark)" }}
      aria-labelledby="industry-heading"
    >
      <div className="mx-auto max-w-[1168px] px-6">
        <h2
          id="industry-heading"
          className="max-w-[820px] text-[44px] leading-[1.04] tracking-[-0.025em] text-white sm:text-[64px] md:text-[80px] lg:text-[96px] lg:leading-[100px] lg:tracking-[-2.88px]"
        >
          Built for both sides of the GPU.
        </h2>
        <p className="mt-6 max-w-[640px] text-[18px] leading-[1.6] text-white/50 md:text-[20px]">
          Some people bring hardware, others bring questions. Providers collect USDG for the jobs they serve, users get open models with real privacy, and Robinhood Chain keeps the books for everyone.
        </p>

        <ul className="my-12 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:my-16 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <li key={item.title}>
              <div className="flex flex-col gap-4">
                <div>{item.icon}</div>
                <p className="text-[18px] font-[500] text-white">{item.title}</p>
                <p className="text-[16px] leading-[1.6] text-white/50">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
