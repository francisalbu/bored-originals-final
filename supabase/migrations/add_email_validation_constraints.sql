-- ============================================================
-- Validação de formato de email (notify_list + waitlist)
-- Garante que novos registos tenham email com formato válido.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'waitlist_email_format_chk'
  ) THEN
    ALTER TABLE waitlist
      ADD CONSTRAINT waitlist_email_format_chk
      CHECK (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$')
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notify_list_email_format_chk'
  ) THEN
    ALTER TABLE notify_list
      ADD CONSTRAINT notify_list_email_format_chk
      CHECK (email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$')
      NOT VALID;
  END IF;
END $$;
