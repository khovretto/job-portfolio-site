"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/components/event-tracker";
import { useMessages } from "@/lib/i18n/provider";
import type { Messages } from "@/lib/i18n/dictionaries";
import {
  ASSISTANT_MODEL_OPTIONS,
  DEFAULT_ASSISTANT_MODEL,
  type AssistantModelId,
  getAssistantModelLabel,
} from "@/lib/assistant-models";

type Message = {
  role: "assistant" | "user";
  text: string;
  sources?: string[];
  confidence?: number;
  model?: AssistantModelId;
  status?: string;
};

type ChatResponse = {
  answer: string;
  sources: string[];
  confidence: number;
  scope: string;
  mocked: boolean;
  model: AssistantModelId;
  status: string;
  latencyMs: number;
  rateLimit?: { remaining: number; resetAt: number; max: number };
};

type KnowledgeHealth = {
  reachable: boolean;
  status?: string | null;
  profileSlug?: string | null;
  allowedCollections?: string[];
  embeddingProvider?: string | null;
  embeddingModel?: string | null;
  dbOk?: boolean | null;
  qdrantOk?: boolean | null;
  vectorMismatchCount?: number | null;
};

type AssistantStatus = {
  knowledge: KnowledgeHealth;
  chatRateLimit: { max: number; windowMinutes: number };
};

function humanizeSource(raw: string) {
  const cleaned = raw.replace(/^(scope|assistant):/, "").replace(/[-_]/g, " ").trim();
  if (!cleaned) return raw;
  const titled = cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
  return titled.replace(/\bRag\b/g, "RAG");
}

