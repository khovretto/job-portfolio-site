create table if not exists cv_files (
  locale text primary key check (locale in ('en', 'ru')),
  filename text not null,
  content_type text not null default 'application/pdf',
  data bytea not null,
  size_bytes integer not null check (size_bytes > 0),
  updated_at timestamptz not null default now()
);
