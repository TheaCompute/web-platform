"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/context/CreditsContext";
import { Modal } from "@/components/app/Modal";
import { Panel, PanelHeader, PixelBtn, Spinner, inputCls, labelCls } from "@/components/app/ui";

const ESCROW_ADDRESS = "0xb2e17d4f8a9c035e6b7d21f4c8a90e3d5f16b8a4";

type CreditTransaction = {
  id: string;
  type: string;
  amount: number;
  usdg_value: number | null;
  description: string | null;
  created_at: string;
};

function Section({ tag, description, children }: { tag: string; description?: string; children: React.ReactNode }) {
  return (
    <Panel>
      <PanelHeader label={tag} />
      <div className="p-5">
        {description && <p className="mb-4 text-sm text-graphite">{description}</p>}
        {children}
      </div>
    </Panel>
  );
}

const API_KEYS = [
  { id: "key_live_a7k2", name: "Production", prefix: "thea_live_•••••••••••••••••••••••", created: "Jun 1, 2026", lastUsed: "14 sec ago" },
  { id: "key_test_b3m9", name: "Sandbox",    prefix: "thea_test_•••••••••••••••••••••••", created: "Jun 1, 2026", lastUsed: "3 days ago" },
];

const WEBHOOKS_DEFAULT = [
  { id: "wh_a1b2", url: "http://localhost:3000/theacompute/events", events: ["job.completed", "job.failed", "credit.low"], status: "active", lastDelivery: "14 sec ago" },
];

