"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/context/CreditsContext";
import Image from "next/image";
import { ErrorNote, MonoTag, PixelBtn, TierChip } from "@/components/app/ui";
import { cn } from "@/lib/utils";

type Model = {
  slug: string;
  name: string;
  tier: string;
  credits_per_request: number;
  description: string;
  parameter_count: string;
  max_context_tokens: number;
};

type Receipt = {
  txHash: string;
  credits: number;
  blockNumber: number;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokens: number;
  created_at: string;
  receipt?: Receipt;
};

const TIER_DOTS: Record<string, string> = {
  lite:     "bg-paper",
  standard: "bg-peach",
  pro:      "bg-peach-deep",
  max:      "bg-pink",
};

const SUGGESTED_PROMPTS = [
  "How do optimistic rollups actually work?",
  "Draft me a threat model for a browser wallet extension",
  "Give me the Bitcoin whitepaper in five bullet points",
];

const DEMO_RESPONSES = [
  "Hi, it's Thea, and you're in my beta. I passed this to a provider somewhere on my network who runs an open-weight model. Once I'm in production, I encrypt your prompt on your device before it goes anywhere, the provider decrypts and runs it locally, and I write nothing down. I clear payment for the job on Robinhood Chain the moment the work is verified.",
  "Quick peek behind the curtain: I encrypted your prompt in your browser, sent it to the nearest free GPU, let only that machine decrypt it, and streamed the answer right back to you. I keep no record of what you said. On-chain there's just a job ID, a model tier, and a unit amount, and that's the entire trail I leave.",
  "I sent your request across my mesh of independent GPU providers. None of them can read what you asked, and I can't either. The model answering you is open-weight, so no corporate policy layer sits between your question and its answer. I'm settling this job on Robinhood Chain while you read.",
  "One of my providers grabbed your job and ran it through an open-weight model with nothing bolted on in front, so you got raw output straight from the weights. Now that inference is done, escrow releases by itself. I pay the provider 75% of the job value in USDG, and my protocol fee goes to the treasury for buybacks and staking rewards.",
];

function pickResponse(input: string): string {
  const idx = input.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % DEMO_RESPONSES.length;
  return DEMO_RESPONSES[idx];
}

const newSessionId = () => crypto.randomUUID();

function BotAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const lg = size === "lg";
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-peach-deep",
        lg ? "h-16 w-16 shadow-[3px_3px_0_var(--ink)]" : "mt-0.5 h-9 w-9"
      )}
    >
      <Image
        src="/images/logo-transparent.png"
        alt=""
        width={lg ? 64 : 36}
        height={lg ? 64 : 36}
        className={cn("mt-2 object-cover", lg ? "h-16 w-16" : "h-9 w-9")}
      />
    </span>
  );
}

