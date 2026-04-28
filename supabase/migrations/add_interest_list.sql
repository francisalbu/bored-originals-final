-- ============================================================
-- Manifestação de Interesse
-- Aventuras que ainda não têm página nem reserva possível —
-- apenas recolha de interesse com nome + email.
-- ============================================================

-- 1. Novos campos na tabela adventures
ALTER TABLE adventures
  ADD COLUMN IF NOT EXISTS interest_only BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS teaser_date   TEXT;   -- ex: "Carnaval 2027", "Set. 2026", "Sem data"

-- 2. Tabela de registos de interesse
CREATE TABLE IF NOT EXISTS interest_list (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id     UUID REFERENCES adventures(id) ON DELETE SET NULL,
  adventure_title  TEXT NOT NULL,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT interest_email_format_chk
    CHECK (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_interest_adventure ON interest_list(adventure_id);
CREATE INDEX IF NOT EXISTS idx_interest_email     ON interest_list(email);

-- RLS
ALTER TABLE interest_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register interest"
  ON interest_list FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role reads interest_list"
  ON interest_list FOR SELECT USING (false);
