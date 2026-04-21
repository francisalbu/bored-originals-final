// ============================================================
// BORED ORIGINALS — Script de Seed para Supabase
// ============================================================
// Corre com: node scripts/seed.js
// Precisa de: npm install @supabase/supabase-js dotenv
// Cria um ficheiro .env com:
//   SUPABASE_URL=https://xxx.supabase.co
//   SUPABASE_SERVICE_KEY=eyJ...
// ============================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Falta SUPABASE_URL ou SUPABASE_SERVICE_KEY no ficheiro .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================
// DADOS DAS 12 AVENTURAS
// ============================================================

const BASE = 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals';

const adventures = [
  // ─── 0 ─── SUBIDA AO PICO ───────────────────────────────────
  {
    slug: 'subida-ao-pico',
    index: 0,
    title: 'Subida ao Pico',
    location: 'Açores, Ilha do Pico',
    tagline: 'O topo de Portugal está à tua espera.',
    description: 'O Pico tem 2351 metros e é o ponto mais alto de Portugal. Não é uma caminhada para iniciados — é uma escalada técnica, com passagens de lava vulcânica, neblina constante e temperaturas que mudam a cada 200 metros. Mas no topo, quando as nuvens abrem, vês os outros vulcões dos Açores à tua volta e percebes que não há sítio no mundo igual a este.',
    duration: '3 dias · 2 noites',
    difficulty: 'Difícil',
    price: '349€',
    max_people: 10,
    coming_soon: false,
    hero_image: `${BASE}/1.png`,
    hero_video: `${BASE}/vulcaovideo.mp4`,
    card_image: `${BASE}/1.png`,
    hover_video: `${BASE}/vulcaovideo.mp4`,
    highlights: [`${BASE}/1.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🏔️', label: 'Guia de montanha certificado', detail: 'Guia experiente com certificação IFMGA e mais de 100 subidas ao Pico.' },
      { icon: '⛺', label: 'Alojamento 2 noites', detail: 'Casa rural no sopé do vulcão, com vista para a caldeira.' },
      { icon: '🍽️', label: 'Todas as refeições incluídas', detail: 'Pequenos-almoços, almoços de campo e jantares em conjunto.' },
      { icon: '🎒', label: 'Equipamento técnico', detail: 'Bastões, gamashas e kit de segurança. Trazes apenas as botas.' },
      { icon: '📸', label: 'Fotógrafo na subida', detail: 'Registo profissional da expedição. Ficheiros digitais entregues em 7 dias.' },
      { icon: '🚐', label: 'Transferes locais', detail: 'Transportes entre o alojamento e o ponto de partida da subida.' },
    ],
    not_includes: [
      'Voo para a ilha do Pico',
      'Seguro de viagem pessoal (recomendado)',
      'Botas de trekking (lista detalhada enviada após reserva)',
      'Bebidas alcoólicas',
    ],
    packing_list: [
      'Botas de trekking impermeáveis (obrigatório)',
      'Mochila de 20-30L',
      'Casaco de lã ou softshell',
      'Impermeável leve',
      'Luvas e gorro (mesmo no verão)',
      'Lanterna frontal com pilhas extra',
      'Camadas base de merino ou sintético (2x)',
      'Bastões de trekking (fornecidos ou teus)',
      'Protetor solar SPF50+',
      '1.5L de água (pontos de reabastecimento limitados)',
    ],
    digital_detox: 'Nesta expedição pedimos que deixes o telemóvel no bolso durante a subida. Não há cobertura acima de certa altitude de qualquer forma — e é exactamente aí que as melhores conversas acontecem. O fotógrafo regista tudo. Tu podes simplesmente estar presente.',
    cancellations: 'Cancelamento gratuito até 30 dias antes da partida. Entre 30 e 15 dias, devolução de 50% do valor pago. Menos de 15 dias, sem reembolso — mas podes ceder o teu lugar a outra pessoa sem custo adicional. Cancelamento por condições meteorológicas: nova data oferecida ou reembolso total.',
    review_text: 'Cheguei ao topo às 4h da manhã com as pernas a tremer e lágrimas nos olhos. Nunca me senti tão pequeno e tão poderoso ao mesmo tempo. Obrigado, Bored.',
    review_author: 'Miguel R.',
    review_role: 'Participante, Outubro 2024',
    review_image: `${BASE}/1.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e aclimatação', description: 'Chegada ao aeroporto de Pico. Transfer para o alojamento, briefing completo com o guia, reconhecimento do terreno e jantar de boas-vindas. Dormir cedo — a subida começa antes do sol.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Subida ao cume', description: 'Partida às 2h da madrugada. A subida demora entre 5 e 7 horas dependendo do ritmo. O objectivo é estar no topo ao nascer do sol. Descida na manhã, almoço no topo ou no regresso, tarde livre para recuperar.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Explorar o Pico & regresso', description: 'Manhã livre para explorar a ilha — adegas centenárias, lagoas vulcânicas, costa de lava negra. Almoço em conjunto. Transfer para o aeroporto.', order_index: 2 },
    ],
    faqs: [
      { question: 'Qual o nível de condição física necessário?', answer: 'Médio-alto. Deves ser capaz de caminhar 6+ horas com 1200m de desnível positivo. Não é necessária experiência técnica de escalada, mas é exigente.', order_index: 0 },
      { question: 'Qual a melhor época para subir?', answer: 'Maio a Outubro. O inverno tem condições instáveis e a subida pode ser encerrada pelas autoridades. A nossa expedição acontece apenas em meses favoráveis.', order_index: 1 },
      { question: 'E se o tempo não permitir a subida?', answer: 'Se as condições meteorológicas impedirem a subida, temos sempre um plano B com actividades alternativas na ilha. Reembolso parcial ou nova data em caso de cancelamento por mau tempo.', order_index: 2 },
      { question: 'Quantas pessoas por expedição?', answer: 'Máximo 10. Grupos pequenos garantem mais atenção, ritmo personalizado e uma experiência muito mais autentica.', order_index: 3 },
    ],
    dates: [
      { date_range: '18 Jul — 20 Jul 2026', status: 'disponivel', spots: 3, price: '349€', order_index: 0 },
      { date_range: '8 Ago — 10 Ago 2026', status: 'apreencher', spots: 4, price: '349€', order_index: 1 },
      { date_range: '5 Set — 7 Set 2026', status: 'disponivel', spots: 8, price: '349€', order_index: 2 },
    ],
    spots: [
      { name: 'Cume do Pico', description: 'O ponto mais alto de Portugal. Vista para todas as ilhas num dia limpo.', image: `${BASE}/1.png`, order_index: 0 },
      { name: 'Caldeira Negra', description: 'Uma cratera vulcânica de tirar o fôlego no interior da ilha.', image: `${BASE}/12.png`, order_index: 1 },
      { name: 'Adega do Pico', description: 'Vinhas centenárias classificadas pela UNESCO numa paisagem única no mundo.', image: `${BASE}/2.png`, order_index: 2 },
      { name: 'Furnas do Enxofre', description: 'Fumarolas e sulfurosas num cenário de outro planeta.', image: `${BASE}/9.png`, order_index: 3 },
    ],
  },

  // ─── 1 ─── DESCIDA DA COSTA ─────────────────────────────────
  {
    slug: 'descida-da-costa',
    index: 2,
    title: 'Descida da Costa',
    location: 'Costa Vicentina',
    tagline: 'De norte a sul, pelo litoral mais selvagem de Portugal.',
    description: 'A Costa Vicentina é a costa mais selvagem da Europa Ocidental. Dunas, falésias, praias sem nome, aldeias de pescadores. Fazemos este percurso de bicicleta, ao ritmo da costa atlântica, com paragens onde a vontade manda e noites em alojamentos locais escolhidos a dedo.',
    duration: '4 dias · 3 noites',
    difficulty: 'Moderado',
    price: '299€',
    max_people: 12,
    coming_soon: false,
    hero_image: `${BASE}/2.png`,
    hero_video: null,
    card_image: `${BASE}/2.png`,
    hover_video: null,
    highlights: [`${BASE}/2.png`, `${BASE}/13.png`, `${BASE}/9.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🚴', label: 'Bicicleta de trail', detail: 'Bicicleta de qualidade, ajustada antes da partida. Capacete incluído.' },
      { icon: '🏠', label: 'Alojamento 3 noites', detail: 'Alojamentos locais selecionados, com carácter e conforto.' },
      { icon: '🍽️', label: 'Pequenos-almoços e jantares', detail: 'Almoços na estrada à tua escolha — tens sugestões no guia.' },
      { icon: '🗺️', label: 'Guia digital da rota', detail: 'App com GPX, pontos de interesse, paragens recomendadas e segredos locais.' },
      { icon: '🚐', label: 'Transfer de regresso', detail: 'No final do percurso, regresso ao ponto de partida incluído.' },
    ],
    not_includes: [
      'Transporte até ao ponto de partida',
      'Almoços ao longo do percurso',
      'Equipamento pessoal de ciclismo',
    ],
    packing_list: [
      'Roupa de ciclismo (2 sets)',
      'Calções e t-shirts para as noites',
      'Protetor solar',
      'Óculos de sol',
      'Garrafa de água',
      'Snacks para a estrada',
    ],
    digital_detox: 'A estrada é o detox. Quando estás a pedalar pela costa com o vento na cara, o telemóvel torna-se irrelevante naturalmente.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Quatro dias a pedalar pela costa mais bonita que já vi. Cada paragem era melhor que a anterior. Volto com certeza.',
    review_author: 'Ana P.',
    review_role: 'Participante, Setembro 2024',
    review_image: `${BASE}/2.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Porto Covo → Vila Nova de Milfontes', description: 'Ponto de encontro em Porto Covo. Entrega das bicicletas e briefing. Primeiro troço pela costa, com paragem na Praia do Malhão.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Vila Nova → Zambujeira do Mar', description: 'O troço mais selvagem. Falésias altas, praias desertas, muito vento. Almoço numa das praias sem nome.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Zambujeira → Odeceixe', description: 'Troço mais curto mas mais técnico. Tarde livre em Odeceixe.', order_index: 2 },
      { day_label: 'Dia 4', title: 'Odeceixe → Sagres', description: 'Grande final até ao Cabo de São Vicente, o ponto mais sudoeste da Europa.', order_index: 3 },
    ],
    faqs: [
      { question: 'Preciso de experiência em ciclismo?', answer: 'Não é necessária experiência técnica, mas deves estar confortável a pedalar 40-60km por dia em terreno variado.', order_index: 0 },
      { question: 'As bicicletas são elétricas?', answer: 'Não. São bicicletas de trail convencionais. Se preferires elétrica, contacta-nos antes da reserva — pode ser arranjada com custo adicional.', order_index: 1 },
    ],
    dates: [
      { date_range: '1 Ago — 4 Ago 2026', status: 'disponivel', spots: 5, price: '299€', order_index: 0 },
      { date_range: '12 Set — 15 Set 2026', status: 'disponivel', spots: 10, price: '299€', order_index: 1 },
    ],
    spots: [
      { name: 'Praia do Amado', description: 'A praia mais selvagem do Alentejo. Ondas perfeitas, sem multidões.', image: `${BASE}/2.png`, order_index: 0 },
      { name: 'Cabo de São Vicente', description: 'O fim do mundo. Literalmente o ponto mais sudoeste da Europa.', image: `${BASE}/13.png`, order_index: 1 },
      { name: 'Zambujeira do Mar', description: 'Falésia alta, praia escondida, silêncio absoluto.', image: `${BASE}/3.png`, order_index: 2 },
      { name: 'Porto Covo', description: 'Vila de pescadores com casas caiadas e o melhor peixe da costa.', image: `${BASE}/6.png`, order_index: 3 },
    ],
  },

  // ─── 2 ─── À VELA PELO OCEANO ───────────────────────────────
  {
    slug: 'a-vela-pelo-oceano',
    index: 3,
    title: 'À Vela pelo Oceano',
    location: 'Atlântico, Cascais',
    tagline: 'Navega em alto mar sem saber muito bem o que estás a fazer. É assim que começa.',
    description: 'Navega em alto mar sob as instruções de um skipper experiente. Sem destino fixo, sem relógio, apenas o vento e o Atlântico. Aprende as manobras básicas de vela e dorme ao som das ondas.',
    duration: '3 dias · 2 noites',
    difficulty: 'Moderado',
    price: '399€',
    max_people: 10,
    coming_soon: true,
    hero_image: `${BASE}/3.png`,
    hero_video: null,
    card_image: `${BASE}/3.png`,
    hover_video: null,
    highlights: [`${BASE}/3.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/2.png`],
    includes: [
      { icon: '⛵', label: 'Barco e skipper', detail: 'Veleiro equipado com skipper experiente incluído.' },
      { icon: '🏠', label: 'Alojamento a bordo', detail: '2 noites no barco, ao som do oceano.' },
      { icon: '🍽️', label: 'Refeições a bordo', detail: 'Pequenos-almoços e jantares preparados em conjunto.' },
      { icon: '🛡️', label: 'Seguro de viagem', detail: 'Cobertura completa durante a expedição.' },
    ],
    not_includes: ['Transporte até Cascais', 'Refeições em terra', 'Despesas pessoais'],
    packing_list: [
      'Roupa leve (várias camadas)',
      'Impermeável',
      'Sapatos de borracha ou vela',
      'Protetor solar',
      'Medicamento anti-enjoo (recomendado)',
      'Saco de cama leve',
    ],
    digital_detox: 'No meio do oceano, a internet perde o sentido. Damos-te a experiência de estar verdadeiramente presente — sem notificações, sem feeds. Só horizonte.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'A melhor decisão que tomei este ano. Dormir no barco com o som do oceano é inesquecível.',
    review_author: 'João F.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/3.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e briefing', description: 'Encontro com o grupo, apresentação do barco e briefing de segurança. Primeira refeição em conjunto e saída ao fim da tarde.', order_index: 0 },
      { day_label: 'Dia 2', title: 'O oceano é nosso', description: 'Dia completo em alto mar. Aprendes a velejar, a ler o vento, a confiar no barco. Ancoramos numa baía para almoço.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Regresso', description: 'Últimas horas a vela, regresso a Cascais. Partilha de histórias e despedida.', order_index: 2 },
    ],
    faqs: [
      { question: 'Preciso de experiência em vela?', answer: 'Não. O skipper ensina tudo. Tens apenas de ter vontade de aprender.', order_index: 0 },
      { question: 'E se me enjoar?', answer: 'É normal no início. Recomendamos medicação preventiva. A maioria das pessoas adapta-se rapidamente.', order_index: 1 },
    ],
    dates: [
      { date_range: '22 Ago — 24 Ago 2026', status: 'disponivel', spots: 6, price: '399€', order_index: 0 },
      { date_range: '10 Out — 12 Out 2026', status: 'apreencher', spots: 2, price: '399€', order_index: 1 },
    ],
    spots: [
      { name: 'Oceano Atlântico', description: 'Horizonte sem fim e liberdade total.', image: `${BASE}/3.png`, order_index: 0 },
      { name: 'Cascais', description: 'Partida e chegada na vila mais elegante do litoral.', image: `${BASE}/2.png`, order_index: 1 },
    ],
  },

  // ─── 3 ─── CABINE NO MEIO DO NADA ───────────────────────────
  {
    slug: 'cabine-no-meio-do-nada',
    index: 4,
    title: 'Cabine no Meio do Nada',
    location: 'Interior de Portugal',
    tagline: 'Sem wifi. Sem pessoas. Só tu, os javalis e os teus próprios pensamentos.',
    description: 'Uma cabine isolada no meio do monte, sem wifi, sem vizinhos, sem agenda. Fogueira, estrelas e silêncio total. O antídoto perfeito para o ruído da cidade.',
    duration: '2 dias · 1 noite',
    difficulty: 'Fácil',
    price: '149€',
    max_people: 4,
    coming_soon: true,
    hero_image: `${BASE}/4.png`,
    hero_video: null,
    card_image: `${BASE}/4.png`,
    hover_video: null,
    highlights: [`${BASE}/4.png`, `${BASE}/9.png`, `${BASE}/5.png`, `${BASE}/12.png`],
    includes: [
      { icon: '🏕️', label: 'Cabine isolada 1 noite', detail: 'Cabine privada com cama, fogueira exterior e vista para o nada.' },
      { icon: '🪵', label: 'Lenha e kit de fogueira', detail: 'Tudo o que precisas para uma noite perfeita a olhar para o fogo.' },
      { icon: '🍳', label: 'Cabaz de refeições', detail: 'Ingredientes locais para cozinhares à tua maneira.' },
      { icon: '🛡️', label: 'Seguro de viagem', detail: 'Cobertura completa durante a estadia.' },
    ],
    not_includes: ['Transporte até à cabine', 'Bebidas alcoólicas', 'Despesas pessoais'],
    packing_list: [
      'Roupa quente (as noites são frias)',
      'Calçado de caminhada',
      'Lanterna',
      'Livro ou jogo de cartas',
      'Vontade de desligar',
    ],
    digital_detox: 'A cabine não tem wifi. De propósito. Sem notificações, sem feeds, sem trabalho. Só o silêncio do monte e o cheiro a lenha. É exatamente isso.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Precisava mesmo disto. 24h sem telemóvel e saí uma pessoa nova.',
    review_author: 'Sara M.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/4.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e instalação', description: 'Chegada à cabine, conhecer o espaço, acender a fogueira, cozinhar com o cabaz fornecido. Noite sob as estrelas.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Manhã livre & regresso', description: 'Pequeno-almoço, caminhada matinal pela zona, regresso ao ritmo da natureza.', order_index: 1 },
    ],
    faqs: [
      { question: 'A cabine tem eletricidade?', answer: 'Tem iluminação básica a solar. Não tem tomadas para carregar aparelhos. É esse o ponto.', order_index: 0 },
      { question: 'É seguro?', answer: 'Sim. A cabine está em propriedade privada vigiada. Tens contacto de emergência disponível 24h.', order_index: 1 },
    ],
    dates: [
      { date_range: '5 Jul — 6 Jul 2026', status: 'disponivel', spots: 8, price: '149€', order_index: 0 },
      { date_range: '2 Ago — 3 Ago 2026', status: 'disponivel', spots: 8, price: '149€', order_index: 1 },
    ],
    spots: [
      { name: 'Cabine isolada', description: 'O teu lar por uma noite, no meio do nada.', image: `${BASE}/4.png`, order_index: 0 },
      { name: 'Monte Alentejano', description: 'Silêncio, azul e horizonte infinito.', image: `${BASE}/9.png`, order_index: 1 },
    ],
  },

  // ─── 4 ─── SOBREVIVER 24H ────────────────────────────────────
  {
    slug: 'sobreviver-24h',
    index: 1,
    title: 'Sobreviver 24h',
    location: 'Serra, Portugal',
    tagline: 'Aprende a comer insetos, fazer fogo do nada e a não morrer no meio do bosque.',
    description: '24 horas na natureza com o mínimo. Aprende a fazer fogo, a encontrar água, a construir abrigo e a não entrar em pânico. Um instrutor de sobrevivência lidera a experiência.',
    duration: '1 dia · 1 noite',
    difficulty: 'Difícil',
    price: '180€',
    max_people: 8,
    coming_soon: true,
    hero_image: `${BASE}/5.png`,
    hero_video: `${BASE}/videosobrevivencia.mp4`,
    card_image: `${BASE}/5.png`,
    hover_video: null,
    highlights: [`${BASE}/5.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/4.png`],
    includes: [
      { icon: '🧭', label: 'Instrutor de sobrevivência', detail: 'Especialista em técnicas de sobrevivência selvagem certificado.' },
      { icon: '🔪', label: 'Kit de sobrevivência básico', detail: 'Faca, sílex, corda e kit de primeiros socorros.' },
      { icon: '🛡️', label: 'Seguro de acidentes', detail: 'Cobertura completa durante as 24 horas.' },
      { icon: '📋', label: 'Manual de sobrevivência', detail: 'Guia físico para levares para casa.' },
    ],
    not_includes: ['Transporte até ao local', 'Comida extra (o desafio é esse)', 'Saco cama (fornecido material básico)'],
    packing_list: [
      'Roupa resistente e em camadas',
      'Botas de trekking',
      'Impermeável',
      'Vontade real de sobreviver',
    ],
    digital_detox: 'As 24h de sobrevivência são o maior detox possível. Sem bateria, sem sinal, sem distrações. Só tu e a natureza. É assustador e libertador ao mesmo tempo.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Nunca pensei que conseguia. Mas consegui. E foi a coisa mais orgulhosa que já fiz.',
    review_author: 'Pedro A.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/5.png`,
    itinerary: [
      { day_label: 'Hora 0', title: 'Drop-off e briefing', description: 'Deixamos-te no ponto de partida com o teu kit mínimo. Briefing de segurança. A partir daqui, és tu.', order_index: 0 },
      { day_label: 'Dia 1', title: '24h de sobrevivência', description: 'Construção de abrigo, procura de água, técnicas de fogo, identificação de plantas comestíveis. O instrutor está perto mas não intervém.', order_index: 1 },
      { day_label: 'Hora 24', title: 'Extração e debriefing', description: 'Regresso ao ponto de encontro. Debriefing em grupo. Refeição quente. Celebração.', order_index: 2 },
    ],
    faqs: [
      { question: 'É perigoso?', answer: 'Há um instrutor sempre por perto em caso de emergência. O desafio é real mas a segurança está garantida.', order_index: 0 },
      { question: 'Posso desistir?', answer: 'Sim, em qualquer momento. Há um sistema de sinal de emergência disponível.', order_index: 1 },
    ],
    dates: [
      { date_range: '28 Mai — 29 Mai 2026', status: 'disponivel', spots: 8, price: '180€', order_index: 0 },
      { date_range: '24 Out — 25 Out 2026', status: 'apreencher', spots: 8, price: '180€', order_index: 1 },
    ],
    spots: [
      { name: 'Serra de Portugal', description: 'Terreno selvagem, denso e desafiante.', image: `${BASE}/5.png`, order_index: 0 },
      { name: 'Floresta densa', description: 'O teu campo de treino por 24 horas.', image: `${BASE}/9.png`, order_index: 1 },
    ],
  },

  // ─── 5 ─── ALDEIAS HISTÓRICAS DE MOTA ───────────────────────
  {
    slug: 'aldeias-historicas-de-mota',
    index: 5,
    title: 'Aldeias Históricas de Mota',
    location: 'Beira Interior',
    tagline: 'Percorre as aldeias mais históricas de Portugal em 50cc de puro terror e mecânica duvidosa.',
    description: 'Percorre as aldeias históricas de Portugal numa scooter de 50cc. Castelos, ruelas de pedra, miradouros de cortar a respiração. Ao teu ritmo, sem guia, com um virtual guide que te leva a todos os segredos.',
    duration: '3 dias · 2 noites',
    difficulty: 'Fácil',
    price: '199€',
    max_people: 12,
    coming_soon: false,
    hero_image: `${BASE}/6.png`,
    hero_video: null,
    card_image: `${BASE}/6.png`,
    hover_video: null,
    highlights: [`${BASE}/6.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🛵', label: 'Scooter 50cc', detail: 'Scooter fornecida, com capacete e seguro básico.' },
      { icon: '📱', label: 'Virtual guide app', detail: 'App com rota, segredos locais e sugestões de paragens.' },
      { icon: '🏠', label: 'Alojamento 2 noites', detail: 'Casa de aldeia selecionada com carácter local.' },
      { icon: '☕', label: 'Pequenos-almoços', detail: 'Pequenos-almoços incluídos nas casas de aldeia.' },
    ],
    not_includes: ['Combustível (custo mínimo, calculado por conta)', 'Almoços e jantares', 'Transporte até ao ponto de partida'],
    packing_list: [
      'Roupa confortável',
      'Calçado fechado (obrigatório para scooter)',
      'Câmara fotográfica',
      'Carteira com dinheiro para as aldeias',
    ],
    digital_detox: 'Ironia máxima: a aventura tem uma app. Mas a app existe para te libertar de estar a pesquisar no Google. A partir daí, o telemóvel fica no bolso e os olhos ficam na estrada.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Três dias perfeitos. A scooter, as aldeias e a liberdade total são uma combinação imbatível.',
    review_author: 'Catarina L.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/6.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Sortelhã e Monsanto', description: 'Partida com a scooter. Primeira paragem em Sortelha, aldeia medieval amuralhada. Tarde em Monsanto, a aldeia mais portuguesa de Portugal.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Idanha-a-Velha e Castelo Novo', description: 'Ruínas romanas, igrejas medievais, ruas de xisto. Almoço livre nas aldeias.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Piódão e regresso', description: 'A aldeia de xisto mais fotogénica de Portugal. Regresso ao ponto de partida ao fim da tarde.', order_index: 2 },
    ],
    faqs: [
      { question: 'Preciso de carta de condução?', answer: 'Sim, carta de condução de categoria AM ou superior.', order_index: 0 },
      { question: 'As scooters são novas?', answer: 'São scooters em bom estado de conservação, revistas antes de cada uso. Não são novas — faz parte do espírito da aventura.', order_index: 1 },
    ],
    dates: [
      { date_range: '18 Abr — 20 Abr 2026', status: 'disponivel', spots: 3, price: '199€', order_index: 0 },
      { date_range: '16 Mai — 18 Mai 2026', status: 'apreencher', spots: 2, price: '199€', order_index: 1 },
    ],
    spots: [
      { name: 'Sortelha', description: 'Aldeia medieval amuralhada e quase intacta.', image: `${BASE}/6.png`, order_index: 0 },
      { name: 'Monsanto', description: 'A aldeia mais portuguesa de Portugal, encrustada na rocha.', image: `${BASE}/9.png`, order_index: 1 },
      { name: 'Piódão', description: 'A aldeia de xisto mais fotogénica do país.', image: `${BASE}/12.png`, order_index: 2 },
    ],
  },

  // ─── 6 ─── RALLY PELA N2 ────────────────────────────────────
  {
    slug: 'rally-pela-n2',
    index: 6,
    title: 'Rally pela N2 Velharias',
    location: 'N2, Portugal',
    tagline: 'Carros a cair aos bocados, sem GPS, caos total. Vais conseguir? Provavelmente não.',
    description: 'A N2 tem 738km de norte a sul. Fazemo-la em carros com mais de 20 anos, sem GPS, com um mapa de papel. Avarias fazem parte. É um rally, não é um road trip.',
    duration: '4 dias · 3 noites',
    difficulty: 'Moderado',
    price: '249€',
    max_people: 20,
    coming_soon: false,
    hero_image: `${BASE}/8.png`,
    hero_video: null,
    card_image: `${BASE}/8.png`,
    hover_video: null,
    highlights: [`${BASE}/8.png`, `${BASE}/6.png`, `${BASE}/9.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🚗', label: 'Carro velharia', detail: 'Carro com mais de 20 anos, em condições de segurança verificadas.' },
      { icon: '🗺️', label: 'Mapa de papel', detail: 'Sem GPS. Sem Google Maps. É a regra.' },
      { icon: '🏠', label: 'Alojamento 3 noites', detail: 'Alojamentos ao longo da N2, escolhidos com critério.' },
      { icon: '🛠️', label: 'Apoio técnico', detail: 'Equipa de apoio em caso de avaria grave.' },
    ],
    not_includes: ['Combustível (por conta de cada equipa)', 'Multas de trânsito', 'Danos no veículo por negligência'],
    packing_list: [
      'Roupa casual (4 dias)',
      'Carta de condução',
      'Paciência para avarias',
      'Sentido de humor',
      'Câmara para os momentos épicos',
    ],
    digital_detox: 'Sem GPS, sem mapas digitais. A N2 pede-te que levantas os olhos do ecrã e que olhes para a estrada — e para a pessoa ao teu lado.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'O meu carro avariou 3 vezes. Foi a melhor aventura da minha vida. Já me inscrevi para o próximo.',
    review_author: 'Bruno S.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/8.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Chaves → Viseu', description: 'Partida de Chaves, ponto mais a norte da N2. Primeiro troço em Trás-os-Montes.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Viseu → Castelo Branco', description: 'Atravessamos a Beira Interior. Paisagens de serra, aldeias, história.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Castelo Branco → Évora', description: 'Entrada no Alentejo. Herdades, planície, o silêncio do interior.', order_index: 2 },
      { day_label: 'Dia 4', title: 'Évora → Faro', description: 'Grande final até ao Algarve. Chegada a Faro e celebração.', order_index: 3 },
    ],
    faqs: [
      { question: 'Preciso de saber mecânica?', answer: 'Não é obrigatório, mas é uma vantagem. A equipa de apoio está disponível para problemas graves.', order_index: 0 },
      { question: 'Os carros têm seguro?', answer: 'Sim, todos os veículos têm seguro obrigatório válido.', order_index: 1 },
    ],
    dates: [
      { date_range: '10 Mai — 13 Mai 2026', status: 'disponivel', spots: 7, price: '249€', order_index: 0 },
      { date_range: '14 Jun — 17 Jun 2026', status: 'disponivel', spots: 8, price: '249€', order_index: 1 },
    ],
    spots: [
      { name: 'Chaves', description: 'Ponto de partida no extremo norte da N2.', image: `${BASE}/8.png`, order_index: 0 },
      { name: 'Alentejo', description: 'Planície infinita, herdades e silêncio.', image: `${BASE}/9.png`, order_index: 1 },
      { name: 'Faro', description: 'A linha de chegada, no extremo sul.', image: `${BASE}/3.png`, order_index: 2 },
    ],
  },

  // ─── 7 ─── TRILHOS SELVAGENS NO GERÊS ───────────────────────
  {
    slug: 'trilhos-selvagens-no-geres',
    index: 7,
    title: 'Trilhos Selvagens no Gerês',
    location: 'Parque Nacional Peneda-Gerês',
    tagline: 'Caminhos que não aparecem no Google Maps. Só botas, mapa e instinto.',
    description: 'Trilhos fora das rotas marcadas no único parque nacional de Portugal. Cascatas escondidas, floresta primária, silêncio absoluto. Só botas, mochila e instinto.',
    duration: '2 dias · 1 noite',
    difficulty: 'Difícil',
    price: '179€',
    max_people: 10,
    coming_soon: true,
    hero_image: `${BASE}/9.png`,
    hero_video: null,
    card_image: `${BASE}/9.png`,
    hover_video: null,
    highlights: [`${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/5.png`, `${BASE}/1.png`],
    includes: [
      { icon: '🥾', label: 'Guia local especializado', detail: 'Conhecedor de todos os trilhos não marcados do Gerês.' },
      { icon: '🏕️', label: 'Acampamento selvagem 1 noite', detail: 'Noite em tendas no meio da floresta.' },
      { icon: '🍽️', label: 'Refeições de campo', detail: 'Almoço e jantar preparados no campo.' },
      { icon: '🛡️', label: 'Seguro de acidentes', detail: 'Cobertura completa durante a expedição.' },
    ],
    not_includes: ['Transporte até ao Gerês', 'Saco cama (podes alugar)', 'Despesas pessoais'],
    packing_list: [
      'Botas de trekking impermeáveis',
      'Mochila de 30-40L',
      'Saco cama (ou aluguer)',
      'Roupa em camadas',
      'Impermeável',
      'Filtro de água',
    ],
    digital_detox: 'No Gerês, o sinal de telemóvel desaparece naturalmente. Os trilhos que fazemos estão fora da cobertura. É a natureza a fazer o trabalho por nós.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Nunca vi o Gerês assim. Os trilhos que fizemos não existem no AllTrails — e é melhor assim.',
    review_author: 'Inês G.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/9.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Entrada na floresta', description: 'Briefing e entrada pelos trilhos não marcados. Cascatas escondidas, passagens de rio, acampamento ao fim da tarde.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Picos e regresso', description: 'Subida a miradouros secretos, descida por trilhos alternativos. Regresso ao ponto de partida ao fim da tarde.', order_index: 1 },
    ],
    faqs: [
      { question: 'Os trilhos são seguros?', answer: 'Sim, mas exigentes. O guia conhece cada trilho e tem experiência em situações de emergência.', order_index: 0 },
      { question: 'É permitido acampar no Gerês?', answer: 'Acampamos em zonas autorizadas com as devidas licenças. Respeitamos sempre as regras do parque nacional.', order_index: 1 },
    ],
    dates: [
      { date_range: '6 Jun — 7 Jun 2026', status: 'disponivel', spots: 6, price: '179€', order_index: 0 },
      { date_range: '4 Out — 5 Out 2026', status: 'disponivel', spots: 8, price: '179€', order_index: 1 },
    ],
    spots: [
      { name: 'Cascatas escondidas', description: 'Quedas de água que não aparecem em nenhum mapa.', image: `${BASE}/9.png`, order_index: 0 },
      { name: 'Floresta primária', description: 'O único parque nacional de Portugal na sua forma mais selvagem.', image: `${BASE}/12.png`, order_index: 1 },
    ],
  },

  // ─── 8 ─── CAMINHOS DE SANTIAGO A CORRER ────────────────────
  {
    slug: 'caminhos-de-santiago-a-correr',
    index: 8,
    title: 'Caminhos de Santiago a Correr',
    location: 'Caminho Português',
    tagline: 'O Caminho de Santiago, mas sem tempo para filosofar. Só pernas e asfalto.',
    description: 'O Caminho de Santiago a correr. Os últimos 120km do Caminho Português em 5 dias de trail running. Sem filosofia, com muito asfalto, granito e chuva.',
    duration: '5 dias · 4 noites',
    difficulty: 'Muito Difícil',
    price: '349€',
    max_people: 10,
    coming_soon: true,
    hero_image: `${BASE}/10.png`,
    hero_video: null,
    card_image: `${BASE}/10.png`,
    hover_video: null,
    highlights: [`${BASE}/10.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🏃', label: 'Guia de trail running', detail: 'Guia experiente no Caminho Português.' },
      { icon: '🏠', label: 'Alojamento 4 noites', detail: 'Albergues e casas de peregrinos ao longo do caminho.' },
      { icon: '🍽️', label: 'Refeições principais', detail: 'Pequenos-almoços e jantares incluídos.' },
      { icon: '🚐', label: 'Bagagem transferida', detail: 'A tua mochila grande vai à tua frente. Tu só carregas o essencial.' },
    ],
    not_includes: ['Transporte até ao ponto de partida', 'Almoços', 'Equipamento de corrida'],
    packing_list: [
      'Sapatilhas de trail running',
      'Meias de corrida (múltiplos pares)',
      'Roupa técnica de corrida',
      'Impermeável leve',
      'Bastões de trail (opcional)',
      'Kit de recuperação muscular',
    ],
    digital_detox: 'Correr 120km em 5 dias não deixa muito espaço para o telemóvel. O cansaço faz o trabalho de detox. O que fica é a clareza.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Parti os joelhos, a alma e o ego. E fiz os melhores amigos da minha vida em 5 dias.',
    review_author: 'Rui T.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/10.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Porto → Barcelos (~35km)', description: 'Partida do Porto. Primeiro troço pelos subúrbios, depois campos e aldeias.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Barcelos → Ponte de Lima (~35km)', description: 'O troço mais bonito. Pontes medievais, vinhas, rio Lima.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Ponte de Lima → Valença (~30km)', description: 'Subidas, descidas, a muralha de Valença ao fundo.', order_index: 2 },
      { day_label: 'Dia 4', title: 'Valença → Porriño (~25km)', description: 'Atravessamos a fronteira. Galiza começa aqui.', order_index: 3 },
      { day_label: 'Dia 5', title: 'Porriño → Santiago (~25km)', description: 'A chegada. Catedral, Compostela e lágrimas de exaustão.', order_index: 4 },
    ],
    faqs: [
      { question: 'Qual a distância mínima por dia?', answer: 'Entre 25 e 35km por dia. É necessário boa condição física e experiência em corrida.', order_index: 0 },
      { question: 'Preciso de ter corrido um caminho antes?', answer: 'Não, mas é recomendável preparação prévia de pelo menos 3 meses de corrida regular.', order_index: 1 },
    ],
    dates: [
      { date_range: '15 Mai — 19 Mai 2026', status: 'disponivel', spots: 5, price: '349€', order_index: 0 },
      { date_range: '3 Out — 7 Out 2026', status: 'disponivel', spots: 8, price: '349€', order_index: 1 },
    ],
    spots: [
      { name: 'Porto', description: 'Ponto de partida. A cidade que nos envia para o caminho.', image: `${BASE}/10.png`, order_index: 0 },
      { name: 'Ponte de Lima', description: 'A vila mais antiga de Portugal, no meio do caminho.', image: `${BASE}/9.png`, order_index: 1 },
      { name: 'Santiago de Compostela', description: 'A chegada. O fim. O início de tudo.', image: `${BASE}/12.png`, order_index: 2 },
    ],
  },

  // ─── 9 ─── ATÉ MARROCOS DE 4X4 ──────────────────────────────
  {
    slug: 'ate-marrocos-de-4x4',
    index: 9,
    title: 'Até Marrocos de 4x4',
    location: 'Portugal → Marrocos',
    tagline: 'Atravessa o estreito e mergulha no deserto. Bússola obrigatória, medo opcional.',
    description: 'Lisboa ao deserto do Saara em 4x4. Atravessamos o estreito de Gibraltar, mergulhamos nas medinas, dormimos em tendas berberes e voltamos com o carro cheio de areia e histórias.',
    duration: '10 dias · 9 noites',
    difficulty: 'Moderado',
    price: '1290€',
    max_people: 12,
    coming_soon: true,
    hero_image: `${BASE}/11.png`,
    hero_video: null,
    card_image: `${BASE}/11.png`,
    hover_video: null,
    highlights: [`${BASE}/11.png`, `${BASE}/9.png`, `${BASE}/12.png`, `${BASE}/3.png`],
    includes: [
      { icon: '🚙', label: '4x4 com motorista/guia', detail: 'Veículo 4x4 com guia local marroquino falante de português.' },
      { icon: '🏠', label: 'Alojamento 9 noites', detail: 'Riads nas medinas e tendas berberes no deserto.' },
      { icon: '🍽️', label: 'Refeições principais', detail: 'Tagines, cuscuz e chá de menta incluídos.' },
      { icon: '⛵', label: 'Ferry Gibraltar', detail: 'Travessia de barco incluída nos dois sentidos.' },
    ],
    not_includes: ['Voos para Lisboa', 'Combustível (incluído no preço do 4x4)', 'Vistos (cidadãos da UE não precisam)', 'Despesas pessoais em mercados'],
    packing_list: [
      'Roupa leve para o dia',
      'Roupa quente para as noites no deserto',
      'Protetor solar alto',
      'Óculos de sol',
      'Chapéu',
      'Vacinas em dia',
      'Cartão de débito/dinheiro em euros',
    ],
    digital_detox: 'No deserto do Saara, a internet é um conceito distante. Dormires debaixo das estrelas berberes com o silêncio do deserto à volta é o maior reset que existe.',
    cancellations: 'Cancelamento gratuito até 45 dias antes (expedição longa). Entre 45-20 dias, 50% de reembolso. Menos de 20 dias, sem reembolso.',
    review_text: '10 dias que mudaram a minha perspectiva sobre tudo. Portugal → Marrocos é uma viagem que toda a gente devia fazer.',
    review_author: 'Diana C.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/11.png`,
    itinerary: [
      { day_label: 'Dia 1-2', title: 'Lisboa → Gibraltar → Marrocos', description: 'Saída de Lisboa de carro. Chegada a Tarifa, ferry para Tânger. Primeira noite em Marrocos.', order_index: 0 },
      { day_label: 'Dia 3-4', title: 'Fez — a medina mais antiga', description: 'Dois dias perdidos na medina de Fez. Curtumes, souks, cheiro a especiarias.', order_index: 1 },
      { day_label: 'Dia 5-6', title: 'Deserto — Merzouga', description: 'Chegada ao deserto. Dromedários, dunas de laranja, noite em tenda berbere.', order_index: 2 },
      { day_label: 'Dia 7-8', title: 'Marraquexe', description: 'A cidade mais vibrante de Marrocos. Jemaa el-Fna, Souks, Palais Bahia.', order_index: 3 },
      { day_label: 'Dia 9-10', title: 'Regresso', description: 'Costa atlântica marroquina, Casablanca, ferry de regresso e drive até Lisboa.', order_index: 4 },
    ],
    faqs: [
      { question: 'É seguro viajar para Marrocos?', answer: 'Sim. Marrocos é um destino seguro para turistas. O nosso guia local conhece tudo e garante a vossa segurança.', order_index: 0 },
      { question: 'Preciso de visto?', answer: 'Cidadãos da UE não precisam de visto para Marrocos até 90 dias.', order_index: 1 },
    ],
    dates: [
      { date_range: '10 Out — 20 Out 2026', status: 'disponivel', spots: 4, price: '1290€', order_index: 0 },
    ],
    spots: [
      { name: 'Fez', description: 'A medina mais antiga e bem preservada do mundo.', image: `${BASE}/11.png`, order_index: 0 },
      { name: 'Deserto do Saara', description: 'Dunas de areia laranja, camelos e noites estreladas.', image: `${BASE}/9.png`, order_index: 1 },
      { name: 'Marraquexe', description: 'A cidade mais vibrante de Marrocos.', image: `${BASE}/12.png`, order_index: 2 },
    ],
  },

  // ─── 10 ─── CONQUISTA AS MONTANHAS ──────────────────────────
  {
    slug: 'conquista-as-montanhas',
    index: 10,
    title: 'Conquista as Montanhas',
    location: 'Serra da Estrela',
    tagline: 'Altitudes que tiram o fôlego. Literalmente. Traz casaco.',
    description: 'Via ferrata, rappel e canyoning na Serra da Estrela. Altitudes que tiram o fôlego. Literalmente. Guia técnico incluído.',
    duration: '2 dias · 1 noite',
    difficulty: 'Difícil',
    price: '229€',
    max_people: 8,
    coming_soon: true,
    hero_image: `${BASE}/12.png`,
    hero_video: null,
    card_image: `${BASE}/12.png`,
    hover_video: null,
    highlights: [`${BASE}/12.png`, `${BASE}/9.png`, `${BASE}/5.png`, `${BASE}/1.png`],
    includes: [
      { icon: '🧗', label: 'Guia técnico certificado', detail: 'Guia com certificação em via ferrata, rappel e canyoning.' },
      { icon: '🪢', label: 'Equipamento técnico completo', detail: 'Arnês, capacete, mosquetões, cordas. Tudo fornecido.' },
      { icon: '🏠', label: 'Alojamento 1 noite', detail: 'Casa de montanha na Serra da Estrela.' },
      { icon: '🍽️', label: 'Refeições incluídas', detail: 'Jantar e pequeno-almoço incluídos.' },
    ],
    not_includes: ['Transporte até à Serra da Estrela', 'Calçado técnico (lista enviada após reserva)', 'Despesas pessoais'],
    packing_list: [
      'Roupa técnica de montanha',
      'Calçado de trekking com tornozelo alto',
      'Roupa impermeável',
      'Luvas finas',
      'Protetor solar',
      'Snacks de energia',
    ],
    digital_detox: 'Quando estás suspenso numa via ferrata a 400 metros de altitude, o telemóvel é o último da tua lista de preocupações. É esse o ponto.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Tinha medo de alturas. Já não tenho. Simples assim.',
    review_author: 'Tomás N.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/12.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Via Ferrata & Rappel', description: 'Briefing de segurança e aquecimento. Primeira via ferrata de nível iniciado/intermédio. Rappel de 30 metros ao fim da tarde. Jantar na casa de montanha.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Canyoning & regresso', description: 'Canyoning numa das gargantas da Serra da Estrela. Saltos, rapel em cascata e muito frio de boa.', order_index: 1 },
    ],
    faqs: [
      { question: 'Preciso de experiência técnica?', answer: 'Não. O guia ensina todas as técnicas antes de cada atividade. O importante é não ter medo de tentar.', order_index: 0 },
      { question: 'Tem limite de idade?', answer: 'Mínimo 16 anos. Menores de 18 precisam de autorização dos pais.', order_index: 1 },
    ],
    dates: [
      { date_range: '28 Jun — 29 Jun 2026', status: 'disponivel', spots: 7, price: '229€', order_index: 0 },
      { date_range: '13 Set — 14 Set 2026', status: 'disponivel', spots: 8, price: '229€', order_index: 1 },
    ],
    spots: [
      { name: 'Via Ferrata da Estrela', description: 'Percursos metálicos nas rochas mais imponentes da Serra.', image: `${BASE}/12.png`, order_index: 0 },
      { name: 'Canyoning', description: 'Gargantas e cascatas no coração da Serra da Estrela.', image: `${BASE}/9.png`, order_index: 1 },
    ],
  },

  // ─── 11 ─── CONQUISTA AS ONDAS ──────────────────────────────
  {
    slug: 'conquista-as-ondas',
    index: 11,
    title: 'Conquista as Ondas',
    location: 'Costa Atlântica',
    tagline: 'Caminha até não conseguires mais e depois vai surfar. Porque não pode ser só sofrimento.',
    description: 'Aulas de surf intensivas com instrutores locais, nas melhores praias do litoral. Para quem nunca surfou ou quer melhorar. Do white water ao green wave em 3 dias.',
    duration: '3 dias · 2 noites',
    difficulty: 'Fácil/Moderado',
    price: '249€',
    max_people: 12,
    coming_soon: true,
    hero_image: `${BASE}/13.png`,
    hero_video: null,
    card_image: `${BASE}/13.png`,
    hover_video: null,
    highlights: [`${BASE}/13.png`, `${BASE}/2.png`, `${BASE}/3.png`, `${BASE}/9.png`],
    includes: [
      { icon: '🏄', label: 'Instrutor de surf certificado', detail: 'Instrutor federado com experiência em iniciantes.' },
      { icon: '🏄', label: 'Prancha e fato de neoprene', detail: 'Todo o equipamento incluído.' },
      { icon: '🏠', label: 'Alojamento 2 noites', detail: 'Surf house com ambiente de comunidade.' },
      { icon: '🍽️', label: 'Refeições incluídas', detail: 'Pequenos-almoços e jantares na surf house.' },
    ],
    not_includes: ['Transporte até à surf house', 'Almoços', 'Protetor solar (fundamental no surf)'],
    packing_list: [
      'Fato de banho (2)',
      'Protetor solar resistente à água (obrigatório)',
      'Toalha',
      'Chinelos',
      'Roupa leve para as noites',
    ],
    digital_detox: 'No surf, a atenção tem de ser total. Uma onda não espera por likes. Três dias a focar apenas no oceano e no teu corpo são o melhor reset do ano.',
    cancellations: 'Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.',
    review_text: 'Entrei na água com medo e saí com um sorriso enorme. O melhor investimento que fiz este ano.',
    review_author: 'Filipa B.',
    review_role: 'Participante, 2024',
    review_image: `${BASE}/13.png`,
    itinerary: [
      { day_label: 'Dia 1', title: 'Teoria e primeiras ondas', description: 'Briefing em terra, exercícios de segurança e primeira sessão no white water.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Green waves', description: 'Sessão da manhã e da tarde. Técnica, leitura de ondas, progressão acelerada.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Sessão livre e regresso', description: 'Última sessão livre com o instrutor disponível. Tarde de regresso.', order_index: 2 },
    ],
    faqs: [
      { question: 'Nunca surfei. Consigo?', answer: 'Sim! O programa é desenhado para iniciantes. Em 3 dias a maioria dos participantes já apanha green waves.', order_index: 0 },
      { question: 'Qual a faixa etária?', answer: 'A partir dos 14 anos. Menores de 18 precisam de autorização dos pais.', order_index: 1 },
    ],
    dates: [
      { date_range: '5 Set — 7 Set 2026', status: 'disponivel', spots: 6, price: '249€', order_index: 0 },
      { date_range: '3 Out — 5 Out 2026', status: 'apreencher', spots: 3, price: '249€', order_index: 1 },
    ],
    spots: [
      { name: 'Costa Atlântica', description: 'As melhores praias para surf em Portugal.', image: `${BASE}/13.png`, order_index: 0 },
      { name: 'Surf House', description: 'A tua casa durante 3 dias, com comunidade de surfistas.', image: `${BASE}/2.png`, order_index: 1 },
    ],
  },
];

