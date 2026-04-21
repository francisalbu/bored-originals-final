-- ============================================================
-- BORED ORIGINALS — Schema Supabase
-- ============================================================

-- Tabela principal: adventures
CREATE TABLE IF NOT EXISTS adventures (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug                      TEXT UNIQUE NOT NULL,
  index                     INTEGER NOT NULL, -- ordem original (0-11)

  -- Informação básica
  title                     TEXT NOT NULL,
  location                  TEXT NOT NULL,
  tagline                   TEXT,
  description               TEXT,
  duration                  TEXT,
  difficulty                TEXT,
  price                     TEXT,
  max_people                INTEGER DEFAULT 10,
  coming_soon               BOOLEAN DEFAULT false,

  -- Imagens
  hero_image                TEXT,
  hero_video                TEXT,
  card_image                TEXT, -- imagem usada no card da lista principal
  hover_video               TEXT, -- video no hover do card

  -- Conteúdo
  highlights                JSONB DEFAULT '[]', -- array de URLs de imagens de destaque
  includes                  JSONB DEFAULT '[]', -- [{icon, label, detail}]
  not_includes              JSONB DEFAULT '[]', -- array de strings
  packing_list              JSONB DEFAULT '[]', -- array de strings
  digital_detox             TEXT,
  cancellations             TEXT,

  -- Review em destaque
  review_text               TEXT,
  review_author             TEXT,
  review_role               TEXT,
  review_image              TEXT,

  -- Curiosidades (3 factos sobre o destino/actividade)
  curiosities               JSONB DEFAULT '[]', -- [{title, text, image}]

  -- Status
  is_active                 BOOLEAN DEFAULT true,
  featured                  BOOLEAN DEFAULT false,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: itinerary (dias do programa)
CREATE TABLE IF NOT EXISTS itinerary (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id              UUID REFERENCES adventures(id) ON DELETE CASCADE,
  day_label                 TEXT NOT NULL,  -- ex: "Dia 1"
  title                     TEXT NOT NULL,
  description               TEXT,
  order_index               INTEGER NOT NULL,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: faqs
CREATE TABLE IF NOT EXISTS faqs (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id              UUID REFERENCES adventures(id) ON DELETE CASCADE,
  question                  TEXT NOT NULL,
  answer                    TEXT NOT NULL,
  order_index               INTEGER NOT NULL,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: activity_dates (datas e disponibilidade)
CREATE TABLE IF NOT EXISTS activity_dates (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id              UUID REFERENCES adventures(id) ON DELETE CASCADE,
  date_range                TEXT NOT NULL,  -- ex: "18 Jul — 20 Jul 2026"
  status                    TEXT NOT NULL DEFAULT 'disponivel', -- disponivel | apreencher | esgotado
  spots                     INTEGER NOT NULL DEFAULT 0,
  price                     TEXT NOT NULL,
  order_index               INTEGER NOT NULL,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: activity_spots (o que vais ver / destinos)
CREATE TABLE IF NOT EXISTS activity_spots (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id              UUID REFERENCES adventures(id) ON DELETE CASCADE,
  name                      TEXT NOT NULL,
  description               TEXT,
  image                     TEXT,
  order_index               INTEGER NOT NULL,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: bookings (reservas)
CREATE TABLE IF NOT EXISTS bookings (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id              UUID REFERENCES adventures(id),
  activity_date_id          UUID REFERENCES activity_dates(id),

  -- Dados do cliente
  customer_name             TEXT NOT NULL,
  customer_email            TEXT NOT NULL,
  customer_phone            TEXT,
  customer_country          TEXT,
  num_people                INTEGER DEFAULT 1,
  special_requests          TEXT,

  -- Preço e pagamento
  total_price               DECIMAL(10,2),
  deposit_paid              BOOLEAN DEFAULT false,
  payment_status            TEXT DEFAULT 'pending', -- pending | deposit_paid | paid | refunded
  payment_method            TEXT,

  -- Status da reserva
  status                    TEXT DEFAULT 'pending', -- pending | confirmed | cancelled | completed
  internal_notes            TEXT,

  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at              TIMESTAMP WITH TIME ZONE,
  cancelled_at              TIMESTAMP WITH TIME ZONE
);

-- Tabela: notify_list (lista de espera / avisa-me)
CREATE TABLE IF NOT EXISTS notify_list (
  id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_title           TEXT NOT NULL,
  email                     TEXT NOT NULL,
  created_at                TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_adventures_slug       ON adventures(slug);
CREATE INDEX IF NOT EXISTS idx_adventures_index      ON adventures(index);
CREATE INDEX IF NOT EXISTS idx_adventures_active     ON adventures(is_active);
CREATE INDEX IF NOT EXISTS idx_itinerary_adventure   ON itinerary(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_adventure        ON faqs(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_dates_adventure       ON activity_dates(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_spots_adventure       ON activity_spots(adventure_id, order_index);
CREATE INDEX IF NOT EXISTS idx_bookings_adventure    ON bookings(adventure_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status       ON bookings(status);

-- ============================================================
-- TRIGGER updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_adventures_updated_at
  BEFORE UPDATE ON adventures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE adventures      ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary       ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_dates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_spots  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE notify_list     ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Public read adventures"     ON adventures     FOR SELECT USING (is_active = true);
CREATE POLICY "Public read itinerary"      ON itinerary      FOR SELECT USING (true);
CREATE POLICY "Public read faqs"           ON faqs           FOR SELECT USING (true);
CREATE POLICY "Public read dates"          ON activity_dates FOR SELECT USING (true);
CREATE POLICY "Public read spots"          ON activity_spots FOR SELECT USING (true);

-- Escrita pública (bookings e notify)
CREATE POLICY "Anyone can book"            ON bookings       FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can join notify"     ON notify_list    FOR INSERT WITH CHECK (true);
