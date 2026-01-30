-- Add provider column to ai_responses
alter table public.ai_responses 
add column if not exists provider text;

-- Optional: Comment on column
comment on column public.ai_responses.provider is 'The AI provider used (e.g. google, groq)';