export function DemoAI() {
  const m = useMessages();
  const t = m.demoAi;
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: t.initialMessage,
      sources: ["scope:public", "system"],
      confidence: 1,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] =
    useState<AssistantModelId>(DEFAULT_ASSISTANT_MODEL);
  const [lastStatus, setLastStatus] = useState<"idle" | "live" | "mock" | "error">("idle");
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; max: number } | null>(
    null,
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [assistantStatus, setAssistantStatus] = useState<AssistantStatus | null>(null);
  const [statusChecking, setStatusChecking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    setError(null);
    const history = messages
      .slice(1)
      .slice(-6)
      .map((message) => ({
        role: message.role,
        content: message.text,
      }));
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setBusy(true);
    trackEvent("chat_submit", { length: trimmed.length, model: selectedModel });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          model: selectedModel,
          history,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || t.errorFallback);
      }

      const body = (await response.json()) as ChatResponse;
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: body.answer,
          sources: body.sources,
          confidence: body.confidence,
          model: body.model,
          status: body.status,
        },
      ]);
      setLastStatus(body.mocked ? "mock" : "live");
      if (!body.mocked) setLastLatencyMs(body.latencyMs);
      if (body.rateLimit) {
        setRateLimitInfo({ remaining: body.rateLimit.remaining, max: body.rateLimit.max });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorFallback);
      setLastStatus("error");
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  async function fetchAssistantStatus() {
    setStatusChecking(true);
    try {
      const response = await fetch("/api/assistant-status");
      const body = (await response.json()) as AssistantStatus;
      setAssistantStatus(body);
    } catch {
      setAssistantStatus({
        knowledge: { reachable: false },
        chatRateLimit: { max: 20, windowMinutes: 60 },
      });
    } finally {
      setStatusChecking(false);
    }
  }

  function toggleIntegration(id: string) {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
    if (
      (id === "knowledge" || id === "rate-limit") &&
      !assistantStatus &&
      !statusChecking
    ) {
      void fetchAssistantStatus();
    }
  }

  const headerDotClass = error ? "bad" : busy ? "warn" : "ok";
  const headerStatusLabel = error ? t.statusErrorLabel : busy ? t.statusThinking : t.statusReady;

  const chatDotClass = lastStatus === "error" ? "bad" : lastStatus === "mock" ? "warn" : "ok";
  const chatInfo =
    lastStatus === "live"
      ? "Open WebUI"
      : lastStatus === "mock"
        ? "mock fallback"
        : lastStatus === "error"
          ? "unavailable"
          : "server route";

  const knowledge = assistantStatus?.knowledge ?? null;
  const knowledgeDotClass = knowledge === null ? "ok" : knowledge.reachable ? "ok" : "warn";
  const knowledgeInfo =
    knowledge === null
      ? "public summary"
      : knowledge.reachable
        ? knowledge.profileSlug || "career_public"
        : "unreachable";

  const rateLimitMax = assistantStatus?.chatRateLimit.max ?? 20;
  const rateLimitWindowMinutes = assistantStatus?.chatRateLimit.windowMinutes ?? 60;

  return (
    <div className="surf demo-shell">
      <div className="two-pane">
        <div className="chat-pane">
          <div className="panel-header">
            <span className={`dot ${headerDotClass}`} />
            <span className="mono" style={{ color: "var(--ink-2)" }}>
              personal_ai · mnemosyne
            </span>
            <span className="mono" style={{ marginLeft: "auto", color: "var(--ink-3)" }}>
              {headerStatusLabel}
            </span>
          </div>
          <div className="model-bar">
            <span className="mono">model</span>
            <div className="model-picker" aria-label="Assistant model">
              {ASSISTANT_MODEL_OPTIONS.map((model) => {
                const isActive = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`chip model-chip ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedModel(model.id)}
                    disabled={busy}
                    aria-pressed={isActive}
                  >
                    {model.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div ref={scrollRef} className="chat-log">
            {messages.map((message, index) => (
              <Bubble key={`${message.role}-${index}`} message={message} t={t} />
            ))}
            {busy ? <LoadingBubble t={t} /> : null}
            {error ? (
              <div className="surf-2" style={{ padding: 10, borderColor: "var(--bad)", color: "var(--bad)", fontSize: 13 }}>
                {t.statusErrorLabel} / {error}
              </div>
            ) : null}
          </div>
          <form onSubmit={submit} className="chat-form">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.inputPlaceholder}
              className="chat-input"
            />
            <button type="button" className="btn sm" disabled title={t.audio}>
              {t.audio}
            </button>
            <button type="submit" className="btn primary sm" disabled={busy || !input.trim()}>
              {busy ? "..." : t.send}
            </button>
          </form>
          <div className="suggestions">
            {t.suggestions.map((suggestion) => (
              <button key={suggestion} type="button" className="chip" onClick={() => void ask(suggestion)} disabled={busy}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="side-panel">
          <div>
            <span className="mono">{t.integrations}</span>
            <span className="mono" style={{ color: "var(--ink-4)", marginLeft: 8 }}>
              / {t.integrationsHint}
            </span>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              <IntegrationRow
                id="chat-api"
                label="chat api"
                dotClass={chatDotClass}
                info={chatInfo}
                expanded={!!expanded["chat-api"]}
                onToggle={() => toggleIntegration("chat-api")}
              >
                <p className="status-desc">{t.detailChatApi}</p>
                {lastLatencyMs !== null ? (
                  <div className="status-vars">
                    <span className="mono">
                      {t.detailChatApiLatency}: {lastLatencyMs}ms
                    </span>
                  </div>
                ) : null}
              </IntegrationRow>

              <IntegrationRow
                id="knowledge"
                label="knowledge"
                dotClass={knowledgeDotClass}
                info={knowledgeInfo}
                expanded={!!expanded.knowledge}
                onToggle={() => toggleIntegration("knowledge")}
              >
                <p className="status-desc">{t.detailKnowledge}</p>
                {statusChecking ? (
                  <div className="status-vars">
                    <span className="mono">{t.checking}</span>
                  </div>
                ) : knowledge ? (
                  <div className="status-vars">
                    {knowledge.reachable ? (
                      <>
                        <span className="mono">profile: {knowledge.profileSlug ?? "—"}</span>
                        <span className="mono">
                          collections: {(knowledge.allowedCollections ?? []).join(", ") || "—"}
                        </span>
                        <span className="mono">
                          embedder: {knowledge.embeddingProvider ?? "—"}/{knowledge.embeddingModel ?? "—"}
                        </span>
                        <span className="mono">
                          db: {knowledge.dbOk ? "ok" : "down"} · qdrant: {knowledge.qdrantOk ? "ok" : "down"}
                        </span>
                        {typeof knowledge.vectorMismatchCount === "number" ? (
                          <span className="mono">vector mismatches: {knowledge.vectorMismatchCount}</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="mono">{t.unreachable}</span>
                    )}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="chip"
                  style={{ alignSelf: "flex-start" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    void fetchAssistantStatus();
                  }}
                >
                  {t.recheck}
                </button>
              </IntegrationRow>

              <IntegrationRow
                id="speech-in"
                label="speech-in"
                dotClass="warn"
                info="planned"
                expanded={!!expanded["speech-in"]}
                onToggle={() => toggleIntegration("speech-in")}
              >
                <p className="status-desc">{t.detailSpeechIn}</p>
              </IntegrationRow>

              <IntegrationRow
                id="rate-limit"
                label="rate-limit"
                dotClass="ok"
                info="per-IP"
                expanded={!!expanded["rate-limit"]}
                onToggle={() => toggleIntegration("rate-limit")}
              >
                <p className="status-desc">{t.detailRateLimit}</p>
                <div className="status-vars">
                  <span className="mono">
                    {rateLimitMax} {t.rateLimitWindowSuffix}
                  </span>
                  {rateLimitInfo ? (
                    <span className="mono">
                      {rateLimitInfo.remaining} {t.rateLimitRemainingSuffix}
                    </span>
                  ) : (
                    <span className="mono">window: {rateLimitWindowMinutes}min</span>
                  )}
                </div>
              </IntegrationRow>
            </div>
          </div>
          <div>
            <span className="mono">{t.scopeLabel}</span>
            <p style={{ marginTop: 6, fontSize: 12.5, color: "var(--ink-3)" }}>
              {t.scopeText}
            </p>
          </div>
          <div style={{ marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: 10 }}>
            <span className="mono">{t.tryThis}</span>
            <ul style={{ margin: "6px 0 0", padding: "0 0 0 16px", color: "var(--ink-3)", fontSize: 12.5 }}>
              {t.tryThisItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationRow({
  id,
  label,
  dotClass,
  info,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  dotClass: string;
  info: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        className="status-row"
        aria-expanded={expanded}
        aria-controls={`integration-${id}`}
        onClick={onToggle}
      >
        <span className={`dot ${dotClass}`} />
        <span className="mono" style={{ minWidth: 80 }}>
          {label}
        </span>
        <span className="mono" style={{ color: "var(--ink-4)" }}>
          {info}
        </span>
        <span className="chev" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </button>
      {expanded ? (
        <div id={`integration-${id}`} className="status-detail">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Bubble({ message, t }: { message: Message; t: Messages["demoAi"] }) {
  const isUser = message.role === "user";
  const visibleSources = (message.sources || []).slice(0, 2);
  const extraSourceCount = (message.sources?.length || 0) - visibleSources.length;

  return (
    <div className={`bubble ${isUser ? "user" : "assistant"}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          {isUser ? t.you : t.assistant}
        </span>
        {!isUser && message.confidence !== undefined ? (
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            match {(message.confidence * 100).toFixed(0)}%
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink)", whiteSpace: "pre-wrap" }}>{message.text}</div>
      {!isUser && message.sources ? (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {message.model ? (
            <span className="chip tag-model" style={{ fontSize: 10 }}>
              model: {getAssistantModelLabel(message.model)}
            </span>
          ) : null}
          {message.status ? (
            <span className={`chip ${message.status === "live" ? "tag-grounded" : ""}`} style={{ fontSize: 10 }}>
              {message.status === "live" ? t.tagGroundedLive : t.tagDemoAnswer}
            </span>
          ) : null}
          {visibleSources.map((source) => (
            <span key={source} className="chip tag-source" style={{ fontSize: 10 }}>
              {humanizeSource(source)}
            </span>
          ))}
          {extraSourceCount > 0 ? (
            <span className="chip tag-source" style={{ fontSize: 10 }}>
              +{extraSourceCount}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function LoadingBubble({ t }: { t: Messages["demoAi"] }) {
  return (
    <div className="bubble assistant">
      <span className="mono" style={{ color: "var(--ink-3)" }}>
        {t.assistant}
      </span>
      <div style={{ marginTop: 6, color: "var(--ink-3)", fontSize: 13 }}>{t.loading}</div>
    </div>
  );
}
