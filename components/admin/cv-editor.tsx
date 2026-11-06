"use client";

import { useEffect, useState, type ReactNode } from "react";
import { saveCvDocumentAction } from "@/app/admin/actions";
import type { CvContent } from "@/lib/cv/schema";
import type { Locale } from "@/lib/i18n/config";

type ListKey = "contacts" | "experience" | "projects" | "skills" | "education" | "languages";

const blank: { [K in ListKey]: CvContent[K][number] } = {
  contacts: { label: "", url: "" },
  experience: { role: "", company: "", url: "", period: "", bullets: [] },
  projects: { name: "", url: "", period: "", description: "", bullets: [] },
  skills: { group: "", items: "" },
  education: { institution: "", degree: "", period: "" },
  languages: { name: "", level: "" },
};

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="cv-field">
      <span className="mono">{label}</span>
      {multiline ? (
        <textarea className="form-input" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="form-input" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export function CvEditor({ locale, initial }: { locale: Locale; initial: CvContent }) {
  const [cv, setCv] = useState(initial);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(next: CvContent) {
    setCv(next);
    setDirty(true);
  }

  function setField<K extends keyof CvContent>(key: K, value: CvContent[K]) {
    update({ ...cv, [key]: value });
  }

  function List<K extends ListKey>({
    listKey,
    title,
    addLabel,
    render,
  }: {
    listKey: K;
    title: string;
    addLabel: string;
    render: (item: CvContent[K][number], patch: (value: Partial<CvContent[K][number]>) => void) => ReactNode;
  }) {
    const items = cv[listKey] as CvContent[K][number][];
    const write = (next: CvContent[K][number][]) => setField(listKey, next as CvContent[K]);

    return (
      <fieldset className="surf cv-group">
        <legend className="mono">{title}</legend>
        {items.map((item, index) => (
          <div key={index} className="surf-2 cv-item">
            <div className="cv-item-tools">
              <button
                type="button"
                className="btn sm"
                disabled={index === 0}
                aria-label="Move up"
                onClick={() => {
                  const next = [...items];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  write(next);
                }}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn sm"
                disabled={index === items.length - 1}
                aria-label="Move down"
                onClick={() => {
                  const next = [...items];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  write(next);
                }}
              >
                ↓
              </button>
              <button type="button" className="btn sm" onClick={() => write(items.filter((_, i) => i !== index))}>
                Remove
              </button>
            </div>
            {render(item, (value) => write(items.map((current, i) => (i === index ? { ...current, ...value } : current))))}
          </div>
        ))}
        <button type="button" className="btn sm" onClick={() => write([...items, blank[listKey] as CvContent[K][number]])}>
          + {addLabel}
        </button>
      </fieldset>
    );
  }

  return (
    <form action={saveCvDocumentAction} className="cv-editor" onSubmit={() => setDirty(false)}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="content" value={JSON.stringify(cv)} />

      <div className="cv-actions">
        <button className="btn" type="submit" name="intent" value="draft">
          Save and preview
        </button>
        <button className="btn primary" type="submit" name="intent" value="publish">
          Save and publish
        </button>
        {dirty ? <span className="mono" style={{ color: "var(--warn)" }}>unsaved changes</span> : null}
      </div>

      <fieldset className="surf cv-group">
        <legend className="mono">Header</legend>
        <div className="cv-row">
          <Field label="Name" value={cv.name} onChange={(value) => setField("name", value)} />
          <Field label="Headline" value={cv.headline} onChange={(value) => setField("headline", value)} />
        </div>
        <Field label="Location and availability" value={cv.location} onChange={(value) => setField("location", value)} />
        <Field label="Summary" value={cv.summary} multiline rows={5} onChange={(value) => setField("summary", value)} />
      </fieldset>

      {List({
        listKey: "contacts",
        title: "Contacts",
        addLabel: "Add contact",
        render: (item, patch) => (
          <div className="cv-row">
            <Field label="Text" value={item.label} onChange={(label) => patch({ label })} />
            <Field label="Link" value={item.url} onChange={(url) => patch({ url })} />
          </div>
        ),
      })}

      {List({
        listKey: "experience",
        title: "Experience",
        addLabel: "Add job",
        render: (item, patch) => (
          <>
            <div className="cv-row">
              <Field label="Role" value={item.role} onChange={(role) => patch({ role })} />
              <Field label="Period" value={item.period} onChange={(period) => patch({ period })} />
            </div>
            <div className="cv-row">
              <Field label="Company" value={item.company} onChange={(company) => patch({ company })} />
              <Field label="Company link" value={item.url} onChange={(url) => patch({ url })} />
            </div>
            <Field
              label="Achievements, one per line"
              value={item.bullets.join("\n")}
              multiline
              rows={8}
              onChange={(value) => patch({ bullets: value.split("\n") })}
            />
          </>
        ),
      })}

      {List({
        listKey: "projects",
        title: "Projects",
        addLabel: "Add project",
        render: (item, patch) => (
          <>
            <div className="cv-row">
              <Field label="Name" value={item.name} onChange={(name) => patch({ name })} />
              <Field label="Period" value={item.period} onChange={(period) => patch({ period })} />
            </div>
            <Field label="Link" value={item.url} onChange={(url) => patch({ url })} />
            <Field
              label="Description"
              value={item.description}
              multiline
              rows={3}
              onChange={(description) => patch({ description })}
            />
            <Field
              label="Highlights, one per line"
              value={item.bullets.join("\n")}
              multiline
              rows={4}
              onChange={(value) => patch({ bullets: value.split("\n") })}
            />
          </>
        ),
      })}

      {List({
        listKey: "skills",
        title: "Skills",
        addLabel: "Add group",
        render: (item, patch) => (
          <div className="cv-row">
            <Field label="Group" value={item.group} onChange={(group) => patch({ group })} />
            <Field label="Items" value={item.items} onChange={(items) => patch({ items })} />
          </div>
        ),
      })}

      {List({
        listKey: "education",
        title: "Education",
        addLabel: "Add education",
        render: (item, patch) => (
          <>
            <div className="cv-row">
              <Field label="Institution" value={item.institution} onChange={(institution) => patch({ institution })} />
              <Field label="Period" value={item.period} onChange={(period) => patch({ period })} />
            </div>
            <Field label="Degree" value={item.degree} onChange={(degree) => patch({ degree })} />
          </>
        ),
      })}

      {List({
        listKey: "languages",
        title: "Languages",
        addLabel: "Add language",
        render: (item, patch) => (
          <div className="cv-row">
            <Field label="Language" value={item.name} onChange={(name) => patch({ name })} />
            <Field label="Level" value={item.level} onChange={(level) => patch({ level })} />
          </div>
        ),
      })}
    </form>
  );
}
