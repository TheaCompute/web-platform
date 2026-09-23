"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState, MonoTag, Panel, PixelBtn, Spinner, StatusChip, TierChip } from "@/components/app/ui";

type Job = {
  id: string;
  model_name: string;
  model_slug: string;
  tier: string;
  status: string;
  input_tokens: number;
  output_tokens: number;
  credits_charged: number;
  usdg_value: number;
  latency_ms: number | null;
  tx_hash: string | null;
  block_number: number | null;
  created_at: string;
  completed_at: string | null;
};

const STATUS_OPTIONS = ["all", "completed", "running", "pending", "failed", "disputed"] as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

export default function JobsPage() {
  const supabase = createClient();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedHash, setCopiedSig] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    let query = supabase.from("jobs")
      .select("id, model_name, model_slug, tier, status, input_tokens, output_tokens, credits_charged, usdg_value, latency_ms, tx_hash, block_number, created_at, completed_at")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data } = await query;
    setJobs(data ?? []);
    setLoading(false);
  }, [supabase, statusFilter]);

  useEffect(() => {
    load();
    const channel = supabase.channel("jobs-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [load, supabase]);

  async function copyHash(sig: string) {
    await navigator.clipboard.writeText(sig);
    setCopiedSig(sig);
    setTimeout(() => setCopiedSig(null), 2000);
  }

  const totalCredits = jobs.reduce((sum, j) => sum + (j.credits_charged ?? 0), 0);
  const completedCount = jobs.filter(j => j.status === "completed").length;

  return (
    <div className="max-w-[1100px] space-y-6 p-4 sm:p-6">

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
        {[
          { label: "Jobs I ran for you",  value: jobs.length.toString(),         tint: "bg-pink" },
          { label: "Finished",    value: completedCount.toString(),      tint: "bg-peach-deep" },
          { label: "Units you spent", value: totalCredits.toLocaleString(),  tint: "bg-peach" },
        ].map((s) => (
          <div key={s.label} className={`${s.tint} rounded-3xl border-2 border-ink p-5 shadow-[4px_4px_0_var(--ink)]`}>
            <p className="text-sm font-bold text-ink-2">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-extrabold leading-none text-ink sm:text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Panel>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b-[1.5px] border-line px-4 py-3.5 sm:px-5">
          <span className="mr-1 text-sm font-bold text-ink">Show me</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition-colors ${
                statusFilter === s
                  ? "border-2 border-ink bg-pink text-ink shadow-[2px_2px_0_var(--ink)]"
                  : "border-2 border-transparent text-graphite hover:bg-cream hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner label="Fetching your jobs" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState title={statusFilter !== "all" ? `I don't have any ${statusFilter} jobs for you` : "Nothing here yet"}>
            {statusFilter !== "all" ? "Try another filter and I'll look again." : "Send me a message in Chat and I'll run your first job."}
          </EmptyState>
        ) : (
          <div className="divide-y-[1.5px] divide-line">
            {/* Header */}
            <div className="hidden grid-cols-[1fr_90px_80px_70px_100px_90px] gap-3 px-5 py-2.5 md:grid">
              {["Model", "Status", "Tokens", "Units", "Tx", "Time"].map((h) => (
                <span key={h} className={`text-xs font-bold text-pebble ${h === "Time" ? "text-right" : ""}`}>{h}</span>
              ))}
            </div>

            {jobs.map((job) => (
              <div key={job.id}>
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className={`grid w-full grid-cols-2 gap-x-3 gap-y-2 px-4 py-3.5 text-left transition-colors hover:bg-cream md:grid-cols-[1fr_90px_80px_70px_100px_90px] md:px-5 md:py-3 ${
                    expandedId === job.id ? "bg-cream" : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-bold text-ink">{job.model_name}</span>
                    <TierChip tier={job.tier} />
                  </div>
                  <div className="flex items-center justify-end md:justify-start"><StatusChip status={job.status} /></div>
                  <div className="flex items-center text-xs text-graphite">
                    {(job.input_tokens + job.output_tokens).toLocaleString()}
                    <span className="ml-1 md:hidden">tokens</span>
                  </div>
                  <div className="flex items-center justify-end text-sm font-bold text-ink md:justify-start">
                    {job.credits_charged}
                    <span className="ml-1 text-xs font-medium text-graphite md:hidden">units</span>
                  </div>
                  <div className="flex min-w-0 items-center">
                    {job.tx_hash ? (
                      <span className="truncate font-mono text-[11px] text-graphite">
                        {job.tx_hash.slice(0, 10)}...
                      </span>
                    ) : (
                      <span className="text-xs text-pebble">Not settled yet</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end text-xs text-pebble">
                    {timeAgo(job.created_at)}
                  </div>
                </button>

                {/* Expanded row */}
                {expandedId === job.id && (
                  <div className="space-y-3 border-t-[1.5px] border-line bg-cream px-4 py-4 md:px-5">
                    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-4">
                      {[
                        { label: "Job ID",        value: job.id.slice(0, 16) + "...", mono: true },
                        { label: "Input tokens",  value: job.input_tokens.toLocaleString() },
                        { label: "Output tokens", value: job.output_tokens.toLocaleString() },
                        { label: "Latency",       value: job.latency_ms ? `${job.latency_ms}ms` : "-" },
                        { label: "USDG value",    value: `$${Number(job.usdg_value).toFixed(4)}` },
                        { label: "Block",         value: job.block_number ? job.block_number.toLocaleString() : "-", mono: true },
                        { label: "You sent it",     value: new Date(job.created_at).toLocaleString() },
                        { label: "Finished",      value: job.completed_at ? new Date(job.completed_at).toLocaleString() : "-" },
                      ].map((row) => (
                        <div key={row.label} className="min-w-0 rounded-2xl border-[1.5px] border-line bg-paper px-3.5 py-2.5">
                          <MonoTag>{row.label}</MonoTag>
                          <p className={`mt-1 break-words text-sm font-bold text-ink ${row.mono ? "font-mono text-xs" : ""}`}>{row.value}</p>
                        </div>
                      ))}
                    </div>

                    {job.tx_hash && (
                      <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-line bg-paper px-4 py-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <MonoTag className="mb-1 block">Your receipt on Robinhood Chain</MonoTag>
                          <p className="truncate font-mono text-xs text-ink-2">{job.tx_hash}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <PixelBtn variant="outline" size="sm" onClick={() => copyHash(job.tx_hash!)}>
                            {copiedHash === job.tx_hash ? "Copied it" : "Copy hash"}
                          </PixelBtn>
                          <a
                            href={`https://robinhoodchain.blockscout.com/tx/${job.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-berry hover:underline"
                          >
                            Check it on Blockscout →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
