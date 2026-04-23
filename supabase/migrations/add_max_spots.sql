-- Adiciona max_spots para preservar a capacidade original da edição
-- spots = lugares disponíveis em tempo real (decrementado por booking)
-- max_spots = capacidade total original

ALTER TABLE activity_dates ADD COLUMN IF NOT EXISTS max_spots INTEGER;

-- Preenche max_spots com o valor actual de spots (retroactivo)
UPDATE activity_dates SET max_spots = spots WHERE max_spots IS NULL;

-- Trigger: após UPDATE em spots, auto-actualiza o status
CREATE OR REPLACE FUNCTION sync_activity_date_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.spots <= 0 THEN
    NEW.status := 'esgotado';
  ELSIF NEW.spots <= 4 THEN
    NEW.status := 'apreencher';
  ELSE
    NEW.status := 'disponivel';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_date_status ON activity_dates;
CREATE TRIGGER trg_sync_date_status
  BEFORE UPDATE OF spots ON activity_dates
  FOR EACH ROW EXECUTE FUNCTION sync_activity_date_status();

-- Permite que o webhook (service role) actualize os spots
-- (já coberto pelo service role key — sem RLS para service role)
