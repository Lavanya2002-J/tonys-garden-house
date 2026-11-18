-- Tony's Garden House: proposed Postgres / Supabase schema (Phase 1).
-- Not wired up yet; the prototype uses localStorage (src/lib/bookingStore.ts).

create extension if not exists btree_gist;

create table rooms (
  id            text primary key,              -- 'standard-double'
  name          text not null,
  beds          text not null,
  bathroom      text not null check (bathroom in ('shared', 'private')),
  air_con       boolean not null default false,
  capacity      int  not null check (capacity between 1 and 6),
  nightly_price numeric(10,2) not null,
  active        boolean not null default true
);

create table extras (
  id       text primary key,
  name     text not null,
  description text not null default '',
  price    numeric(10,2) not null,
  pricing  text not null check (pricing in ('per_person', 'per_unit_per_night', 'per_booking')),
  max_qty  int
);

create table bookings (
  ref            text primary key,             -- 'TGH-4K7Q'
  room_id        text not null references rooms(id),
  check_in       date not null,
  check_out      date not null,
  guests         int  not null check (guests > 0),
  source         text not null check (source in ('direct','booking_com','airbnb','hostelworld','walk_in')),
  status         text not null check (status in ('awaiting_payment','confirmed','cancelled')),
  payment_method text not null check (payment_method in ('bank_transfer','cash_on_arrival','paid_on_channel')),
  paid           boolean not null default false,
  total          numeric(10,2) not null,
  breakfast      boolean not null default false,
  extras         jsonb not null default '{}',
  guest_name     text not null,
  guest_whatsapp text,
  guest_email    text,
  guest_country  text,
  arrival_window text,
  note           text,
  created_at     timestamptz not null default now(),
  check (check_out > check_in),
  -- The database itself refuses two active bookings for one room on the same night.
  exclude using gist (room_id with =, daterange(check_in, check_out, '[)') with &&) where (status <> 'cancelled')
);

-- Nights closed by another channel's iCal feed, or by Tony.
create table blocks (
  id       text primary key,
  room_id  text not null references rooms(id),
  start_on date not null,
  end_on   date not null,
  source   text not null,
  label    text not null default '',
  check (end_on > start_on)
);

-- Each room's iCal URL on each channel, fetched by the Phase 2 sync job.
create table channel_calendars (
  room_id   text not null references rooms(id),
  source    text not null,
  ical_url  text not null,
  last_synced_at timestamptz,
  primary key (room_id, source)
);

-- Row level security: guests can only create bookings through a server function;
-- only Tony's account can read and update them.
alter table bookings enable row level security;
alter table blocks enable row level security;
