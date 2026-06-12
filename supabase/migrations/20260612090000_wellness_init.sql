-- AI Wellness Journal — initial schema
--
-- IMPORTANT: this Supabase project is SHARED with a live production app
-- (tables: playbooks, items, comments, playbook_likes, subscriptions, usage).
-- Everything for this app is namespaced with the `wellness_` prefix and this
-- migration touches ONLY wellness_* objects. Do not modify any other tables.

-- ---------------------------------------------------------------------------
-- wellness_entries: one row per logged symptom entry
-- ---------------------------------------------------------------------------
create table if not exists public.wellness_entries (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	date date not null default current_date,
	symptoms text[] not null default '{}',
	severity smallint not null check (severity between 1 and 8),
	notes text not null default '',
	ai_summary text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index if not exists wellness_entries_user_date_idx
	on public.wellness_entries (user_id, date desc);

-- ---------------------------------------------------------------------------
-- wellness_reports: saved AI-generated doctor reports
-- ---------------------------------------------------------------------------
create table if not exists public.wellness_reports (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	period_start date not null,
	period_end date not null,
	analysis jsonb not null,
	created_at timestamptz not null default now()
);

create index if not exists wellness_reports_user_idx
	on public.wellness_reports (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger (namespaced function to avoid colliding with the
-- production app's helpers)
-- ---------------------------------------------------------------------------
create or replace function public.wellness_set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists wellness_entries_set_updated_at on public.wellness_entries;
create trigger wellness_entries_set_updated_at
	before update on public.wellness_entries
	for each row execute function public.wellness_set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: users can only see and modify their own rows
-- ---------------------------------------------------------------------------
alter table public.wellness_entries enable row level security;
alter table public.wellness_reports enable row level security;

create policy "wellness_entries_select_own"
	on public.wellness_entries for select
	using (auth.uid() = user_id);

create policy "wellness_entries_insert_own"
	on public.wellness_entries for insert
	with check (auth.uid() = user_id);

create policy "wellness_entries_update_own"
	on public.wellness_entries for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "wellness_entries_delete_own"
	on public.wellness_entries for delete
	using (auth.uid() = user_id);

create policy "wellness_reports_select_own"
	on public.wellness_reports for select
	using (auth.uid() = user_id);

create policy "wellness_reports_insert_own"
	on public.wellness_reports for insert
	with check (auth.uid() = user_id);

create policy "wellness_reports_delete_own"
	on public.wellness_reports for delete
	using (auth.uid() = user_id);
