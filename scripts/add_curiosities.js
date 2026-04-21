/**
 * Script: add_curiosities.js
 * 
 * INSTRUÇÕES:
 * 1. Vai ao Supabase Dashboard → SQL Editor
 * 2. Cola e executa este SQL primeiro:
 *    ALTER TABLE adventures ADD COLUMN IF NOT EXISTS curiosities JSONB DEFAULT '[]';
 * 3. Depois corre este script: node scripts/add_curiosities.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const adventureCuriosities = [
  {
    index: 0, // Subida ao Pico
    curiosities: [
      {
        title: 'É literalmente uma montanha-ilha.',
        text: 'O Pico é o ponto mais alto de Portugal — 2351m. Mas mais curioso que isso: a ilha é basicamente a montanha. Estás literalmente a viver nas encostas de um vulcão activo. A última erupção foi em 1720 e os geólogos consideram-no dormente, não extinto.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico1.jpg'
      },
      {
        title: 'Vês ilhas do cume — e sentes o vulcão respirar.',
        text: 'Do cume, em dias limpos, vês o Faial, São Jorge, Graciosa e às vezes a Terceira. Na subida atravessas zonas climáticas diferentes — podes começar com 25°C e apanhar neve no topo no mesmo dia. A "Piquinho" ainda liberta fumarolas quentes: metes a mão nas rochas e estão mornas.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico2.jpeg'
      },
      {
        title: 'A vinha que chegou às cortes dos czares.',
        text: 'A vinha do Pico é Património Mundial da UNESCO — currais de pedra de lava negra construídos à mão durante séculos para proteger as videiras do vento atlântico. Visto de cima parece uma manta de retalhos geométrica impossível. O Verdelho daqui chegou a ser servido nas cortes russas no século XIX.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico3.jpg'
      }
    ]
  }
];

async function run() {
  let success = 0;
  let failed = 0;

  for (const { index, curiosities } of adventureCuriosities) {
    const { data, error } = await supabase
      .from('adventures')
      .update({ curiosities })
      .eq('index', index)
      .select('title, index');

    if (error) {
      console.error(`❌ index=${index}:`, error.message);
      failed++;
    } else {
      console.log(`✅ index=${index} (${data?.[0]?.title}): ${curiosities.length} curiosidades guardadas`);
      success++;
    }
  }

  console.log(`\nDone: ${success} ok, ${failed} erros`);
}

run();