export default function SettingsPage() {
  const supabase = createClient();
  const { credits, totalPurchased, totalSpent, addCredits } = useCredits();

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [creditTxs, setCreditTxs] = useState<CreditTransaction[]>([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showNewKey, setShowNewKey] = useState(false);
  const [showNewWebhook, setShowNewWebhook] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpStep, setTopUpStep] = useState<"form" | "verifying" | "confirmed">("form");
  const [addressCopied, setAddressCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);
      setUserEmail(user.email ?? "");
      supabase.from("credit_transactions")
        .select("id, type, amount, usdg_value, description, created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(8)
        .then(({ data }) => setCreditTxs(data ?? []));
    });
  }, [supabase]);

  function copyAddress() {
    navigator.clipboard.writeText(ESCROW_ADDRESS);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  }

  async function handlePaymentMade() {
    setTopUpStep("verifying");
    await new Promise(r => setTimeout(r, 3500));
    const amount = Math.round(parseFloat(topUpAmount || "0") * 100);
    await addCredits(amount, parseFloat(topUpAmount || "0"));
    setTopUpStep("confirmed");
  }

  function closeTopUp() {
    setShowTopUp(false);
    setTopUpAmount("");
    setTopUpStep("form");
  }

  function txTypeLabel(type: string) {
    return { purchase: "Purchase", spend: "Spent", refund: "Refund", bonus: "Bonus" }[type] ?? type;
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-6 p-4 sm:p-6">

      {/* Account */}
      <Section tag="Your account" description="The basics I keep for your TheaCompute account.">
        <div className="space-y-4">
          {[
            { label: "Your email", value: userEmail || "-" },
            { label: "Your user ID", value: userId ?? "-" },
          ].map(row => (
            <div key={row.label}>
              <label className={labelCls}>{row.label}</label>
              <div className="flex items-center rounded-2xl border-[1.5px] border-line bg-cream px-3.5 py-2.5">
                <span className="flex-1 truncate font-mono text-xs text-graphite">{row.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Units */}
      <Section tag="Your units" description="I draw from this balance every time I run an inference job for you. Each unit is worth $0.01 in USDG.">
        <div className="mb-5 flex flex-col gap-4 rounded-3xl border-2 border-ink bg-pink p-5 shadow-[4px_4px_0_var(--ink)] min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
          <div>
            <p className="text-sm font-bold text-ink-2">Your unit balance</p>
            <p className="mt-2 font-display text-4xl font-extrabold leading-none text-ink">{credits.toLocaleString()}</p>
            <p className="mt-2 text-sm font-medium text-ink-2">That&apos;s ${(credits * 0.01).toFixed(2)} in USDG</p>
          </div>
          <PixelBtn variant="dark" onClick={() => setShowTopUp(true)}>
            Add more units
          </PixelBtn>
        </div>

        <dl className="mb-5 space-y-2">
          {[
            { label: "You've bought", value: `${totalPurchased.toLocaleString()} cr ($${(totalPurchased * 0.01).toFixed(2)})` },
            { label: "You've spent",     value: `${totalSpent.toLocaleString()} cr ($${(totalSpent * 0.01).toFixed(2)})` },
          ].map(row => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-graphite">{row.label}</dt>
              <dd className="text-right text-sm font-bold text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        {creditTxs.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold text-pebble">What&apos;s happened lately</p>
            <div className="divide-y-[1.5px] divide-line overflow-hidden rounded-2xl border-[1.5px] border-line">
              {creditTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-cream">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{tx.description ?? txTypeLabel(tx.type)}</p>
                    <p className="mt-0.5 text-xs text-pebble">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-bold ${tx.type === "spend" ? "text-graphite" : "text-berry"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} cr
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* API keys */}
      <Section tag="Your API keys" description="Your keys for talking to me through the OpenAI-compatible TheaCompute API.">
        <div className="mb-4 space-y-3">
          {API_KEYS.map((key) => (
            <div key={key.id} className="rounded-2xl border-[1.5px] border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{key.name}</span>
                    <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-xs font-bold text-berry">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 truncate rounded-2xl border-[1.5px] border-line bg-cream px-3 py-1.5 font-mono text-xs text-graphite">{key.prefix}</p>
                  <p className="mt-1.5 text-xs text-pebble">
                    You made it {key.created} · I last saw it {key.lastUsed}
                  </p>
                </div>
                <PixelBtn variant="danger" size="sm" className="shrink-0">Revoke key</PixelBtn>
              </div>
            </div>
          ))}
        </div>
        <PixelBtn variant="outline" size="sm" onClick={() => setShowNewKey(true)}>
          + Make a new key
        </PixelBtn>
      </Section>

      {/* Webhooks */}
      <Section tag="Your webhooks" description="I ping your endpoints whenever a job or balance event fires.">
        <div className="mb-4 space-y-3">
          {WEBHOOKS_DEFAULT.map((wh) => (
            <div key={wh.id} className="rounded-2xl border-[1.5px] border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs text-ink">{wh.url}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {wh.events.map((e) => (
                      <span key={e} className="rounded-full bg-peach px-2.5 py-0.5 font-mono text-[11px] text-ink-2">
                        {e}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-pebble">I last delivered {wh.lastDelivery}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <PixelBtn variant="outline" size="sm">Edit</PixelBtn>
                  <PixelBtn variant="danger" size="sm">Remove</PixelBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
        <PixelBtn variant="outline" size="sm" onClick={() => setShowNewWebhook(true)}>
          + Add an endpoint
        </PixelBtn>
      </Section>

      {/* Beta */}
      <Section tag="The open beta" description="Here's where you stand while I'm in beta.">
        <div className="flex items-start justify-between gap-3 rounded-2xl bg-pink-soft px-5 py-4">
          <div>
            <p className="text-sm font-bold text-ink">You&apos;re in my beta</p>
            <p className="mt-1 text-sm text-ink-2">
              I put a <span className="font-bold text-berry">2x $THEA multiplier</span> on provider earnings, and I&apos;m waiving platform fees until the beta ends.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">
            Beta
          </span>
        </div>
      </Section>

      {/* Danger zone */}
      <Section tag="The danger zone">
        <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-danger bg-danger-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-ink">Delete your account</p>
            <p className="text-sm text-graphite">If you do this, I erase your account for good. There&apos;s no undo, and any units you haven&apos;t used are forfeited.</p>
          </div>
          <PixelBtn variant="danger" size="sm" className="shrink-0 self-start sm:self-auto">Delete account</PixelBtn>
        </div>
      </Section>

      {/* Top-up modal */}
      <Modal open={showTopUp} onClose={closeTopUp} className="max-w-[440px]">
        <div className="flex items-center justify-between border-b-[1.5px] border-line px-6 py-4">
          <div>
            <p className="font-display text-lg font-bold text-ink">Top up your units</p>
            <p className="mt-0.5 text-sm text-graphite">Send me USDG on Robinhood Chain and I&apos;ll turn it into units</p>
          </div>
          {topUpStep !== "verifying" && (
            <button onClick={closeTopUp} aria-label="Close" className="rounded-full p-1.5 text-graphite transition-colors hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {topUpStep === "form" && (
          <div className="space-y-5 p-6">
            <div className="space-y-2.5 rounded-2xl bg-peach p-4">
              {[
                { step: "1", text: "Tell me how much USDG to convert. Every 1 USDG gets you 100 units." },
                { step: "2", text: "Send me exactly that amount on Robinhood Chain, to the escrow address below." },
                { step: "3", text: "Tap \"I've sent my USDG\" and I'll confirm the transfer on-chain." },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-cream">{s.step}</span>
                  <p className="text-sm leading-snug text-ink-2">{s.text}</p>
                </div>
              ))}
            </div>

            <div>
              <label className={labelCls}>How much USDG?</label>
              <div className="flex items-center rounded-[14px] border-2 border-line bg-paper transition-[border-color,box-shadow] focus-within:border-ink focus-within:shadow-[3px_3px_0_var(--pink)]">
                <span className="pl-3.5 text-[15px] font-bold text-pebble">$</span>
                <input
                  type="number" min="0" step="0.01" placeholder="0.00" value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[15px] text-ink outline-none placeholder:text-pebble"
                />
                <span className="pr-3.5 text-xs font-bold text-pebble">USDG</span>
              </div>
              {topUpAmount && parseFloat(topUpAmount) > 0 && (
                <p className="mt-1.5 text-sm font-bold text-berry">
                  = {Math.round(parseFloat(topUpAmount) * 100).toLocaleString()} units
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {["5", "10", "25", "50"].map(amt => (
                  <button
                    key={amt} type="button" onClick={() => setTopUpAmount(amt)}
                    className={`rounded-full border-[1.5px] px-3 py-0.5 text-xs font-bold transition-colors ${
                      topUpAmount === amt ? "border-ink bg-pink text-ink" : "border-line bg-paper text-graphite hover:border-ink hover:bg-cream hover:text-ink"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-sm font-bold text-ink">My escrow address</label>
                <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-xs font-bold text-berry">
                  Robinhood Chain
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border-[1.5px] border-line bg-cream px-3.5 py-2.5">
                <span className="flex-1 truncate font-mono text-xs text-ink-2">{ESCROW_ADDRESS}</span>
                <button
                  type="button" onClick={copyAddress}
                  className="shrink-0 rounded-full border-[1.5px] border-ink bg-paper px-2.5 py-0.5 text-xs font-bold text-ink transition-colors hover:bg-pink"
                >
                  {addressCopied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-graphite">
                I only accept <span className="font-bold text-ink">USDG</span> on{" "}
                <span className="font-bold text-ink">Robinhood Chain</span> at this address. Nothing else.
              </p>
            </div>

            <PixelBtn
              type="button" onClick={handlePaymentMade}
              disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              className="w-full"
            >
              I&apos;ve sent my USDG
            </PixelBtn>
          </div>
        )}

        {topUpStep === "verifying" && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <p className="font-display text-xl font-extrabold text-ink">Checking the chain for you</p>
            <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-graphite">
              I&apos;m watching Robinhood Chain for your transfer of{" "}
              <span className="font-bold text-ink">${parseFloat(topUpAmount || "0").toFixed(2)} USDG</span>{" "}
              to my escrow wallet.
            </p>
            <div className="mt-6 rounded-full bg-cream px-4 py-2">
              <Spinner label="Scanning Robinhood Chain" />
            </div>
          </div>
        )}

        {topUpStep === "confirmed" && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-pink shadow-[3px_3px_0_var(--ink)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-ink">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-display text-xl font-extrabold text-ink">All set, you&apos;re topped up!</p>
            <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-graphite">
              I just dropped{" "}
              <span className="font-bold text-berry">
                {Math.round(parseFloat(topUpAmount || "0") * 100).toLocaleString()} units
              </span>{" "}
              into your account.
            </p>
            <PixelBtn type="button" onClick={closeTopUp} className="mt-8 px-8">
              Done
            </PixelBtn>
          </div>
        )}
      </Modal>

      {/* New API key modal */}
      <Modal open={showNewKey} onClose={() => setShowNewKey(false)} className="max-w-[400px] p-6">
        <p className="mb-4 font-display text-lg font-bold text-ink">Here&apos;s your new API key</p>
        <div className="mb-4 break-all rounded-2xl border-[1.5px] border-line bg-cream p-4 font-mono text-xs text-ink-2">
          thea_live_xK9mR3QrLs2nBvTkWj4hYe...
        </div>
        <p className="mb-4 text-sm text-graphite">Copy it now. This is the only time I&apos;ll show it to you.</p>
        <div className="flex gap-2">
          <PixelBtn variant="outline" className="flex-1">Copy key</PixelBtn>
          <PixelBtn onClick={() => setShowNewKey(false)} className="flex-1">Done</PixelBtn>
        </div>
      </Modal>

      {/* Add webhook modal */}
      <Modal open={showNewWebhook} onClose={() => setShowNewWebhook(false)} className="max-w-[440px]">
        <div className="flex items-center justify-between border-b-[1.5px] border-line px-6 py-4">
          <p className="font-display text-lg font-bold text-ink">Add a webhook endpoint</p>
          <button onClick={() => setShowNewWebhook(false)} aria-label="Close" className="rounded-full p-1.5 text-graphite transition-colors hover:bg-cream hover:text-ink">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className={labelCls}>Your endpoint URL</label>
            <input placeholder="https://your-server.com/theacompute-events" className={`${inputCls} font-mono text-[13px]`} />
          </div>
          <div>
            <label className={labelCls}>Events I&apos;ll send</label>
            <div className="space-y-2">
              {["job.completed", "job.failed", "job.disputed", "credit.low", "credit.purchase", "provider.online", "provider.slashed"].map(e => (
                <label key={e} className="flex cursor-pointer items-center gap-2.5">
                  <input type="checkbox" defaultChecked={e.startsWith("job")} className="h-4 w-4 accent-[var(--pink-deep)]" />
                  <span className="font-mono text-xs text-ink-2">{e}</span>
                </label>
              ))}
            </div>
          </div>
          <PixelBtn onClick={() => setShowNewWebhook(false)} className="w-full">
            Add this endpoint
          </PixelBtn>
        </div>
      </Modal>
    </div>
  );
}
