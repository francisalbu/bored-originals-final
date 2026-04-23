-- ============================================================
-- Tabela: waitlist
-- Guarda emails de pessoas que querem ser avisadas quando
-- abrir um lugar numa data específica de uma aventura.
-- ============================================================

CREATE TABLE IF NOT EXISTS waitlist (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_date_id  UUID REFERENCES activity_dates(id) ON DELETE CASCADE,
  adventure_id      UUID REFERENCES adventures(id) ON DELETE CASCADE,
  email             TEXT NOT NULL,
  notified          BOOLEAN DEFAULT false,      -- marcado quando enviamos aviso
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- índices
CREATE INDEX IF NOT EXISTS idx_waitlist_date   ON waitlist(activity_date_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email  ON waitlist(email);

-- RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- qualquer pessoa pode entrar na lista
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT WITH CHECK (true);

-- leitura apenas pelo service role (admin / webhook)
CREATE POLICY "Service role reads waitlist"
  ON waitlist FOR SELECT USING (false);