// ============================================================
// FUNÇÃO PRINCIPAL DE MIGRAÇÃO
// ============================================================

async function seed() {
  console.log('\n🚀 BORED ORIGINALS — SEED SUPABASE\n');
  console.log('='.repeat(50));

  let successCount = 0;
  let errorCount = 0;

  for (const adventure of adventures) {
    const { itinerary, faqs, dates, spots, ...adventureData } = adventure;

    try {
      console.log(`\n📦 [${adventure.index + 1}/12] ${adventure.title}...`);

      // 1. Inserir aventura principal
      const { data: adv, error: advErr } = await supabase
        .from('adventures')
        .upsert({
          ...adventureData,
          highlights: adventureData.highlights,
          includes: adventureData.includes,
          not_includes: adventureData.not_includes,
          packing_list: adventureData.packing_list,
        }, { onConflict: 'slug' })
        .select('id')
        .single();

      if (advErr) {
        console.error(`  ❌ Erro ao inserir aventura:`, JSON.stringify(advErr, null, 2));
        errorCount++;
        continue;
      }

      const adventureId = adv.id;
      console.log(`  ✅ Aventura inserida (ID: ${adventureId})`);

      // 2. Itinerário
      if (itinerary?.length) {
        await supabase.from('itinerary').delete().eq('adventure_id', adventureId);
        const { error } = await supabase.from('itinerary').insert(
          itinerary.map(item => ({ ...item, adventure_id: adventureId }))
        );
        if (error) console.error(`  ❌ Itinerário:`, error.message);
        else console.log(`  ✅ ${itinerary.length} dias de itinerário`);
      }

      // 3. FAQs
      if (faqs?.length) {
        await supabase.from('faqs').delete().eq('adventure_id', adventureId);
        const { error } = await supabase.from('faqs').insert(
          faqs.map(item => ({ ...item, adventure_id: adventureId }))
        );
        if (error) console.error(`  ❌ FAQs:`, error.message);
        else console.log(`  ✅ ${faqs.length} FAQs`);
      }

      // 4. Datas
      if (dates?.length) {
        await supabase.from('activity_dates').delete().eq('adventure_id', adventureId);
        const { error } = await supabase.from('activity_dates').insert(
          dates.map(item => ({ ...item, adventure_id: adventureId }))
        );
        if (error) console.error(`  ❌ Datas:`, error.message);
        else console.log(`  ✅ ${dates.length} datas`);
      }

      // 5. Spots (o que vais ver)
      if (spots?.length) {
        await supabase.from('activity_spots').delete().eq('adventure_id', adventureId);
        const { error } = await supabase.from('activity_spots').insert(
          spots.map(item => ({ ...item, adventure_id: adventureId }))
        );
        if (error) console.error(`  ❌ Spots:`, error.message);
        else console.log(`  ✅ ${spots.length} spots`);
      }

      successCount++;

    } catch (err) {
      console.error(`  ❌ ERRO INESPERADO:`, err.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Migração completa!`);
  console.log(`   ✔ ${successCount} aventuras migradas com sucesso`);
  if (errorCount > 0) console.log(`   ✖ ${errorCount} erros encontrados`);
  console.log('\n');
}

seed();
