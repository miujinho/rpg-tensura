-- Supabase minimal schema for rpg-tensura

-- Table for masters (optional metadata)
create table if not exists masters (
  id uuid primary key default gen_random_uuid(),
  name text,
  notes text
);

-- Table for players (optional metadata)
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text,
  notes text
);

-- Codes that allow access. role: 'master' or 'player'. target_id: uuid of the master/player.
create table if not exists codes (
  code text primary key,
  role text not null,
  target_id uuid not null,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Example insert (replace target_id with real ones after creating masters/players):
-- insert into codes (code, role, target_id) values ('EXAMPLE-CODE-1234', 'player', '00000000-0000-0000-0000-000000000000');
