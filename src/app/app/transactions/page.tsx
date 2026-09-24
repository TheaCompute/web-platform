"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState, Spinner, StatusChip } from "@/components/app/ui";

type Transaction = {
  id: string;
  sig: string;
  wallet_label: string;
  recipient: string;
  recipient_addr: string;
  amount: number;
  status: string;
  block_number: number;
  fee: number;
  memo: string;
  created_at: string;
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState("all");
  const [walletFilter, setWalletFilter] = useState("all");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTransactions(data ?? []);
        setLoading(false);
      });
  }, []);

  const walletLabels = Array.from(new Set(transactions.map((t) => t.wallet_label)));

  const filtered = transactions.filter((t) => {
    const statusMatch = filter === "all" || t.status === filter;
    const walletMatch = walletFilter === "all" || t.wallet_label === walletFilter;
    return statusMatch && walletMatch;
  });

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[1.5px] border-line px-4 py-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            {["all", "confirmed", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize transition-all ${
                  filter === f
                    ? "border-2 border-ink bg-pink text-ink shadow-[2px_2px_0_var(--ink)]"
                    : "border-2 border-transparent text-graphite hover:bg-peach hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="field !w-auto max-w-[180px] !py-2 text-sm"
            >
              <option value="all">Every wallet</option>
              {walletLabels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button className="btn btn-secondary btn-sm">
              Download CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="card-quiet overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="border-b-[1.5px] border-line">
                  <tr>
                    {["Tx hash", "Agent", "Recipient", "Amount", "Status", "Time"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-pebble">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-5 py-20 text-center">
                        <Spinner label="Fetching your transactions" />
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        <EmptyState title="Nothing settled yet">
                          When your agent wallets pay for something, I&apos;ll list every settlement right here.
                        </EmptyState>
                      </td>
                    </tr>
                  )}
                  {filtered.map((tx, i) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelected(tx)}
                      className={`cursor-pointer transition-colors hover:bg-cream ${
                        selected?.id === tx.id ? "bg-pink-soft" : ""
                      } ${i !== 0 ? "border-t-[1.5px] border-line" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-ink-2">{tx.sig.slice(0, 14)}…</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-graphite">{tx.wallet_label}</td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-bold text-ink">{tx.recipient}</p>
                          <p className="font-mono text-[11px] text-pebble">{tx.recipient_addr}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-bold ${tx.status === "blocked" ? "text-danger line-through" : "text-ink"}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusChip status={tx.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-pebble">{formatRelative(tx.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-[360px] shrink-0 overflow-y-auto border-l-2 border-ink bg-paper lg:static lg:z-auto lg:w-[340px] lg:max-w-none lg:border-l-[1.5px] lg:border-line">
          <div className="flex items-center justify-between border-b-[1.5px] border-line px-5 py-4">
            <span className="font-display text-[15px] font-bold text-ink">This transaction up close</span>
            <button onClick={() => setSelected(null)} aria-label="Close this" className="rounded-full p-1 text-graphite transition-colors hover:bg-cream hover:text-ink">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div
              className={`rounded-2xl border-[1.5px] px-4 py-3 ${
                selected.status === "blocked"
                  ? "border-danger bg-danger-soft"
                  : "border-pink bg-pink-soft"
              }`}
            >
              <span className={`text-sm font-bold ${selected.status === "blocked" ? "text-danger" : "text-berry"}`}>
                {selected.status === "blocked" ? "I blocked this one. It broke your policy." : "Done and confirmed on-chain."}
              </span>
            </div>

            <div className={`rounded-3xl border-2 border-ink px-4 py-5 text-center shadow-[4px_4px_0_var(--ink)] ${selected.status === "blocked" ? "bg-paper" : "bg-peach-deep"}`}>
              <p className="text-sm font-bold text-ink-2">How much</p>
              <p className={`mt-2 font-display text-4xl font-extrabold leading-none ${selected.status === "blocked" ? "text-danger line-through" : "text-ink"}`}>
                ${Number(selected.amount).toFixed(2)}
              </p>
              <p className="mt-2 text-sm font-medium text-ink-2">USDG</p>
            </div>

            <dl className="space-y-3">
              {[
                { label: "Block",       value: selected.block_number?.toLocaleString() },
                { label: "Timestamp",   value: formatTimestamp(selected.created_at) },
                { label: "Network fee", value: `${selected.fee} ETH` },
                { label: "Sent from",   value: selected.wallet_label },
                { label: "Paid to",     value: selected.recipient },
                { label: "Memo",        value: selected.memo || "-" },
              ].map((row) => (
                <div key={row.label} className="border-b-[1.5px] border-line pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-bold text-pebble">{row.label}</dt>
                  <dd className="mt-1 break-all text-sm font-bold text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="mb-1.5 text-xs font-bold text-graphite">My receipt (transaction hash)</p>
              <div className="rounded-2xl bg-cream p-3">
                <p className="break-all font-mono text-[11px] text-ink-2">{selected.sig}</p>
              </div>
            </div>

            <a
              href={`https://robinhoodchain.blockscout.com/tx/${selected.sig}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-berry hover:underline"
            >
              Check it on Blockscout <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
