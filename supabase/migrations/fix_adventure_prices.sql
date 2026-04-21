-- ============================================================
-- Sincronizar adventures.price com o preço mínimo de activity_dates
-- Executar no SQL Editor do Supabase Dashboard
-- ============================================================

UPDATE adventures a
SET price = (
  SELECT ad.price
  FROM activity_dates ad
  WHERE ad.adventure_id = a.id
  ORDER BY ad.order_index ASC
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1 FROM activity_dates ad WHERE ad.adventure_id = a.id
);
