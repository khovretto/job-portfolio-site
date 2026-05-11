create table if not exists admin_users (
  id bigserial primary key,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key,
  admin_user_id bigint not null references admin_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_admin_user_id_idx on sessions(admin_user_id);
create index if not exists sessions_expires_at_idx on sessions(expires_at);

create table if not exists events (
  id bigserial primary key,
  type text not null,
  path text not null default '',
  referrer text not null default '',
  user_agent text not null default '',
  ip_hash text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_type_created_at_idx on events(type, created_at desc);
create index if not exists events_created_at_idx on events(created_at desc);

create table if not exists chat_requests (
  id bigserial primary key,
  question text not null,
  answer text not null,
  sources text[] not null default '{}',
  confidence numeric(4, 3) not null default 0,
  scope text not null default 'public',
  mocked boolean not null default true,
  user_agent text not null default '',
  ip_hash text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists chat_requests_created_at_idx on chat_requests(created_at desc);

create table if not exists audit_runs (
  id bigserial primary key,
  url text not null,
  host text not null,
  company_provided boolean not null default false,
  email_provided boolean not null default false,
  pages integer,
  tokens integer,
  estimated_cost numeric(10, 2),
  eta text,
  confidence numeric(4, 3),
  status text not null default 'estimated',
  user_agent text not null default '',
  ip_hash text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_runs_created_at_idx on audit_runs(created_at desc);

create table if not exists error_logs (
  id bigserial primary key,
  message text not null,
  path text not null default '',
  user_agent text not null default '',
  ip_hash text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists error_logs_created_at_idx on error_logs(created_at desc);
