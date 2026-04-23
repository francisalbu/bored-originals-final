-- ============================================================
-- Tabela: newsletter_subscribers
-- Guarda os emails subscritos na newsletter da Bored Originals.
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  source      TEXT DEFAULT 'website',          -- de onde veio a subscrição
  active      BOOLEAN DEFAULT true,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT newsletter_email_format_chk
    CHECK (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$')
);

-- índice para lookups rápidos por email
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- qualquer pessoa pode subscrever
CREATE POLICY "Anyone can subscribe newsletter"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- leitura só pelo service role (admin)
CREATE POLICY "Service role reads newsletter"
  ON newsletter_subscribers FOR SELECT USING (false);
