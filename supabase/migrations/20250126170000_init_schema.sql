create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id),
  telegram_id bigint unique not null,
  username text,
  full_name text not null,
  business_name text,
  specialty text[],
  working_hours jsonb,
  buffer_minutes integer default 15,
  stripe_customer_id text unique,
  subscription_tier text default 'free',
  subscription_status text,
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  master_id uuid references profiles(id) on delete cascade,
  name text not null,
  phone text,
  telegram_username text,
  notes jsonb,
  created_at timestamptz default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  master_id uuid references profiles(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  service_type text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  price numeric(10, 2),
  status text default 'confirmed',
  notes text,
  created_at timestamptz default now()
);

create index if not exists clients_master_id_idx on clients(master_id);
create index if not exists appointments_master_id_idx on appointments(master_id);
create index if not exists appointments_start_time_idx on appointments(start_time);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table appointments enable row level security;

create policy "Users can access own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Masters access own clients"
  on clients for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

create policy "Masters access own appointments"
  on appointments for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

create policy "Free tier users limited to 30 clients"
  on clients for insert
  with check (
    (select subscription_tier from profiles where id = auth.uid()) <> 'free'
    or (select count(*) from clients where master_id = auth.uid()) < 30
  );
