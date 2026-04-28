// Marca aventuras como "Manifestação de Interesse" no Supabase
// Corre com: node scripts/set_interest_only.js

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const adventures = [
  { slug: 'ate-marrocos-de-4x4',        teaser_date: 'Carnaval 2027' },
  { slug: 'rally-pela-n2',              teaser_date: 'Sem data'      },
  { slug: 'conquista-as-montanhas',     teaser_date: 'Sem data'      },
  { slug: 'aldeias-historicas-de-mota', teaser_date: 'Set. 2026'     },
];

for (const { slug, teaser_date } of adventures) {
  const { data, error } = await supabase
    .from('adventures')
    .update({ interest_only: true, teaser_date })
    .eq('slug', slug)
    .select('title, interest_only, teaser_date')
    .single();

  if (error) console.error(`❌ ${slug}:`, error.message);
  else console.log(`✅ ${data.title} → interest_only, "${data.teaser_date}"`);
}
