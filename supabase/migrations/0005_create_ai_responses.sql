-- Create table for storing AI responses
create table if not exists public.ai_responses (
  id uuid not null default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  prompt text not null,
  response text not null,
  category text,
  token_usage jsonb,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.ai_responses enable row level security;

-- Policies
-- Allow users to view their own responses
create policy "Users can view their own ai responses"
  on public.ai_responses for select
  using (auth.uid() = user_id);

-- Allow users (service role/backend) to insert
-- Since we are inserting from the backend (API route), 
-- if we use service_role key, we bypass RLS. 
-- However, if we use authenticated client, we need insert policy.
create policy "Users can insert their own ai responses"
  on public.ai_responses for insert
  with check (auth.uid() = user_id);
