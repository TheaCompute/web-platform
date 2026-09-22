"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/context/CreditsContext";
import { EmptyState, Panel, PanelHeader, Spinner, StatusChip, TierChip } from "@/components/app/ui";

type Job = {
  id: string;
  model_name: string;
  tier: string;
  status: string;
  output_tokens: number;
  credits_charged: number;
  tx_hash: string | null;
  created_at: string;
};

type Provider = {
  id: string;
  display_name: string;
  tier: string;
  status: string;
  reputation_score: number;
  total_jobs_completed: number;
  total_earned_usdg: number;
  gpu_model: string | null;
};

type NetworkStats = {
  active_providers: number;
  total_jobs_today: number;
  jobs_per_hour: number;
  avg_latency_ms: number;
  total_usdg_paid_today: number;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const supabase = createClient();
  const { credits, loading: creditsLoading } = useCredits();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [jobsToday, setJobsToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [jobsRes, countRes, providerRes, statsRes] = await Promise.all([
      supabase.from("jobs")
        .select("id, model_name, tier, status, output_tokens, credits_charged, tx_hash, created_at")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(6),
      supabase.from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id).gte("created_at", todayStart.toISOString()),
      supabase.from("providers")
        .select("id, display_name, tier, status, reputation_score, total_jobs_completed, total_earned_usdg, gpu_model")
        .eq("user_id", user.id).single(),
      supabase.from("network_stats")
        .select("active_providers, total_jobs_today, jobs_per_hour, avg_latency_ms, total_usdg_paid_today").single(),
    ]);

    setJobs(jobsRes.data ?? []);
    setJobsToday(countRes.count ?? 0);
    setProvider(providerRes.data ?? null);
    setNetworkStats(statsRes.data ?? null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
    const channel = supabase.channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  const statsLoading = loading || creditsLoading;

  const statCards = [
    {
      label: "Units you have",
      value: statsLoading ? "…" : credits.toLocaleString(),
      sub: `$${statsLoading ? "…" : (credits * 0.01).toFixed(2)} in dollars`,
      tint: "bg-pink",
    },
    {
      label: "Jobs I ran today",
      value: statsLoading ? "…" : jobsToday.toString(),
      sub: jobs.length > 0 ? `Latest was ${timeAgo(jobs[0].created_at)}` : "Nothing yet today",
      tint: "bg-peach-deep",
    },
    {
      label: "USDG I've paid you",
      value: statsLoading ? "…" : provider ? `$${Number(provider.total_earned_usdg).toFixed(2)}` : "$0",
      sub: provider ? `for ${provider.total_jobs_completed.toLocaleString()} finished jobs` : "Lend me a GPU to start",
      tint: "bg-peach",
    },
    {
      label: "GPUs on my network",
      value: statsLoading ? "…" : (networkStats?.active_providers ?? 0).toLocaleString(),
      sub: `handling ${(networkStats?.jobs_per_hour ?? 0).toLocaleString()} jobs an hour`,
      tint: "bg-paper",
    },
  ];

  return (
    <div className="space-y-7 p-4 sm:p-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.tint} rounded-3xl border-2 border-ink p-5 shadow-[4px_4px_0_var(--ink)]`}>
            <p className="text-sm font-bold text-ink-2">{s.label}</p>
            <p className="mt-2 font-display text-4xl font-extrabold leading-none text-ink">{s.value}</p>
            <p className="mt-2 text-sm font-medium text-ink-2">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick start */}
      {!loading && jobs.length === 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            {
              href: "/app/chat",
              tag: "Chat",
              title: "Chat with me privately",
              text: "Pick any open-weight model and ask away. I keep no logs, I add no filters, and each message costs just a few units.",
              cta: "Start chatting",
            },
            {
              href: "/app/earn",
              tag: "Earn",
              title: "Lend me your GPU",
              text: "I'll pay you USDG for every job your GPU finishes. If you join as a browser worker, there's nothing to install.",
              cta: "Show me how",
            },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="sticker sticker-hover group block p-6">
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">{c.tag}</span>
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-6 text-graphite">{c.text}</p>
              <p className="mt-4 text-sm font-bold text-berry group-hover:underline">{c.cta} →</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent jobs */}
        <Panel className="lg:col-span-2">
          <PanelHeader
            label="Jobs I ran for you"
            right={
              <Link href="/app/jobs" className="text-sm font-bold text-berry hover:underline">
                See them all →
              </Link>
            }
          />

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState title="Nothing here yet">
              Send me a message in Chat and I&apos;ll run your very first job.
            </EmptyState>
          ) : (
            <div className="divide-y-[1.5px] divide-line">
              {jobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-cream sm:flex-row sm:items-center sm:gap-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-ink">{job.model_name}</span>
                      <TierChip tier={job.tier} />
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-pebble">
                      {job.tx_hash ? `tx ${job.tx_hash.slice(0, 14)}…` : "I'm still settling this"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-xs text-graphite">{job.output_tokens} tokens</span>
                    <span className="text-xs font-bold text-ink">{job.credits_charged} units</span>
                    <StatusChip status={job.status} />
                    <span className="text-xs text-pebble sm:w-14 sm:text-right">{timeAgo(job.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Right column */}
        <div className="space-y-6">
          {/* Provider status */}
          <Panel>
            <PanelHeader
              label="Your GPU with me"
              right={provider ? <StatusChip status={provider.status} /> : undefined}
            />
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : provider ? (
              <div className="space-y-4 p-5">
                <div>
                  <p className="font-display text-base font-bold text-ink">{provider.display_name}</p>
                  <p className="text-xs text-graphite">
                    {provider.gpu_model ?? (provider.tier === "browser" ? "Running in your browser" : "Running my native node")}
                  </p>
                </div>
                <dl className="space-y-2">
                  {[
                    { label: "Your reputation", value: `${provider.reputation_score}/1000` },
                    { label: "Jobs you finished", value: provider.total_jobs_completed.toLocaleString() },
                    { label: "I've paid you",   value: `$${Number(provider.total_earned_usdg).toFixed(2)}` },
                  ].map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between">
                      <dt className="text-sm text-graphite">{row.label}</dt>
                      <dd className="text-sm font-bold text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/app/earn" className="btn btn-secondary btn-sm w-full">
                  Tune your setup
                </Link>
              </div>
            ) : (
              <div className="p-5 text-center">
                <p className="text-sm text-graphite">Your GPU isn&apos;t working with me yet. Want to change that?</p>
                <Link href="/app/earn" className="btn btn-primary btn-sm mt-4 w-full">
                  Put it to work
                </Link>
              </div>
            )}
          </Panel>

          {/* Network stats */}
          <Panel variant="sticker">
            <PanelHeader
              label="How my network is doing"
              right={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-cream">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink" />
                  Live
                </span>
              }
            />
            <div className="p-5">
              {loading || !networkStats ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <>
                  <dl className="space-y-2">
                    {[
                      { label: "Providers online", value: networkStats.active_providers.toLocaleString() },
                      { label: "Jobs so far today", value: networkStats.total_jobs_today.toLocaleString() },
                      { label: "My average wait",  value: `${(networkStats.avg_latency_ms / 1000).toFixed(1)}s` },
                      { label: "USDG I paid out today", value: `$${Number(networkStats.total_usdg_paid_today).toFixed(0)}` },
                    ].map((row) => (
                      <div key={row.label} className="flex items-baseline justify-between">
                        <dt className="text-sm text-graphite">{row.label}</dt>
                        <dd className="text-sm font-bold text-ink">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 rounded-2xl bg-peach px-3 py-2 text-xs font-medium text-ink-2">
                    I record every settlement on Robinhood Chain, so you can always check my work.
                  </p>
                </>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
