"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/app/Modal";
import { EmptyState, ErrorNote, PixelBtn, Spinner, StatusChip, inputCls, labelCls } from "@/components/app/ui";

type Wallet = {
  id: string;
  label: string;
  agent_type: string;
  balance: number;
  allocated: number;
  policy: string;
  status: string;
  address: string;
  created_at: string;
  user_id: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mockAddress(id: string) {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 40; i++) {
    addr += chars[(id.charCodeAt(i % id.length) + i * 7) % chars.length];
  }
  return addr;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Wallet | null>(null);
  const [showProvision, setShowProvision] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [form, setForm] = useState({ label: "", agent_type: "Research", allocated: "", policy: "" });
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<{ id: string; name: string }[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);

  const supabase = createClient();

  const fetchPolicies = useCallback(async () => {
    setPoliciesLoading(true);
    const { data } = await supabase.from("policies").select("id, name").order("name", { ascending: true });
    if (data) {
      setPolicies(data);
      setForm((f) => ({ ...f, policy: f.policy || data[0]?.name || "" }));
    }
    setPoliciesLoading(false);
  }, [supabase]);

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("wallets").select("*").order("created_at", { ascending: false });
    if (!error && data) setWallets(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchWallets(); }, [fetchWallets]);

  async function handleProvision(e: React.FormEvent) {
    e.preventDefault();
    setProvisioning(true);
    setProvisionError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProvisionError("I can't tell who you are. Mind signing in again?"); setProvisioning(false); return; }
    const allocated = parseFloat(form.allocated) || 0;
    const { error } = await supabase.from("wallets").insert({
      label: form.label, agent_type: form.agent_type, allocated, balance: allocated,
      policy: form.policy, status: "active", user_id: user.id,
    });
    if (error) { setProvisionError(error.message); setProvisioning(false); return; }
    setForm({ label: "", agent_type: "Research", allocated: "", policy: policies[0]?.name || "" });
    setShowProvision(false);
    setProvisioning(false);
    fetchWallets();
  }

  const filtered = wallets.filter((w) => {
    const matchSearch = !search || w.label.toLowerCase().includes(search.toLowerCase()) || w.agent_type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex h-full">
      {/* Main list */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-line px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Find a wallet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field min-w-0 flex-1 !py-2 text-sm sm:w-56 sm:flex-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="field !w-auto !py-2 text-sm"
            >
              <option value="">Show me everything</option>
              <option value="active">Active ones</option>
              <option value="idle">Idle ones</option>
              <option value="policy-violation">Broke a policy</option>
            </select>
          </div>
          <PixelBtn size="sm" onClick={() => { setShowProvision(true); fetchPolicies(); }}>
            + New wallet
          </PixelBtn>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Spinner label="Fetching your wallets" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="card-quiet">
              <EmptyState
                title="No wallets here yet"
                action={
                  <PixelBtn size="sm" onClick={() => { setShowProvision(true); fetchPolicies(); }}>
                    + New wallet
                  </PixelBtn>
                }
              >
                Give me a label and a budget and I&apos;ll set up your first agent wallet.
              </EmptyState>
            </div>
          )}

          {!loading && filtered.map((w) => {
            const addr = mockAddress(w.id);
            const isSelected = selected?.id === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                className={`w-full rounded-3xl bg-paper p-4 text-left transition-all sm:p-5 ${
                  isSelected
                    ? "border-2 border-ink shadow-[4px_4px_0_var(--ink)]"
                    : "border-[1.5px] border-line hover:border-ink"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold text-ink">{w.label}</p>
                    <p className="mt-1 max-w-[280px] truncate rounded-2xl bg-cream px-2.5 py-1 font-mono text-[11px] text-graphite">{addr}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-cream">
                        {w.policy}
                      </span>
                      <StatusChip status={w.status} />
                      <span className="text-xs font-medium text-graphite">{w.agent_type}</span>
                    </div>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className="font-display text-xl font-extrabold text-ink">${w.balance.toFixed(2)}</p>
                    <p className="mt-0.5 text-xs text-pebble">
                      left of the ${w.allocated.toFixed(2)} you gave it
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-[360px] shrink-0 overflow-y-auto border-l-2 border-ink bg-paper lg:static lg:z-auto lg:w-[340px] lg:max-w-none lg:border-l-[1.5px] lg:border-line">
          <div className="flex items-center justify-between border-b-[1.5px] border-line px-5 py-4">
            <span className="font-display text-[15px] font-bold text-ink">This wallet up close</span>
            <button onClick={() => setSelected(null)} aria-label="Close this" className="rounded-full p-1 text-graphite transition-colors hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="rounded-3xl border-2 border-ink bg-pink p-5 shadow-[4px_4px_0_var(--ink)]">
              <p className="text-sm font-bold text-ink-2">USDG sitting in this wallet</p>
              <p className="mt-2 font-display text-4xl font-extrabold leading-none text-ink">${selected.balance.toFixed(2)}</p>
              <p className="mt-2 text-sm font-medium text-ink-2">
                out of the ${selected.allocated.toFixed(2)} you gave it
              </p>
            </div>

            <dl className="space-y-3">
              {[
                { label: "Wallet ID", value: selected.id.slice(0, 12) + "..." },
                { label: "Status", value: selected.status.replace("-", " ") },
                { label: "Policy", value: selected.policy },
                { label: "Agent type", value: selected.agent_type },
                { label: "Set up on", value: formatDate(selected.created_at) },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 border-b-[1.5px] border-line pb-3 last:border-b-0 last:pb-0">
                  <dt className="text-sm text-graphite">{row.label}</dt>
                  <dd className={`text-right text-sm font-bold text-ink ${row.label === "Wallet ID" ? "font-mono text-xs" : ""}`}>{row.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-bold text-graphite">Where it lives on Robinhood Chain</p>
              <div className="flex items-center gap-2 rounded-2xl bg-cream px-3 py-2.5">
                <p className="flex-1 truncate font-mono text-[11px] text-ink-2">{mockAddress(selected.id)}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(mockAddress(selected.id))}
                  aria-label="Copy this address"
                  className="shrink-0 text-graphite transition-colors hover:text-berry"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <PixelBtn variant="outline" size="sm" className="flex-1">Top it up</PixelBtn>
              <PixelBtn variant="danger" size="sm" className="flex-1">Freeze it</PixelBtn>
            </div>

            <a
              href={`https://robinhoodchain.blockscout.com/address/${mockAddress(selected.id)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-berry hover:underline"
            >
              Check it on Blockscout <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}

      {/* Provision modal */}
      <Modal open={showProvision} onClose={() => { setShowProvision(false); setProvisionError(null); }} className="max-w-[420px]">
        <div className="flex items-center justify-between border-b-[1.5px] border-line px-6 py-4">
          <span className="font-display text-lg font-extrabold text-ink">Let&apos;s set up a wallet</span>
          <button onClick={() => { setShowProvision(false); setProvisionError(null); }} aria-label="Close this" className="rounded-full p-1 text-graphite transition-colors hover:bg-cream hover:text-ink">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleProvision} className="space-y-4 p-6">
          <div>
            <label className={labelCls}>What should I call it?</label>
            <input type="text" required placeholder="e.g. Research Agent v3" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>What kind of agent?</label>
            <select value={form.agent_type} onChange={(e) => setForm((f) => ({ ...f, agent_type: e.target.value }))} className={inputCls}>
              <option>Research</option><option>Orchestrator</option><option>Coding</option>
              <option>Data</option><option>Customer</option><option>Multi-agent</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Starting budget (USDG)</label>
            <input type="number" required min="0" step="0.01" placeholder="e.g. 500.00" value={form.allocated} onChange={(e) => setForm((f) => ({ ...f, allocated: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Which policy should it follow?</label>
            {policiesLoading ? (
              <div className="rounded-2xl bg-cream px-3.5 py-3">
                <Spinner label="Fetching your policies" />
              </div>
            ) : policies.length === 0 ? (
              <div className="rounded-2xl bg-cream px-3.5 py-3 text-sm text-graphite">
                I don&apos;t see any policies yet. Make one in Settings and I&apos;ll bring it here.
              </div>
            ) : (
              <select value={form.policy} onChange={(e) => setForm((f) => ({ ...f, policy: e.target.value }))} className={inputCls}>
                {policies.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            )}
          </div>
          {provisionError && <ErrorNote>{provisionError}</ErrorNote>}
          <PixelBtn type="submit" disabled={provisioning} className="w-full">
            {provisioning ? "Setting it up..." : "Set up wallet"}
          </PixelBtn>
        </form>
      </Modal>
    </div>
  );
}