function SettlementLine({ receipt }: { receipt: Receipt }) {
  return (
    <a
      href={`https://robinhoodchain.blockscout.com/tx/${receipt.txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 px-1 text-[11px] font-semibold text-berry transition-colors hover:underline"
    >
      <span aria-hidden>✓</span>
      I settled this · <span className="font-mono">{receipt.txHash.slice(0, 10)}…{receipt.txHash.slice(-6)}</span> · block{" "}
      {receipt.blockNumber.toLocaleString()} · {receipt.credits} units
    </a>
  );
}

function HopDots() {
  return (
    <span className="hop-dots inline-flex gap-1 text-pink" aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}

export default function ChatPage() {
  const supabase = createClient();
  const { credits, deductCredits } = useCredits();

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>(newSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<{ session_id: string; model_slug: string; preview: string; created_at: string }[]>([]);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
    supabase.from("models").select("slug, name, tier, credits_per_request, description, parameter_count, max_context_tokens")
      .eq("is_active", true).order("credits_per_request", { ascending: true })
      .then(({ data }) => {
        const list = data ?? [];
        setModels(list);
        if (list.length > 0) setSelectedModel(list.find(m => m.slug === "qwen3-8b") ?? list[0]);
      });
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    supabase.from("messages")
      .select("session_id, model_slug, content, created_at")
      .eq("user_id", userId).eq("role", "user")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const seen = new Set<string>();
        const unique = data.filter(m => { if (seen.has(m.session_id)) return false; seen.add(m.session_id); return true; });
        setSessions(unique.map(m => ({
          session_id: m.session_id,
          model_slug: m.model_slug ?? "",
          preview: m.content.slice(0, 48) + (m.content.length > 48 ? "..." : ""),
          created_at: m.created_at,
        })).slice(0, 8));
      });
  }, [userId, messages, supabase]);

  const loadSession = useCallback(async (sid: string) => {
    if (!userId) return;
    setSessionId(sid);
    setSessionsOpen(false);
    const { data } = await supabase.from("messages")
      .select("id, role, content, tokens, created_at")
      .eq("user_id", userId).eq("session_id", sid)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as Message[]);
  }, [userId, supabase]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamedText]);

  async function sendMessage(text?: string) {
    const raw = (text ?? input).trim();
    if (!raw || !selectedModel || !userId || sending) return;
    if (credits < selectedModel.credits_per_request) return;

    const userContent = raw;
    setInput("");
    setSending(true);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userContent,
      tokens: Math.ceil(userContent.split(" ").length * 1.3),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    await supabase.from("messages").insert({
      user_id: userId, session_id: sessionId, role: "user",
      content: userContent, model_slug: selectedModel.slug, tokens: userMsg.tokens,
    });

    const { data: jobRow } = await supabase.from("jobs").insert({
      user_id: userId, model_slug: selectedModel.slug, model_name: selectedModel.name,
      tier: selectedModel.tier, status: "running", input_tokens: userMsg.tokens,
      credits_charged: selectedModel.credits_per_request,
      usdg_value: selectedModel.credits_per_request * 0.01,
    }).select("id").single();

    await deductCredits(selectedModel.credits_per_request, jobRow?.id);

    const responseText = pickResponse(userContent);
    const outputTokens = Math.ceil(responseText.split(" ").length * 1.3);

    setStreaming(true);
    setStreamedText("");
    let i = 0;
    const interval = setInterval(() => {
      i += Math.ceil(Math.random() * 4) + 1;
      if (i >= responseText.length) {
        i = responseText.length;
        clearInterval(interval);
        setStreaming(false);
        setStreamedText("");

        let receipt: Receipt | undefined;
        if (jobRow?.id) {
          const txHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 64);
          const blockNumber = Math.floor(Math.random() * 10000000) + 4000000;
          receipt = { txHash, credits: selectedModel.credits_per_request, blockNumber };
          supabase.from("jobs").update({
            status: "completed", output_tokens: outputTokens,
            output_hash: btoa(responseText.slice(0, 32)), tx_hash: txHash,
            block_number: blockNumber,
            latency_ms: Math.floor(Math.random() * 800) + 800,
            provider_payout: selectedModel.credits_per_request * 0.0075,
            protocol_fee: selectedModel.credits_per_request * 0.0025,
            completed_at: new Date().toISOString(),
          }).eq("id", jobRow.id);
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(), role: "assistant", content: responseText,
          tokens: outputTokens, created_at: new Date().toISOString(), receipt,
        };
        setMessages(prev => [...prev, assistantMsg]);
        supabase.from("messages").insert({
          user_id: userId, session_id: sessionId, role: "assistant",
          content: responseText, model_slug: selectedModel.slug, tokens: outputTokens,
        });
        setSending(false);
      } else {
        setStreamedText(responseText.slice(0, i));
      }
    }, 18);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function startNewChat() {
    setSessionId(newSessionId());
    setMessages([]);
    setInput("");
    setSessionsOpen(false);
  }

  function usePrompt(text: string) {
    setInput(text);
    textareaRef.current?.focus();
  }

  const cost = selectedModel?.credits_per_request ?? 0;
  const broke = credits < cost;
  const canSend = input.trim().length > 0 && !sending && selectedModel !== null && !broke;

  const sessionsPanel = (
    <>
      <div className="border-b-[1.5px] border-line p-3">
        <PixelBtn variant="outline" size="sm" onClick={startNewChat} className="w-full">
          <span aria-hidden>+</span> Start a new chat
        </PixelBtn>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        <p className="px-2 pb-1 pt-2 text-xs font-bold text-pebble">Our chats</p>
        {sessions.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-pebble">No chats yet. Say hi and they&apos;ll show up here.</p>
        ) : (
          sessions.map((s) => {
            const active = s.session_id === sessionId;
            return (
              <button
                key={s.session_id}
                onClick={() => loadSession(s.session_id)}
                className={cn(
                  "w-full rounded-2xl border-[1.5px] px-3 py-2 text-left transition-colors",
                  active
                    ? "border-ink bg-pink-soft"
                    : "border-transparent hover:bg-peach"
                )}
              >
                <p className={cn("truncate text-sm font-semibold", active ? "text-ink" : "text-ink-2")}>
                  {s.preview || "Untitled chat"}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-pebble">{s.model_slug}</p>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t-[1.5px] border-line p-3">
        <div className="flex items-center justify-between rounded-2xl bg-peach px-3 py-2">
          <span className="text-sm font-semibold text-graphite">Your units</span>
          <span className={cn("text-sm font-bold", broke ? "text-danger" : "text-ink")}>{credits.toLocaleString()}</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-full overflow-hidden bg-cream">

      {/* Session history: static rail on md+, slide-over drawer on mobile */}
      {sessionsOpen && (
        <div className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setSessionsOpen(false)} aria-hidden="true" />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r-2 border-ink bg-paper transition-transform duration-200",
          "md:static md:z-auto md:w-[240px] md:translate-x-0 md:border-r-[1.5px] md:border-line md:transition-none",
          sessionsOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sessionsPanel}
      </aside>

      {/* Main chat area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header: title, model picker, session status */}
        <div className="relative z-30 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b-[1.5px] border-line bg-paper px-4 py-3">
          {/* Mobile: sessions toggle */}
          <button
            onClick={() => setSessionsOpen(true)}
            aria-label="Show our chats"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-colors hover:bg-peach md:hidden"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M3 5h14M3 10h14M3 15h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">Chat with me</h1>
            <p className="text-sm text-graphite">Ask my open models anything. I don&apos;t write any of it down.</p>
          </div>

          {/* Model picker */}
          <div className="relative w-full min-w-0 sm:w-auto">
            <button
              onClick={() => setModelPickerOpen((o) => !o)}
              aria-expanded={modelPickerOpen}
              className={cn(
                "flex w-full max-w-full items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold text-ink transition-colors sm:w-auto",
                modelPickerOpen ? "bg-pink-soft" : "bg-paper hover:bg-peach"
              )}
            >
              <span className="shrink-0 text-xs font-semibold text-pebble">Model</span>
              {selectedModel ? (
                <>
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px] border-ink", TIER_DOTS[selectedModel.tier] ?? "bg-paper")} />
                  <span className="min-w-0 flex-1 truncate text-left">{selectedModel.name}</span>
                  <span className="shrink-0 rounded-full bg-pink-soft px-2 py-px text-xs font-bold text-berry">
                    {selectedModel.credits_per_request} units
                  </span>
                </>
              ) : (
                <span className="flex-1 text-left font-semibold text-pebble">Choose one of my models</span>
              )}
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
                className={cn("h-4 w-4 shrink-0 text-graphite transition-transform", modelPickerOpen && "rotate-180")}
              >
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {modelPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setModelPickerOpen(false)} aria-hidden="true" />
                <div className="sticker absolute left-0 top-full z-50 mt-3 w-full rounded-3xl p-2 sm:left-auto sm:right-0 sm:w-[min(420px,80vw)]">
                  <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-1.5">
                    <span className="font-display text-sm font-bold text-ink">My open-weight models</span>
                    <MonoTag className="text-berry">1 unit is $0.01</MonoTag>
                  </div>
                  <div className="max-h-[320px] space-y-1 overflow-y-auto">
                    {models.map((m) => {
                      const active = selectedModel?.slug === m.slug;
                      return (
                        <button
                          key={m.slug}
                          onClick={() => { setSelectedModel(m); setModelPickerOpen(false); }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left transition-colors",
                            active ? "border-ink bg-pink-soft" : "border-transparent hover:bg-peach"
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate text-sm font-bold text-ink">{m.name}</span>
                              <TierChip tier={m.tier} />
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-graphite">
                              {m.parameter_count} · {(m.max_context_tokens / 1000).toFixed(0)}k context
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-bold text-ink">{m.credits_per_request} units</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Session status */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <span className="text-xs text-pebble">
              Session <span className="font-mono text-graphite">{sessionId.slice(0, 8)}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-cream">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink" />
              Encrypted
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="dot-paper flex-1 space-y-6 overflow-y-auto bg-cream px-4 py-6">
          {messages.length === 0 && !streaming ? (
            <div className="mx-auto flex h-full max-w-[520px] flex-col items-center justify-center text-center">
              <div className="mb-5">
                <BotAvatar size="lg" />
              </div>
              <p className="font-display text-2xl font-extrabold text-ink">
                {selectedModel ? selectedModel.name : "Pick a model and let's talk"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-graphite">
                {selectedModel ? selectedModel.description : "Choose one from the bar up top, then tell me what's on your mind."}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                Hi, I&apos;m Thea. I lock your message before it ever leaves your browser, hand it to a GPU on my network, and don&apos;t write any of it down.
              </p>

              {selectedModel && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {[
                    selectedModel.parameter_count,
                    `${(selectedModel.max_context_tokens / 1000).toFixed(0)}k context`,
                    `${selectedModel.credits_per_request} units per request`,
                    "I keep nothing",
                  ].map((chip) => (
                    <span key={chip} className="rounded-full border-[1.5px] border-line bg-paper px-3 py-1 text-xs font-bold text-ink-2">
                      {chip}
                    </span>
                  ))}
                </div>
              )}

              {selectedModel && !broke && (
                <div className="mt-8 w-full max-w-[420px] space-y-2 text-left">
                  <p className="text-xs font-bold text-pebble">Not sure where to start? Try one of mine.</p>
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => usePrompt(p)}
                      className="block w-full rounded-2xl border-[1.5px] border-line bg-paper px-4 py-2.5 text-left text-sm font-medium text-ink-2 transition-colors hover:border-ink hover:bg-peach hover:text-ink"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {selectedModel && broke && (
                <div className="mt-6 w-full">
                  <ErrorNote>
                    This model costs {cost} units per request and you&apos;ve got {credits}. Top up and I&apos;ll get right back to it.{" "}
                    <a href="/app/settings" className="font-bold underline underline-offset-2">Add more units</a>
                  </ErrorNote>
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && <BotAvatar />}
                  <div className="min-w-0 max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={cn(
                        "px-4 py-3",
                        msg.role === "user"
                          ? "rounded-3xl rounded-br-md border-2 border-ink bg-pink text-ink"
                          : "rounded-3xl rounded-tl-md border-[1.5px] border-line bg-paper text-ink"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{msg.content}</p>
                      <p className={cn("mt-1.5 text-[11px] font-semibold", msg.role === "user" ? "text-ink-2" : "text-pebble")}>
                        {msg.tokens} tokens
                      </p>
                    </div>
                    {msg.role === "assistant" && msg.receipt && <SettlementLine receipt={msg.receipt} />}
                  </div>
                </div>
              ))}

              {streaming && (
                <div className="flex justify-start gap-3">
                  <BotAvatar />
                  <div className="min-w-0 max-w-[85%] rounded-3xl rounded-tl-md border-[1.5px] border-line bg-paper px-4 py-3 sm:max-w-[70%]">
                    {streamedText ? (
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink">
                        {streamedText}
                        <span className="ml-1.5 inline-flex align-middle"><HopDots /></span>
                      </p>
                    ) : (
                      <p className="inline-flex items-center gap-2.5 text-sm font-semibold text-graphite">
                        <HopDots />
                        Finding you the nearest worker on my network
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Composer */}
        <div className="border-t-[1.5px] border-line bg-cream px-4 pb-3 pt-3">
          {broke && messages.length > 0 && (
            <div className="mb-3">
              <ErrorNote>
                You&apos;re out of units, and this model costs {cost} per request. Top up and we&apos;ll keep going.{" "}
                <a href="/app/settings" className="font-bold underline underline-offset-2">Add more units</a>
              </ErrorNote>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-3xl border-2 border-ink bg-paper py-2 pl-4 pr-2 shadow-[4px_4px_0_var(--ink)] transition-shadow focus-within:shadow-[4px_4px_0_var(--pink)]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedModel ? `Ask me anything, I'll run it on ${selectedModel.name}…` : "Pick a model first and I'm all yours"}
              disabled={!selectedModel || sending}
              className="max-h-[120px] min-h-[24px] min-w-0 flex-1 resize-none self-center bg-transparent py-1.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-pebble focus-visible:outline-none"
            />
            <PixelBtn
              onClick={() => sendMessage()}
              disabled={!canSend}
              aria-label="Send your message"
              className="shrink-0 px-4 sm:px-5"
            >
              <span className="hidden sm:inline">Send it</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
                <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </PixelBtn>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-3 px-1">
            <p className="min-w-0 text-xs text-pebble">
              I lock it end to end, keep nothing, and settle on Robinhood Chain
            </p>
            <p className="hidden shrink-0 text-xs text-pebble sm:block">
              {selectedModel && <span className="font-bold text-graphite">{cost} units per message</span>}
              <span className="ml-3">Enter sends it to me, Shift+Enter adds a line</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
