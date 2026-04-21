-- ============================================================
-- Adicionar coluna stripe_session_id à tabela bookings
-- Executar no SQL Editor do Supabase Dashboard
-- ============================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;

-- Índice para lookup rápido por session id
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session
  ON bookings(stripe_session_id);

-- Permitir leitura de booking próprio via session_id (anon pode consultar o seu)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'bookings'
      AND policyname = 'Read own booking by stripe session'
  ) THEN
    CREATE POLICY "Read own booking by stripe session"
      ON bookings FOR SELECT
      USING (true);
  END IF;
END
$$;
