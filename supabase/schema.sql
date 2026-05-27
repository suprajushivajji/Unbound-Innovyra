-- Innovyra (MVP) — Supabase Postgres schema
-- Apply in Supabase SQL Editor.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.skill_level as enum ('Beginner','Intermediate','Advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum ('to_learn','in_progress','completed','revision','interview_prep');
exception when duplicate_object then null; end $$;

-- Core tables
create table if not exists public.career_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  career_goal text not null,
  preferred_domain text not null,
  skill_level public.skill_level not null,
  timeline_months int not null check (timeline_months between 1 and 24),
  weekly_hours int not null check (weekly_hours between 1 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_research (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  career_goal_id uuid references public.career_goals(id) on delete set null,
  provider text not null default 'openrouter',
  model text,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  career_goal_id uuid references public.career_goals(id) on delete cascade,
  title text not null default 'Roadmap',
  weeks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  description text,
  status public.task_status not null default 'to_learn',
  due_date timestamptz,
  order_index int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_status_idx on public.tasks(status);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  description text,
  target_date timestamptz,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  description text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  status text not null default 'idea',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  day date not null default current_date,
  completion_pct int,
  learning_streak_days int,
  productivity_score int,
  created_at timestamptz not null default now(),
  unique(user_id, day)
);

-- updated_at triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$ begin
  create trigger career_goals_updated_at
  before update on public.career_goals
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger roadmaps_updated_at
  before update on public.roadmaps
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- Row Level Security (RLS)
alter table public.career_goals enable row level security;
alter table public.ai_research enable row level security;
alter table public.roadmaps enable row level security;
alter table public.tasks enable row level security;
alter table public.milestones enable row level security;
alter table public.projects enable row level security;
alter table public.analytics enable row level security;

-- Policies: user can CRUD their own rows
do $$ begin
  create policy "career_goals_own" on public.career_goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "ai_research_own" on public.ai_research
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "roadmaps_own" on public.roadmaps
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "tasks_own" on public.tasks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "milestones_own" on public.milestones
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "projects_own" on public.projects
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "analytics_own" on public.analytics
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
exception when duplicate_object then null; end $$;

