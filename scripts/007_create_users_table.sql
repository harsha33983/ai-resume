-- Create users table for monolithic data storage (matching store-provider.tsx logic)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  resume jsonb,
  analysis jsonb,
  "skillGap" jsonb,
  resources jsonb,
  "mockTest" jsonb,
  evaluation jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table public.users enable row level security;

create policy "Users can view their own data" 
  on public.users for select 
  using (auth.uid() = id);

create policy "Users can insert their own data" 
  on public.users for insert 
  with check (auth.uid() = id);

create policy "Users can update their own data" 
  on public.users for update 
  using (auth.uid() = id);
