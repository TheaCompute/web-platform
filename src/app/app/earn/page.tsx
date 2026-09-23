"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ErrorNote, Panel, PanelHeader, PixelBtn, Spinner, StatusChip, TierChip, inputCls, labelCls } from "@/components/app/ui";

type Model = {
  slug: string;
  name: string;
  tier: string;
  credits_per_request: number;
};

type Provider = {
  id: string;
  display_name: string;
  tier: string;
  gpu_model: string | null;
  vram_gb: number | null;
  status: string;
  reputation_score: number;
  total_jobs_completed: number;
  total_earned_usdg: number;
  thea_staked: number;
  uptime_pct: number;
  hosted_models: string[];
  payout_wallet: string | null;
  created_at: string;
};

type RecentJob = {
  id: string;
  model_name: string;
  status: string;
  output_tokens: number;
  provider_payout: number;
  created_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

const REPUTATION_TIERS = [
  { min: 800, label: "Elite",       cls: "bg-pink" },
  { min: 600, label: "Trusted",     cls: "bg-peach-deep" },
  { min: 400, label: "Established", cls: "bg-peach" },
  { min: 0,   label: "New",         cls: "bg-paper" },
];

function repTier(score: number) {
  return REPUTATION_TIERS.find(t => score >= t.min) ?? REPUTATION_TIERS[REPUTATION_TIERS.length - 1];
}

export default function EarnPage() {
  const supabase = createClient();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const [form, setForm] = useState({
    display_name: "",
    tier: "browser" as "browser" | "native",
    gpu_model: "",
    vram_gb: "",
    hosted_models: [] as string[],
    payout_wallet: "",
  });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const [providerRes, modelsRes] = await Promise.all([
      supabase.from("providers")
        .select("id, display_name, tier, gpu_model, vram_gb, status, reputation_score, total_jobs_completed, total_earned_usdg, thea_staked, uptime_pct, hosted_models, payout_wallet, created_at")
        .eq("user_id", user.id).single(),
      supabase.from("models").select("slug, name, tier, credits_per_request")
        .eq("is_active", true).order("credits_per_request"),
    ]);

    setProvider(providerRes.data ?? null);
    setModels(modelsRes.data ?? []);

    if (providerRes.data) {
      const jobsRes = await supabase.from("jobs")
        .select("id, model_name, status, output_tokens, provider_payout, created_at")
        .eq("provider_id", providerRes.data.id)
        .order("created_at", { ascending: false }).limit(5);
      setRecentJobs(jobsRes.data ?? []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  function toggleModel(slug: string) {
    setForm(prev => ({
      ...prev,
      hosted_models: prev.hosted_models.includes(slug)
        ? prev.hosted_models.filter(s => s !== slug)
        : [...prev.hosted_models, slug],
    }));
  }

  async function register() {
    if (!userId) return;
    if (!form.display_name.trim()) { setRegistrationError("Give your rig a name so I know what to call it."); return; }
    if (form.hosted_models.length === 0) { setRegistrationError("Pick at least one model for me to send your way."); return; }
    setSaving(true);
    setRegistrationError(null);
    const { error } = await supabase.from("providers").insert({
      user_id: userId, display_name: form.display_name.trim(), tier: form.tier,
      gpu_model: form.gpu_model.trim() || null, vram_gb: form.vram_gb ? parseInt(form.vram_gb) : null,
      hosted_models: form.hosted_models, payout_wallet: form.payout_wallet.trim() || null, status: "offline",
    });
    if (error) { setRegistrationError(error.message); } else { await load(); }
    setSaving(false);
  }

  async function toggleStatus() {
    if (!provider || toggling) return;
    setToggling(true);
    const newStatus = provider.status === "online" ? "offline" : "online";
    const { error } = await supabase.from("providers")
      .update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", provider.id);
    if (!error) setProvider(prev => prev ? { ...prev, status: newStatus } : null);
    setToggling(false);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Checking on your rig" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-[680px] space-y-6 p-4 sm:p-6">
        <div>
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">Earn with me</span>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-ink">Lend me your GPU</h1>
          <p className="mt-3 text-sm leading-6 text-graphite">
            Whenever your GPU is online, I pay it in USDG. Pick a browser worker and I&apos;ll run in a tab
            with zero setup, or pick a native worker: you run my small daemon and bring home more per job.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["browser", "native"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setForm(p => ({ ...p, tier: t }))}
              className={`rounded-3xl p-5 text-left transition-colors ${
                form.tier === t
                  ? "border-2 border-ink bg-pink-soft shadow-[4px_4px_0_var(--ink)]"
                  : "border-[1.5px] border-line bg-paper hover:bg-cream"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-display text-base font-bold capitalize text-ink">{t} worker</span>
                <span
                  aria-hidden
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    form.tier === t ? "border-ink bg-pink" : "border-line bg-paper"
                  }`}
                >
                  {form.tier === t && <span className="h-2 w-2 rounded-full bg-ink" />}
                </span>
              </div>
              <p className="text-sm leading-6 text-graphite">
                {t === "browser"
                  ? "I run on WebGPU in an open tab, so there's nothing to install. I'll send it models from 1B to 8B. Payouts are smaller."
                  : "You run my theacompute-node daemon and I'll send it every model size. Staking is required. Payouts are bigger."}
              </p>
              <p className="mt-3 inline-block rounded-full bg-paper px-2.5 py-0.5 text-xs font-bold text-berry">
                {t === "browser" ? "I pay you 75% of job value" : "I pay you 85% of job value (with stake)"}
              </p>
            </button>
          ))}
        </div>

        {/* Form */}
        <Panel>
          <PanelHeader label="Tell me about your rig" />
          <div className="space-y-5 p-5">
            <div>
              <label className={labelCls}>Your rig&apos;s name</label>
              <input
                value={form.display_name}
                onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))}
                placeholder="e.g. RTX-4090-Berlin"
                className={inputCls}
              />
            </div>

            {form.tier === "native" && (
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <div>
                  <label className={labelCls}>Your GPU (optional)</label>
                  <input
                    value={form.gpu_model}
                    onChange={e => setForm(p => ({ ...p, gpu_model: e.target.value }))}
                    placeholder="RTX 4090"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>VRAM (GB)</label>
                  <input
                    type="number"
                    value={form.vram_gb}
                    onChange={e => setForm(p => ({ ...p, vram_gb: e.target.value }))}
                    placeholder="24"
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={labelCls}>Models I can send you</label>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                {models.map(m => {
                  const checked = form.hosted_models.includes(m.slug);
                  return (
                    <label
                      key={m.slug}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-2xl p-3 transition-colors ${
                        checked ? "border-2 border-ink bg-pink-soft" : "border-[1.5px] border-line bg-paper hover:bg-cream"
                      }`}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleModel(m.slug)} className="h-4 w-4 shrink-0 accent-[var(--pink-deep)]" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{m.name}</p>
                        <p className="text-xs text-graphite"><span className="capitalize">{m.tier}</span> · {m.credits_per_request} units per request</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={labelCls}>Your payout wallet (Ethereum)</label>
              <input
                value={form.payout_wallet}
                onChange={e => setForm(p => ({ ...p, payout_wallet: e.target.value }))}
                placeholder="0x..."
                className={`${inputCls} font-mono text-sm`}
              />
              <p className="mt-1.5 text-xs text-pebble">I send the USDG from every finished job here.</p>
            </div>

            {registrationError && <ErrorNote>{registrationError}</ErrorNote>}

            <PixelBtn onClick={register} disabled={saving} className="w-full">
              {saving ? "Setting you up..." : "Sign me up"}
            </PixelBtn>
          </div>
        </Panel>
      </div>
    );
  }

  const tier = repTier(provider.reputation_score);

  return (
    <div className="max-w-[1000px] space-y-6 p-4 sm:p-6">

      {/* Provider header */}
      <Panel className="p-5 sm:p-6" variant="sticker">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="break-words font-display text-2xl font-extrabold text-ink">{provider.display_name}</h1>
              <span className={`rounded-full border-[1.5px] border-ink px-2.5 py-0.5 text-xs font-bold text-ink ${tier.cls}`}>
                {tier.label}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-graphite">
              {provider.tier === "browser" ? "Running in your browser (WebGPU)" : `Native worker${provider.gpu_model ? ` · ${provider.gpu_model}` : ""}${provider.vram_gb ? ` · ${provider.vram_gb} GB VRAM` : ""}`}
            </p>
          </div>

          <PixelBtn
            onClick={toggleStatus}
            disabled={toggling}
            variant={provider.status === "online" ? "outline" : "primary"}
            className="shrink-0"
          >
            <span className={`h-2 w-2 rounded-full ${provider.status === "online" ? "animate-pulse bg-pink" : "bg-current"}`} />
            {toggling ? "One sec..." : provider.status === "online" ? "Online · take a break" : "Offline · put me to work"}
          </PixelBtn>
        </div>

        {/* Key metrics */}
        <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Reputation",   value: `${provider.reputation_score}/1000`, tint: "bg-pink" },
            { label: "Jobs you ran",  value: provider.total_jobs_completed.toLocaleString(), tint: "bg-peach-deep" },
            { label: "You've earned", value: `$${Number(provider.total_earned_usdg).toFixed(2)}`, tint: "bg-peach" },
            { label: "Uptime",       value: `${Number(provider.uptime_pct).toFixed(1)}%`, tint: "bg-paper" },
          ].map((row) => (
            <div key={row.label} className={`${row.tint} rounded-3xl border-2 border-ink p-4 shadow-[4px_4px_0_var(--ink)]`}>
              <p className="text-sm font-bold text-ink-2">{row.label}</p>
              <p className="mt-2 font-display text-3xl font-extrabold leading-none text-ink">{row.value}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent jobs */}
        <Panel className="lg:col-span-2">
          <PanelHeader label="Jobs I sent you" right={<StatusChip status={provider.status} />} />
          {recentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              {provider.status === "online" ? (
                <p className="inline-flex items-center gap-2.5 text-sm font-semibold text-graphite">
                  <span className="hop-dots inline-flex gap-1 text-pink" aria-hidden><span /><span /><span /></span>
                  I&apos;m watching for your next job
                </p>
              ) : (
                <>
                  <p className="font-display text-lg font-bold text-ink">You&apos;re off the clock</p>
                  <p className="mt-1.5 text-sm text-graphite">Go live and I&apos;ll start sending jobs your way.</p>
                </>
              )}
              {provider.status === "offline" && (
                <PixelBtn onClick={toggleStatus} className="mt-5">
                  Start taking jobs
                </PixelBtn>
              )}
            </div>
          ) : (
            <div className="divide-y-[1.5px] divide-line">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-cream sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{job.model_name}</p>
                    <p className="mt-0.5 text-xs text-pebble">{timeAgo(job.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                    <span className="text-xs text-graphite">{job.output_tokens} tokens</span>
                    <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-xs font-bold text-berry">
                      +${Number(job.provider_payout).toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Info panel */}
        <div className="space-y-6">

          {/* Staking */}
          <Panel>
            <PanelHeader label="Your stake" />
            <div className="space-y-3 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-graphite">$THEA you&apos;ve staked</span>
                <span className="text-sm font-bold text-ink">
                  {Number(provider.thea_staked).toLocaleString()} $THEA
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-graphite">Your payout rate</span>
                <span className="text-sm font-bold text-ink">
                  {Number(provider.thea_staked) >= 1000 ? "85%" : "75%"}
                </span>
              </div>
              {Number(provider.thea_staked) < 1000 && (
                <div className="rounded-2xl bg-peach px-3 py-2.5">
                  <p className="text-xs font-medium leading-5 text-ink-2">
                    Stake 1,000 $THEA or more and I&apos;ll pay you{" "}
                    <span className="rounded-full bg-pink px-1.5 py-px font-bold text-ink">85%</span> of every job instead of 75%.
                  </p>
                </div>
              )}
            </div>
          </Panel>

          {/* Hosted models */}
          <Panel>
            <PanelHeader label="Models you serve" />
            <div className="divide-y-[1.5px] divide-line">
              {provider.hosted_models.length === 0 ? (
                <p className="px-5 py-3 text-sm text-pebble">You haven&apos;t picked any models for me yet.</p>
              ) : (
                provider.hosted_models.map(slug => {
                  const m = models.find(x => x.slug === slug);
                  return (
                    <div key={slug} className="flex items-center justify-between gap-3 px-5 py-2.5">
                      <span className="truncate text-sm font-bold text-ink">{m?.name ?? slug}</span>
                      {m?.tier && <TierChip tier={m.tier} />}
                    </div>
                  );
                })
              )}
            </div>
          </Panel>

          {/* Wallet */}
          <Panel>
            <PanelHeader label="Where I send your USDG" />
            <div className="p-5">
              {provider.payout_wallet ? (
                <p className="break-all rounded-2xl bg-cream px-3 py-2 font-mono text-xs text-ink-2">{provider.payout_wallet}</p>
              ) : (
                <p className="text-sm text-graphite">I don&apos;t have a wallet for you yet. Add one so I have somewhere to send your USDG.</p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
