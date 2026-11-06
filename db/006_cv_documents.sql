-- Editable CV content per language. A published PDF is written to cv_files,
-- so /api/cv serves built and uploaded CVs the same way.
create table if not exists cv_documents (
  locale text primary key check (locale in ('en', 'ru')),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
