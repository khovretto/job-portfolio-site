"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
};

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

  const state = error ? "failure" : busy ? "loading" : messages.length > 1 ? "success" : "default";

  return (
    <div className="surf demo-shell">
      <div className="two-pane">
        <div className="chat-pane">
          <div className="panel-header">
            <span className="dot live" />
            <span className="mono" style={{ color: "var(--ink-2)" }}>
              personal_ai / public-only
            </span>
            <span className="state-chips">
              {["default", "loading", "success", "empty", "failure"].map((item) => (
                <span key={item} className="chip" style={{ opacity: item === state ? 1 : 0.35 }}>
                  {item}
                </span>
              ))}
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
                failure / {error}
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
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                [
                  "chat api",
                  lastStatus === "error" ? "bad" : lastStatus === "idle" ? "ok" : "live",
                  lastStatus === "live"
                    ? "Open WebUI"
                    : lastStatus === "mock"
                      ? "mock fallback"
                      : "server route",
                ],
                ["knowledge", "ok", "public summary"],
                ["speech-in", "warn", "placeholder"],
                ["rate-limit", "ok", "per-IP"],
              ].map(([key, status, info]) => (
                <div key={key} className="status-row">
                  <span className={`dot ${status}`} />
                  <span className="mono" style={{ minWidth: 80 }}>
                    {key}
                  </span>
                  <span className="mono" style={{ color: "var(--ink-4)" }}>
                    {info}
                  </span>
                </div>
              ))}
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

function Bubble({ message, t }: { message: Message; t: Messages["demoAi"] }) {
  const isUser = message.role === "user";
  return (
    <div className={`bubble ${isUser ? "user" : "assistant"}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
        <span className="mono" style={{ color: "var(--ink-3)" }}>
          {isUser ? t.you : t.assistant}
        </span>
        {!isUser && message.confidence !== undefined ? (
          <span className="mono" style={{ color: "var(--ink-4)" }}>
            conf {message.confidence.toFixed(2)}
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink)", whiteSpace: "pre-wrap" }}>{message.text}</div>
      {!isUser && message.sources ? (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {message.model ? (
            <span className="chip" style={{ fontSize: 10 }}>
              model: {getAssistantModelLabel(message.model)}
            </span>
          ) : null}
          {message.status ? (
            <span className="chip" style={{ fontSize: 10 }}>
              status: {message.status}
            </span>
          ) : null}
          {message.sources.map((source) => (
            <span key={source} className="chip" style={{ fontSize: 10 }}>
              src: {source}
            </span>
          ))}
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
