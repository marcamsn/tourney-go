-- Supabase schema for Club Tournament Webapp
-- Phase 1: Data Models

-- User table: Auth handled by Supabase Auth, but we can extend with profile info
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Club table
create table if not exists clubs (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    club_url text,
    club_logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Player table (linked to user and club)
create table if not exists players (
    id uuid primary key default gen_random_uuid(),
    name text,
    user_id uuid references profiles(id) on delete cascade,
    club_id uuid references clubs(id) on delete cascade,
    joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tournament table
create table if not exists tournaments (
    id uuid primary key default gen_random_uuid(),
    club_id uuid references clubs(id) on delete cascade,
    name text not null,
    description text,
    settings jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Team table (virtual, temporary for each match)
create table if not exists teams (
    id uuid primary key default gen_random_uuid(),
    tournament_id uuid references tournaments(id) on delete cascade,
    name text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Match table
create table if not exists matches (
    id uuid primary key default gen_random_uuid(),
    tournament_id uuid references tournaments(id) on delete cascade,
    round integer,
    scheduled_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Result table
create table if not exists results (
    id uuid primary key default gen_random_uuid(),
    match_id uuid references matches(id) on delete cascade,
    team_id uuid references teams(id) on delete cascade,
    player_id uuid references players(id) on delete cascade,
    points integer,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Team membership (many-to-many: players in teams per match)
create table if not exists team_members (
    id uuid primary key default gen_random_uuid(),
    team_id uuid references teams(id) on delete cascade,
    player_id uuid references players(id) on delete cascade,
    match_id uuid references matches(id) on delete cascade
);
