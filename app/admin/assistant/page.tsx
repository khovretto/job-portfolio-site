import { updateAssistantConfigAction, resetAssistantConfigAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import {
  buildAssistantSystemPrompt,
  getAssistantConfig,
} from "@/lib/assistant-config";
import { formatDate } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

export default async function AssistantAdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const config = await getAssistantConfig();
  const combinedPrompt = buildAssistantSystemPrompt(config);
  const saved = params?.saved;
  const error = params?.error;

  return (
    <AdminShell>
      <section>
        <span className="mono">assistant</span>
        <h1 style={{ margin: "6px 0 10px", fontSize: 30 }}>Prompt and public context</h1>
        <p style={{ margin: "0 0 18px", color: "var(--ink-3)", maxWidth: 820 }}>
          These fields are loaded by <code>/api/chat</code> for every live assistant request.
          Keep the context public and anonymized; do not put secrets, private customer names, or
          unpublished personal details here.
        </p>

        {saved ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--ok)" }}>
            Assistant config saved{saved === "reset" ? " and reset to defaults" : ""}.
          </div>
        ) : null}
        {error ? (
          <div className="surf-2" style={{ marginBottom: 12, padding: 12, color: "var(--bad)" }}>
            Invalid config. System prompt must be 50-8000 characters; public context must be
            50-20000 characters.
          </div>
        ) : null}

        <form action={updateAssistantConfigAction} className="admin-form">
          <label className="admin-field">
            <span className="mono">system prompt</span>
            <textarea
              name="systemPrompt"
              className="form-input admin-textarea mono-input"
              rows={12}
              minLength={50}
              maxLength={8000}
              defaultValue={config.systemPrompt}
              required
            />
          </label>

          <label className="admin-field">
            <span className="mono">public context</span>
            <textarea
              name="publicContext"
              className="form-input admin-textarea mono-input"
              rows={18}
              minLength={50}
              maxLength={20000}
              defaultValue={config.publicContext}
              required
            />
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button className="btn primary" type="submit">
              Save assistant config
            </button>
            <span className="mono" style={{ color: "var(--ink-4)" }}>
              last updated: {config.updatedAt ? formatDate(config.updatedAt) : "default fallback"}
            </span>
          </div>
        </form>

        <form action={resetAssistantConfigAction} style={{ marginTop: 10 }}>
          <button className="btn" type="submit">
            Reset to defaults
          </button>
        </form>

        <details className="surf-2" style={{ marginTop: 18, padding: 14 }}>
          <summary className="mono" style={{ cursor: "pointer" }}>
            combined prompt preview
          </summary>
          <pre className="admin-prompt-preview">{combinedPrompt}</pre>
        </details>
      </section>
    </AdminShell>
  );
}
