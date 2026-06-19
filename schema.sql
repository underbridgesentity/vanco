-- ============================================================
-- Vanco platform - Neon/Postgres schema.
-- Run once in the Neon SQL editor (or `psql $DATABASE_URL -f schema.sql`).
-- Safe to re-run: every statement is IF NOT EXISTS.
-- ============================================================

create table if not exists submissions (
  id          uuid primary key default gen_random_uuid(),
  artist      text not null,
  track       text not null,
  genre       text,
  email       text not null,
  label       text,
  link        text,
  msg         text,
  status      text not null default 'New',
  created_at  timestamptz not null default now()
);

create table if not exists bookings (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  org         text,
  event       text,
  event_date  date,
  city        text,
  venue       text,
  type        text,
  budget      text,
  msg         text,
  status      text not null default 'New',
  created_at  timestamptz not null default now()
);

create table if not exists guest_requests (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null,
  name        text not null,
  email       text not null,
  instagram   text,
  guests      int  not null default 1,
  msg         text,
  status      text not null default 'Pending',
  created_at  timestamptz not null default now()
);

create table if not exists events (
  id          text primary key,
  event_date  date not null,
  city        text not null,
  country     text,
  venue       text not null,
  region      text,
  status      text not null default 'Tickets',
  tickets     text,
  cap         int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text not null,
  country     text,
  interests   text[] not null default '{}',
  tier        text not null default 'Free',
  created_at  timestamptz not null default now()
);

create index if not exists submissions_created_idx   on submissions (created_at desc);
create index if not exists bookings_created_idx       on bookings (created_at desc);
create index if not exists guest_requests_created_idx on guest_requests (created_at desc);
create index if not exists guest_requests_event_idx   on guest_requests (event_id);
create index if not exists subscribers_created_idx    on subscribers (created_at desc);
create index if not exists events_date_idx            on events (event_date);
