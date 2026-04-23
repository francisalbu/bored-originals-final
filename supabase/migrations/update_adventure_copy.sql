-- ============================================================
-- Update adventure copy from CSV (headlines + descriptions)
-- ============================================================

-- 1. Subida ao Pico
UPDATE adventures SET
  tagline = 'O topo de Portugal está à tua espera.',
  description = 'O Pico tem 2351 metros e é o ponto mais alto de Portugal. Não é uma caminhada para iniciados — é uma escalada técnica, com passagens de lava vulcânica, neblina constante e temperaturas que mudam a cada 200 metros. No topo, quando acordas e as nuvens abrem, percebes que não há sítio no mundo igual a este.',
  location = 'Ilha do Pico, Açores'
WHERE slug = 'subida-ao-pico';

-- 2. Missão Sobrevivência
UPDATE adventures SET
  tagline = 'Aprende o básico. Esquece o resto.',
  description = 'Desafia-te a passar 24 horas na Natureza, com o mínimo. Aprende a fazer fogo, a encontrar água, a construir abrigo e a não entrar em pânico. Um instrutor de sobrevivência lidera a experiência.'
WHERE slug = 'sobreviver-24h';

-- 3. Costa Vicentina (descida-da-costa)
UPDATE adventures SET
  tagline = 'De norte a sul, pelo litoral mais selvagem de Portugal. A estrada acaba. A costa começa.',
  description = 'A Costa Vicentina é a costa mais selvagem da Europa Ocidental. Pedalamos entre dunas, falésias, praias sem nome e aldeias de pescadores. Fazemos este percurso de bicicleta, ao ritmo da costa atlântica, com paragens onde a vontade manda e noites em alojamentos locais escolhidos a dedo.',
  title = 'Costa Vicentina em Estado Puro',
  location = 'Sesimbra, Portugal'
WHERE slug = 'descida-da-costa';

-- 4. Sem Terra à Vista (a-vela-pelo-oceano)
UPDATE adventures SET
  tagline = 'Navega à vela pela Costa Alentejana, sem saber muito bem o que estás a fazer. É assim que começa.',
  description = 'Embarca sem destino fechado e deixa o Atlântico fazer o resto. Aprendes o básico da vela, segues com skipper experiente e dormes ao som da água a bater no casco. É liberdade, mas com alguma prudência técnica para não acabar em lenda.',
  title = 'Sem Terra à Vista',
  location = 'Sesimbra, Portugal'
WHERE slug = 'a-vela-pelo-oceano';

-- 5. Cabine no Meio do Nada
UPDATE adventures SET
  tagline = 'O silêncio também é um plano. Sem wifi. Sem pessoas. Só tu, a Natureza e os teus próprios pensamentos.',
  description = 'Uma cabine isolada no meio de coisa nenhuma: sem wifi, sem vizinhos, sem agenda. Fogueira, estrelas e silêncio total. O antídoto perfeito para o ruído da cidade.',
  location = 'Macinhata do Vouga'
WHERE slug = 'cabine-no-meio-do-nada';

-- 6. Aldeias Históricas de Mota
UPDATE adventures SET
  tagline = 'Percorre as aldeias mais históricas de Portugal em 50cc de puro charme e história.',
  description = 'Percorre as aldeias históricas de scooter, ao teu ritmo e sem a pose habitual das rotas turísticas. Castelos, ruelas, miradouros e paragens inesperadas, com um virtual guide a abrir caminho para o que interessa. É uma viagem lenta, mas com personalidade.',
  location = 'Aldeias Históricas, Portugal'
WHERE slug = 'aldeias-historicas-de-mota';

-- 7. Rally de Velharias, pela N2
UPDATE adventures SET
  tagline = 'Carros a cair aos bocados, sem GPS, caos total. Vais conseguir? Provavelmente não.',
  description = 'Atravessa Portugal de norte a sul pela N2 em carros com mais de 20 anos, sem GPS e com um mapa de papel como se isso ainda fosse perfeitamente normal. Há avarias, desvios e imprevistos. Faz parte. O objetivo não é chegar depressa — é chegar com história.',
  title = 'Rally de Velharias, pela N2'
WHERE slug = 'rally-pela-n2';

-- 8. Gerês Selvagem
UPDATE adventures SET
  tagline = 'Por caminhos que não aparecem no Google Maps.',
  description = 'Trilhos fora das rotas marcadas no único parque nacional de Portugal. Cascatas escondidas, floresta primária, silêncio absoluto. Só botas, mochila e instinto.',
  title = 'Gerês Selvagem'
WHERE slug = 'trilhos-selvagens-no-geres';

-- 9. Caminhos de Santiago a Correr
UPDATE adventures SET
  tagline = 'O Caminho de Santiago, mas sem muito tempo para filosofar. Só pernas e asfalto.',
  description = 'Os últimos 40 km do Caminho Português, mas em versão corrida. Três dias de trail running, granito, estrada e pernas a negociar com a cabeça. Menos contemplação, mais ritmo. Ainda assim, o caminho continua lá — só que com outro tipo de conversa.'
WHERE slug = 'caminhos-de-santiago-a-correr';

-- 10. Até Marrocos de 4x4
UPDATE adventures SET
  tagline = 'Saímos de Portugal e voltamos com areia no carro. Atravessa o estreito e mergulha no deserto. Bússola obrigatória, medo opcional.',
  description = 'Lisboa, Gibraltar, Marrocos, deserto e regresso. Atravessa-se o estreito em 4x4, entra-se nas medinas, dorme-se em tendas berberes e segue-se até onde a estrada já não parece estrada. No fim, o carro volta mais cansado do que tu — o que diz muito.'
WHERE slug = 'ate-marrocos-de-4x4';

-- 11. Conquista as Montanhas
UPDATE adventures SET
  tagline = 'Altitude, técnica e nenhum conforto garantido.',
  description = 'Via ferrata, rappel e canyoning na Serra da Estrela para quem quer subir o nível sem dramatizar demasiado. O percurso é técnico, a paisagem é brutal e o guia trata do resto. Não é só adrenalina: é um encontro muito direto com a montanha.'
WHERE slug = 'conquista-as-montanhas';

-- 12. Três Dias de Mar (conquista-as-ondas)
UPDATE adventures SET
  tagline = 'Primeiro sobrevives, depois surfas.',
  description = 'Uma experiência de surf intensiva para quem quer começar do zero ou finalmente apanhar forma. Três dias entre técnica, água fria, quedas dignas e pequenas vitórias que sabem bem. Não é sobre parecer surfista. É sobre ganhar o direito a estar ali.',
  title = 'Três Dias de Mar'
WHERE slug = 'conquista-as-ondas';

-- 13. Nova Rota do Contrabando (nova entrada — coming soon, sem copy ainda)
INSERT INTO adventures (
  slug, index, title, location, tagline, description,
  coming_soon, is_active, price, duration, difficulty, max_people,
  highlights, includes, not_includes, packing_list,
  curiosities, hero_image, card_image
)
SELECT
  'nova-rota-do-contrabando',
  12,
  'Nova Rota do Contrabando',
  'Portugal',
  'Em breve.',
  'Em breve.',
  true, true,
  'TBD', 'TBD', 'TBD', 10,
  '[]', '[]', '[]', '[]',
  '[]', '', ''
WHERE NOT EXISTS (
  SELECT 1 FROM adventures WHERE slug = 'nova-rota-do-contrabando'
);
