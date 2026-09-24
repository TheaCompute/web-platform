"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/app/Modal";
import { EmptyState, ErrorNote, Panel, PanelHeader, PixelBtn, Spinner, inputCls, labelCls } from "@/components/app/ui";

type Policy = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  max_per_tx: number;
  max_per_day: number;
  max_per_month: number;
  velocity_cap: number;
  require_co_sign: number;
  expiry: string | null;
  allowed_recipients: string[];
  blocked_categories: string[];
  created_at: string;
  updated_at: string;
};

const PARAM_ROWS: { key: keyof Policy; label: string; prefix: string; suffix: string }[] = [
  { key: "max_per_tx", label: "Most I'll let through per transaction", prefix: "$", suffix: " USDG" },
  { key: "max_per_day", label: "Most I'll let through per day (rolling 24h)", prefix: "$", suffix: " USDG" },
  { key: "max_per_month", label: "Most I'll let through per month", prefix: "$", suffix: " USDG" },
  { key: "velocity_cap", label: "Velocity cap: txs I'll allow per hour", prefix: "", suffix: " txs" },
  { key: "require_co_sign", label: "I ask for a co-sign above", prefix: "$", suffix: " USDG" },
];

const CATEGORY_OPTIONS = ["EXCH", "GAMB", "EXT", "P2P", "NFT", "DeFi"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Policy | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({
    name: "", description: "", max_per_tx: "", max_per_day: "", max_per_month: "",
    velocity_cap: "", require_co_sign: "", expiry: "", blocked_categories: [] as string[],
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("policies").select("*").order("created_at", { ascending: true });
    if (!error && data) {
      setPolicies(data);
      if (!selected && data.length > 0) setSelected(data[0]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  function startEditing() {
    if (!selected) return;
    setEditValues({
      max_per_tx: String(selected.max_per_tx), max_per_day: String(selected.max_per_day),
      max_per_month: String(selected.max_per_month), velocity_cap: String(selected.velocity_cap),
      require_co_sign: String(selected.require_co_sign),
    });
    setSaveError(null);
    setEditing(true);
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setSaveError(null);
    const updates = {
      max_per_tx: parseFloat(editValues.max_per_tx) || 0,
      max_per_day: parseFloat(editValues.max_per_day) || 0,
      max_per_month: parseFloat(editValues.max_per_month) || 0,
      velocity_cap: parseInt(editValues.velocity_cap) || 0,
      require_co_sign: parseFloat(editValues.require_co_sign) || 0,
    };
    const { data, error } = await supabase.from("policies").update(updates).eq("id", selected.id).select().single();
    if (error) { setSaveError(error.message); setSaving(false); return; }
    setPolicies((prev) => prev.map((p) => (p.id === selected.id ? data : p)));
    setSelected(data);
    setEditing(false);
    setSaving(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreateError("I can't tell who you are. Mind signing in again?"); setCreating(false); return; }
    const { data, error } = await supabase.from("policies").insert({
      user_id: user.id, name: newForm.name,
      description: newForm.description || "A policy you set up yourself.",
      max_per_tx: parseFloat(newForm.max_per_tx) || 25,
      max_per_day: parseFloat(newForm.max_per_day) || 500,
      max_per_month: parseFloat(newForm.max_per_month) || 5000,
      velocity_cap: parseInt(newForm.velocity_cap) || 50,
      require_co_sign: parseFloat(newForm.require_co_sign) || 500,
      expiry: newForm.expiry || null, allowed_recipients: [],
      blocked_categories: newForm.blocked_categories,
    }).select().single();
    if (error) { setCreateError(error.message); setCreating(false); return; }
    setPolicies((prev) => [...prev, data]);
    setSelected(data);
    setNewForm({ name: "", description: "", max_per_tx: "", max_per_day: "", max_per_month: "", velocity_cap: "", require_co_sign: "", expiry: "", blocked_categories: [] });
    setShowNew(false);
    setCreating(false);
  }

  function toggleCategory(cat: string) {
    setNewForm((f) => ({
      ...f,
      blocked_categories: f.blocked_categories.includes(cat)
        ? f.blocked_categories.filter((c) => c !== cat)
        : [...f.blocked_categories, cat],
    }));
  }

  return (
    <div className="flex h-full flex-col md:flex-row">
      {/* Policy list */}
      <div className="w-full shrink-0 overflow-y-auto border-b-[1.5px] border-line bg-paper md:w-[260px] md:border-b-0 md:border-r-[1.5px]">
        <div className="border-b-[1.5px] border-line px-4 py-4">
          <PixelBtn size="sm" className="w-full" onClick={() => setShowNew(true)}>
            + Make a policy
          </PixelBtn>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="px-2 pb-1 text-xs font-bold text-pebble">Your policies</p>
          {loading && (
            <div className="px-2 py-4">
              <Spinner label="Fetching your policies" />
            </div>
          )}
          {!loading && policies.length === 0 && (
            <p className="px-2 py-4 text-sm text-graphite">You don&apos;t have any policies yet. Make one with the button above.</p>
          )}
          {!loading && policies.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setEditing(false); }}
              className={`w-full rounded-2xl border-[1.5px] p-3 text-left transition-colors ${
                selected?.id === p.id
                  ? "border-ink bg-pink-soft"
                  : "border-transparent hover:bg-cream"
              }`}
            >
              <span className={`text-sm font-bold ${selected?.id === p.id ? "text-ink" : "text-ink-2"}`}>
                {p.name}
              </span>
              <p className="mt-1 text-xs leading-snug text-graphite">{p.description || "You didn't add a description."}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Policy detail */}
      {selected ? (
        <div className="min-w-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-extrabold text-ink">{selected.name}</h2>
              <p className="mt-1 text-xs text-pebble">
                Last changed {formatDate(selected.updated_at)}
              </p>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <PixelBtn variant="outline" size="sm" onClick={() => { setEditing(false); setSaveError(null); }}>
                    Cancel
                  </PixelBtn>
                  <PixelBtn size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving it..." : "Save changes"}
                  </PixelBtn>
                </>
              ) : (
                <PixelBtn variant="outline" size="sm" onClick={startEditing}>
                  Edit limits
                </PixelBtn>
              )}
            </div>
          </div>

          {saveError && <ErrorNote>{saveError}</ErrorNote>}

          {/* Spend limits */}
          <Panel variant="sticker">
            <PanelHeader
              label="Your spend limits"
              right={
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">I enforce these on-chain</span>
              }
            />
            <div className="divide-y-[1.5px] divide-line">
              {PARAM_ROWS.map((row) => {
                const val = selected[row.key];
                return (
                  <div key={row.key} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
                    <span className="text-sm text-graphite">{row.label}</span>
                    {editing ? (
                      <input
                        value={editValues[row.key] ?? String(val)}
                        onChange={(e) => setEditValues((v) => ({ ...v, [row.key]: e.target.value }))}
                        className={`${inputCls} w-32 py-1.5 text-right font-bold`}
                      />
                    ) : (
                      <span className="font-display text-2xl font-extrabold leading-none text-ink">
                        {row.prefix}{String(val)}
                        <span className="text-sm font-bold text-graphite">{row.suffix}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Allowed recipients */}
          <Panel>
            <PanelHeader label="Who you can pay" />
            <div className="p-5">
              <p className="mb-4 text-sm text-graphite">
                {selected.allowed_recipients.length > 0
                  ? "I'll only send payments under this policy to these addresses or domains."
                  : "You haven't set an allowlist, so I'll pay any recipient that isn't blocked."}
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.allowed_recipients.map((r) => (
                  <span key={r} className="inline-flex max-w-full items-center truncate rounded-full border-[1.5px] border-line bg-cream px-3 py-1 font-mono text-xs text-ink-2">
                    {r}
                  </span>
                ))}
                {selected.allowed_recipients.length === 0 && (
                  <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold text-graphite">No allowlist yet</span>
                )}
              </div>
            </div>
          </Panel>

          {/* Blocked categories */}
          <Panel>
            <PanelHeader label="What I&apos;ll block" />
            <div className="p-5">
              <p className="mb-4 text-sm text-graphite">I block these transaction types, no matter the amount.</p>
              <div className="flex flex-wrap gap-2">
                {selected.blocked_categories.length > 0
                  ? selected.blocked_categories.map((c) => (
                      <span key={c} className="inline-flex items-center rounded-full border-[1.5px] border-danger bg-danger-soft px-3 py-1 text-xs font-bold text-danger">
                        {c}
                      </span>
                    ))
                  : <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold text-graphite">Nothing blocked yet</span>
                }
              </div>
            </div>
          </Panel>

          {/* Expiry & co-sign */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border-2 border-ink bg-peach p-5 shadow-[4px_4px_0_var(--ink)]">
              <p className="text-sm font-bold text-ink-2">When this policy ends</p>
              {selected.expiry
                ? <p className="mt-2 font-display text-2xl font-extrabold leading-none text-danger">{selected.expiry}</p>
                : <p className="mt-2 font-display text-2xl font-extrabold leading-none text-ink">Never expires</p>
              }
              <p className="mt-2 text-sm font-medium text-ink-2">I freeze the wallet at the expiry timestamp.</p>
            </div>
            <div className="rounded-3xl border-2 border-ink bg-pink p-5 shadow-[4px_4px_0_var(--ink)]">
              <p className="text-sm font-bold text-ink-2">When I ask for a co-sign</p>
              <p className="mt-2 font-display text-2xl font-extrabold leading-none text-ink">${selected.require_co_sign} <span className="text-sm font-bold text-ink-2">USDG</span></p>
              <p className="mt-2 text-sm font-medium text-ink-2">Above this amount, I require 2-of-2 MPC.</p>
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              title="No policies here yet"
              action={<PixelBtn size="sm" onClick={() => setShowNew(true)}>+ Make a policy</PixelBtn>}
            >
              Make a policy and I&apos;ll keep your agent&apos;s spending in check.
            </EmptyState>
          </div>
        )
      )}

      {/* New policy modal */}
      <Modal open={showNew} onClose={() => { setShowNew(false); setCreateError(null); }} className="max-h-[90vh] max-w-[480px] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-[1.5px] border-line bg-paper px-6 py-4">
          <p className="font-display text-lg font-bold text-ink">Let&apos;s make a policy</p>
          <button onClick={() => { setShowNew(false); setCreateError(null); }} aria-label="Close" className="rounded-full p-1.5 text-graphite transition-colors hover:bg-cream hover:text-ink">
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleCreate} className="space-y-4 p-6">
          <div>
            <label className={labelCls}>Name it</label>
            <input required placeholder="e.g. High Trust" value={newForm.name} onChange={(e) => setNewForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>What&apos;s it for?</label>
            <input placeholder="A few words about this policy" value={newForm.description} onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {[
              { label: "Per tx limit (USDG)", key: "max_per_tx", placeholder: "25.00" },
              { label: "Per day limit (USDG)", key: "max_per_day", placeholder: "500.00" },
              { label: "Per month limit (USDG)", key: "max_per_month", placeholder: "5000.00" },
              { label: "Most txs per hour", key: "velocity_cap", placeholder: "50" },
              { label: "Co-sign above (USDG)", key: "require_co_sign", placeholder: "500.00" },
            ].map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input type="number" min="0" step="0.01" placeholder={f.placeholder} value={newForm[f.key as keyof typeof newForm] as string} onChange={(e) => setNewForm((fm) => ({ ...fm, [f.key]: e.target.value }))} className={inputCls} />
              </div>
            ))}
            <div>
              <label className={labelCls}>Expires on (optional)</label>
              <input type="date" value={newForm.expiry} onChange={(e) => setNewForm((f) => ({ ...f, expiry: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Categories I&apos;ll block</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = newForm.blocked_categories.includes(cat);
                return (
                  <button
                    key={cat} type="button" onClick={() => toggleCategory(cat)}
                    className={`rounded-full border-[1.5px] px-3 py-1 text-xs font-bold transition-colors ${
                      active
                        ? "border-ink bg-pink text-ink shadow-[2px_2px_0_var(--ink)]"
                        : "border-line bg-paper text-graphite hover:border-ink hover:bg-cream hover:text-ink"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          {createError && <ErrorNote>{createError}</ErrorNote>}
          <PixelBtn type="submit" disabled={creating} className="w-full">
            {creating ? "Making it..." : "Make this policy"}
          </PixelBtn>
        </form>
      </Modal>
    </div>
  );
}
