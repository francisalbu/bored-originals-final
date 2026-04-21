import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BASE = 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals';

const picoGallery = [
  `${BASE}/pico4.jpg`,
  `${BASE}/picoHQ2.jpeg`,
  `${BASE}/reviewpico2.jpg`,
  `${BASE}/reviewpico3.jpeg`,
  `${BASE}/reviewpico4.jpg`,
  `${BASE}/reviewpico5.jpeg`,
  `${BASE}/reviewpico6.jpeg`,
  `${BASE}/reviewpico7.jpg`,
  `${BASE}/reviewpico8.jpeg`,
];

// Update the Pico adventure
const { data, error } = await supabase
  .from('adventures')
  .update({ gallery_images: picoGallery })
  .eq('index', 0)
  .select('index, title, gallery_images');

if (error) {
  console.error('Error updating:', error.message);
  console.log('\n⚠️  The column may not exist yet. Run this SQL in Supabase Dashboard > SQL Editor:');
  console.log('ALTER TABLE adventures ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT \'[]\';');
} else {
  console.log('✅ Gallery images updated for:', data?.[0]?.title);
  console.log('   Photos:', data?.[0]?.gallery_images?.length);
}
