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

-- Enable Row Level Security (open policy since we use anonymous user IDs)
alter table habit_logs enable row level security;
alter table sleep_logs enable row level security;
alter table weight_logs enable row level security;
alter table meal_logs enable row level security;
alter table user_profile enable row level security;

create policy "allow all" on habit_logs for all using (true) with check (true);
create policy "allow all" on sleep_logs for all using (true) with check (true);
create policy "allow all" on weight_logs for all using (true) with check (true);
create policy "allow all" on meal_logs for all using (true) with check (true);
create policy "allow all" on user_profile for all using (true) with check (true);
