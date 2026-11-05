-- Run this SQL in your Supabase SQL Editor

create table if not exists habit_logs (
  id bigserial primary key,
  user_id text not null,
  date date not null,
  workout boolean default false,
  skincare_am boolean default false,
  skincare_pm boolean default false,
  dinner_730 boolean default false,
  no_phone_in_bed boolean default false,
  water_glasses integer default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table if not exists sleep_logs (
  id bigserial primary key,
  user_id text not null,
  date date not null,
  sleep_time text not null,
  wake_time text not null,
  quality integer check(quality between 1 and 5),
  notes text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table if not exists weight_logs (
  id bigserial primary key,
  user_id text not null,
  date date not null,
  weight numeric(5,2) not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table if not exists meal_logs (
  id bigserial primary key,
  user_id text not null,
  date date not null,
  breakfast text,
  lunch text,
  dinner text,
  snacks text,
  created_at timestamptz default now(),
  unique(user_id, date)
);

create table if not exists user_profile (
  id bigserial primary key,
  user_id text not null unique,
  height_cm numeric(5,2),
  start_weight numeric(5,2),
  goal_weight numeric(5,2),
  age integer,
  updated_at timestamptz default now()
);

-- Row Level Security: each row is visible only to the signed-in user who owns it
alter table habit_logs enable row level security;
alter table sleep_logs enable row level security;
alter table weight_logs enable row level security;
alter table meal_logs enable row level security;
alter table user_profile enable row level security;

create policy "owner only" on habit_logs for all to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy "owner only" on sleep_logs for all to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy "owner only" on weight_logs for all to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy "owner only" on meal_logs for all to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
create policy "owner only" on user_profile for all to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
