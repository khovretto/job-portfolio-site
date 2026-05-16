alter table chat_requests
  add column if not exists model text not null default 'mock',
  add column if not exists status text not null default 'mock',
  add column if not exists latency_ms integer;

create index if not exists chat_requests_model_created_at_idx
  on chat_requests(model, created_at desc);

create index if not exists chat_requests_status_created_at_idx
  on chat_requests(status, created_at desc);
