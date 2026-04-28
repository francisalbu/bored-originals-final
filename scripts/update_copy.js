// ============================================================
// BORED ORIGINALS — Script de atualização de copy
// ============================================================
// Corre com: node scripts/update_copy.js
// ============================================================

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Falta VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================
// COPY ATUALIZADO POR AVENTURA (identificado pelo slug)
// ============================================================

const updates = [

  // ── 0 ── SUBIDA AO PICO ──────────────────────────────────────
  {
    slug: 'subida-ao-pico',
    tagline: 'O topo de Portugal não é para todos. Ainda bem.',
    description: 'O Pico tem 2351 metros — e não é uma caminhada, é uma travessia vertical por lava, vento e silêncio. A subida é técnica, o clima muda sem aviso e o corpo sente cada metro. Mas quando chegas lá acima, entre nuvens que abrem e fecham, percebes rapidamente: não vieste só subir uma montanha. Vieste para te colocar à prova.',
    includes: [
      { icon: '🏔️', label: 'Guia de montanha certificado', detail: 'Guia com certificação internacional (IFMGA) e vasta experiência no Pico.' },
      { icon: '⛺', label: 'Alojamento (2 noites)', detail: 'Casa rural no sopé da montanha, integrada na paisagem.' },
      { icon: '🍽️', label: 'Todas as refeições', detail: 'Pequenos-almoços, almoços de campo e jantares partilhados.' },
      { icon: '🎒', label: 'Equipamento técnico', detail: 'Bastões, polainas e kit de segurança. Só precisas de trazer as tuas botas.' },
      { icon: '📸', label: 'Fotografia da experiência', detail: 'Registo profissional entregue em formato digital até 7 dias após a expedição.' },
      { icon: '🚐', label: 'Transferes locais', detail: 'Entre aeroporto, alojamento e ponto de início da subida.' },
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
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. Cancelamento gratuito até 10 dias antes da data de início. Entre 10 dias e 48 horas: 50% do valor. Menos de 48 horas: sem reembolso. Se a Bored. cancelar (meteorologia, impossibilidade do prestador, condições de segurança ou força maior), oferecemos alternativa ou reembolso total.',
    curiosities: [
      {
        title: 'Uma ilha que é uma montanha.',
        text: 'O Pico é o ponto mais alto de Portugal (2351m), mas mais do que isso — a própria ilha é o vulcão. A última erupção foi em 1720. Hoje está dormente, mas nunca completamente adormecido.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png',
      },
      {
        title: 'O topo muda de humor — e tu com ele.',
        text: 'Num só dia podes sair de 25°C e chegar ao topo com neve. Pelo caminho, atravessas diferentes zonas climáticas. No Piquinho, ainda há calor a sair das rochas — sinais discretos de um vulcão que continua vivo.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'Vinhas negras, vinho imperial.',
        text: 'As vinhas do Pico são Património Mundial da UNESCO. Crescem protegidas por muros de lava negra, construídos à mão ao longo de séculos. O Verdelho daqui já foi servido nas cortes dos czares russos.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e preparação', description: 'Chegada à ilha do Pico. Transfer para o alojamento, briefing com o guia e ajuste de equipamento. Jantar de grupo. Descanso — a subida começa de madrugada.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Subida ao Pico', description: 'Início pelas 02h00. Ritmo progressivo ao longo de 5 a 7 horas. Objetivo: atingir o topo ao nascer do sol. Descida na manhã, almoço no topo ou no regresso, tarde livre para recuperação.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Ilha e regresso', description: 'Manhã livre para explorar o Pico — adegas, lagoas, costa vulcânica. Almoço final. Transfer para o aeroporto.', order_index: 2 },
    ],
    faqs: [
      { question: 'Qual o nível de condição física necessário?', answer: 'Médio a elevado. Deves conseguir caminhar mais de 6 horas com cerca de 1200m de desnível positivo. Não requer técnica de escalada, mas exige resistência e consistência.', order_index: 0 },
      { question: 'Qual a melhor época para subir?', answer: 'Entre maio e outubro, em condições estáveis. Fora deste período, a montanha torna-se imprevisível e pode estar encerrada.', order_index: 1 },
      { question: 'E se o tempo não permitir a subida?', answer: 'Se não houver condições seguras, ativamos plano alternativo na ilha. Caso a subida seja cancelada, oferecemos nova data ou reembolso parcial.', order_index: 2 },
      { question: 'Quantas pessoas por expedição?', answer: 'Máximo de 10 pessoas. Grupos pequenos para garantir segurança, fluidez e uma experiência mais próxima.', order_index: 3 },
    ],
  },

  // ── 1 ── SOBREVIVER 24H ──────────────────────────────────────
  {
    slug: 'sobreviver-24h',
    title: 'Sobrevive 24h',
    tagline: 'Aprende o básico. Esquece o resto.',
    description: 'Passas 24 horas na natureza com o mínimo necessário — e com aquilo que realmente importa. Aprendes a fazer fogo, encontrar água, construir abrigo e manter a cabeça no sítio quando tudo à volta te tira conforto. É uma experiência prática, intensa e orientada por um instrutor de sobrevivência.',
    includes: [
      { icon: '🧭', label: 'Instrutor especializado', detail: 'Formação orientada por um instrutor de sobrevivência, com foco prático e acompanhamento constante.' },
      { icon: '🏕️', label: 'Uma noite em abrigo natural', detail: 'Uma noite num abrigo natural montado por ti, sob lona ou tenda.' },
      { icon: '📋', label: 'Formação prática', detail: 'Aprendizagem e execução de técnicas de abrigo, água, fogo, sinalização e suporte de vida.' },
      { icon: '🏠', label: 'Zona base e instalações de apoio', detail: 'Espaço comum de formação, duches exteriores e WC no local.' },
    ],
    not_includes: [
      'Transporte até Sesimbra',
      'Equipamento pessoal específico, se necessário',
      'Seguro de viagem pessoal',
      'Bebidas alcoólicas',
    ],
    packing_list: [
      'Roupa confortável e resistente',
      'Calçado adequado para terreno natural',
      'Impermeável leve',
      'Muda de roupa',
      'Lanterna frontal',
      'Garrafa de água',
      'Repelente e proteção solar',
      'Artigos de higiene pessoal',
      'Saco-cama',
      'Qualquer equipamento pessoal pedido após reserva',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. Cancelamento gratuito até 10 dias antes da data de início. Entre 10 dias e 48 horas: 50% do valor. Menos de 48 horas: sem reembolso. Se a Bored. cancelar (meteorologia, impossibilidade do prestador, condições de segurança ou força maior), oferecemos alternativa ou reembolso total.',
    curiosities: [
      {
        title: 'Sobreviver começa antes do medo.',
        text: 'O objetivo do curso é dar-te ferramentas para lidar com falhas de equipamento, mau tempo, dificuldade de deslocação e necessidade de pedir socorro. Não se trata de "aventura por aventura"; trata-se de saber responder quando o plano corre mal.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/5.png',
      },
      {
        title: 'O mínimo certo pesa mais do que a pressa.',
        text: 'A formação é construída de forma prática, com demonstrações e exercícios feitos por ti, e adapta-se ao tipo de material e aos hábitos do grupo. Isso torna a experiência mais realista e mais útil fora do curso.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'Dormes no que construíres.',
        text: 'O curso inclui uma noite num abrigo natural montado por ti, sob lona ou tenda, para contacto direto com o tipo de proteção que poderias ter numa situação de emergência. É uma forma de perceber, no corpo, o que funciona e o que falha.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/4.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Fundamentos e preparação', description: 'Chegada ao campo base e introdução ao curso. Briefing inicial, adaptação ao grupo e primeiras práticas essenciais: abrigo, fogo, água e segurança. Ao final do dia, constróis o teu abrigo e preparas a noite.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Aplicação e consolidação', description: 'A manhã é dedicada à continuação da formação prática, correção de técnicas e exercícios de sobrevivência em contexto controlado. O foco está em transformar conhecimento em resposta automática. A experiência termina ao final do dia, com saída do campo base.', order_index: 1 },
    ],
    faqs: [
      { question: 'Qual o nível de experiência necessário?', answer: 'Nenhum. O curso foi pensado para ser acessível a iniciados, mas continua a ser exigente o suficiente para ser realmente útil.', order_index: 0 },
      { question: 'É uma experiência física?', answer: 'Sim, mas sem necessidade de deslocações longas. A atividade decorre maioritariamente em campo base e aposta na prática, não no endurance.', order_index: 1 },
      { question: 'Onde acontece?', answer: 'Em Sesimbra, no campo base da Escola do Mato, no Sesimbra Natura Park.', order_index: 2 },
      { question: 'Quantas pessoas participam?', answer: 'O curso tem lotação limitada, com um máximo de 16 participantes.', order_index: 3 },
    ],
  },

  // ── 2 ── COSTA VICENTINA (GRAVEL / DESCIDA DA COSTA) ─────────
  {
    slug: 'descida-da-costa',
    title: 'Costa Vicentina em Estado Puro',
    tagline: 'De Setúbal a Sagres, a pedalar pelo litoral mais selvagem de Portugal.',
    description: 'Quatro dias a pedalar pelo lado mais cru da costa portuguesa — de Setúbal até Sagres, por estradas secundárias, gravilha, pinhais, dunas, lagoas e falésias abertas ao Atlântico. Não é uma viagem para acumular quilómetros; é para atravessar uma faixa de país onde o vento manda, a paisagem muda sem aviso e cada chegada parece mais merecida do que a anterior.',
    includes: [
      { icon: '🚴', label: 'Guia local de gravel', detail: 'Acompanhamento por alguém que conhece o terreno, o ritmo e os troços onde a rota precisa de ser lida com atenção.' },
      { icon: '🗺️', label: 'Track GPX e navegação', detail: 'Percurso desenhado de Setúbal a Sagres, com navegação pronta a usar e suporte logístico ao longo da viagem.' },
      { icon: '🏠', label: 'Alojamento em 3 noites', detail: 'Hospedagem em unidades simples, confortáveis e bem localizadas.' },
      { icon: '☕', label: 'Pequeno-almoço diário', detail: 'Para começar cada etapa com energia.' },
      { icon: '🧳', label: 'Transfer de bagagem', detail: 'Para pedalar leve e deixar a logística fora da equação.' },
      { icon: '🔧', label: 'Apoio mecânico básico', detail: 'Assistência de primeira linha para pequenos imprevistos de percurso.' },
    ],
    not_includes: [
      'Bicicleta gravel',
      'Voos ou transportes até Setúbal',
      'Almoços e jantares, salvo indicação contrária',
      'Seguro pessoal de atividade',
      'Reparações mecânicas de maior dimensão',
    ],
    packing_list: [
      'Bicicleta gravel em bom estado',
      'Pneus adequados a terreno misto',
      'Capacete',
      'Luzes dianteira e traseira',
      'Kit de reparação e câmara suplente',
      'Roupa respirável em camadas',
      'Impermeável leve e corta-vento',
      'Óculos de ciclismo',
      'Protetor solar SPF50+',
      'Sapatos compatíveis com o teu pedal',
      'Telefone com bateria externa',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por condições meteorológicas extremas, segurança ou força maior, oferecemos nova data ou reembolso total.',
    curiosities: [
      {
        title: 'Começas por atravessar água.',
        text: 'A saída de Setúbal para Tróia faz sentido como abertura da rota, e vários percursos e tours na região usam a travessia inicial como ponto de entrada para a Costa Vicentina e o corredor atlântico.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png',
      },
      {
        title: 'A costa sudoeste foi feita para o gravel.',
        text: 'A área entre Setúbal, Sines, Porto Covo, Melides e a Costa Vicentina tem rotas longas e exigentes, com secções de gravel, areia compacta, piso misto e ganho de elevação moderado em alguns troços.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png',
      },
      {
        title: 'Sagres não é o fim — é um limite.',
        text: 'Chegar a Sagres é chegar ao extremo sudoeste da Europa continental, num ponto onde o mar, o vento e a falésia fecham a viagem com uma sensação quase cinematográfica.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Setúbal a Comporta / Melides', description: 'Saída de Setúbal com travessia inicial e entrada progressiva no ritmo da costa. O dia serve para abrir pernas, ajustar bike e entrar na lógica do terreno: misto, rápido, bonito e sem demasiada margem para distrações.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Melides a Sines', description: 'A paisagem fica mais aberta e mais atlântica. O percurso ganha textura, com secções de gravel, pinhal e costa recortada, numa etapa que já começa a separar passeio de expedição.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Sines a Aljezur', description: 'É aqui que a viagem endurece e fica mais bonita. A Costa Vicentina impõe um ritmo próprio, com subidas curtas, piso variável e aquele tipo de cansaço que vem acompanhado de silêncio.', order_index: 2 },
      { day_label: 'Dia 4', title: 'Aljezur a Sagres', description: 'Última etapa, mais emocional do que física, embora o vento possa decidir complicar o guião. A chegada a Sagres fecha a travessia com mar aberto, horizonte limpo e a sensação de missão cumprida.', order_index: 3 },
    ],
    faqs: [
      { question: 'Qual o nível físico necessário?', answer: 'Médio-alto a alto. O ideal é já estares confortável com dias sucessivos em bicicleta, entre 60 e 100 km, dependendo do ritmo do grupo.', order_index: 0 },
      { question: 'É preciso experiência em gravel?', answer: 'Não obrigatoriamente, mas ajuda. O percurso mistura piso rolante com secções mais soltas e por isso é melhor para quem já tem alguma confiança em terreno variável.', order_index: 1 },
      { question: 'A viagem é guiada ou auto-guiada?', answer: 'Guiada ou semi-guiada com apoio logístico, para garantir fluidez, segurança e consistência de experiência.', order_index: 2 },
    ],
  },

  // ── 3 ── SEM TERRA À VISTA (À VELA PELO OCEANO) ──────────────
  {
    slug: 'a-vela-pelo-oceano',
    title: 'Sem Terra à Vista',
    tagline: 'Quatro dias a seguir a costa. Três noites a dormir com o Atlântico por baixo.',
    description: 'Embarcas em Sesimbra e deixas a costa levar o comando até Sagres. Pelo caminho, há falésias, grutas, arcos de pedra, praias inacessíveis por terra e encontros com golfinhos que lembram que o mar nunca esteve ali para te entreter. Aprendes o básico da vela, navegas com tripulação experiente e dormes a bordo, com o casco a dizer-te que ainda estás em movimento.',
    includes: [
      { icon: '⛵', label: 'Tripulação experiente', detail: 'Skipper e apoio a bordo para garantir segurança, ritmo e boa leitura do mar.' },
      { icon: '🗺️', label: 'Percurso costeiro', detail: 'Percurso desenhado para explorar troços dramáticos da costa portuguesa.' },
      { icon: '🛏️', label: '3 noites a bordo', detail: 'Dormida em cabine partilhada, com 4 cabines disponíveis para até 8 pessoas.' },
      { icon: '🍽️', label: 'Todas as refeições e vinho', detail: 'Pequenos-almoços, almoços e jantares com vinho incluídos.' },
      { icon: '🤿', label: 'Snorkeling e mergulho', detail: 'Paragens para explorar águas mais calmas e zonas costeiras protegidas.' },
      { icon: '🐬', label: 'Vida marinha e costa selvagem', detail: 'Possibilidade de avistar golfinhos, tartarugas e outras espécies ao longo da rota.' },
    ],
    not_includes: [
      'Transporte até Sesimbra',
      'Seguro pessoal de viagem',
      'Bebidas extra fora do programa',
      'Equipamento pessoal específico, se aplicável',
    ],
    packing_list: [
      'Roupa confortável para barco',
      'Fato de banho',
      'Toalha compacta',
      'Casaco corta-vento',
      'Calçado com sola clara e antiderrapante',
      'Óculos de sol',
      'Protetor solar SPF50+',
      'Muda de roupa leve',
      'Saco pequeno impermeável',
      'Medicamentos pessoais, se necessários',
      'Documento de identificação',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por condições meteorológicas, segurança ou força maior, oferecemos nova data ou reembolso total.',
    curiosities: [
      {
        title: 'A costa muda muito depressa quando a vês do mar.',
        text: 'Entre Sesimbra e o sudoeste algarvio, a linha de costa revela grutas, enseadas, praias secretas e formações rochosas que em terra quase não se percebem. É uma viagem onde a geografia parece mais viva do que no mapa.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png',
      },
      {
        title: 'O Atlântico está cheio de vida — se tiveres paciência para olhar.',
        text: 'Esta costa é conhecida por avistamentos de golfinhos e por uma biodiversidade marinha forte, especialmente nas águas entre Sesimbra, Arrábida e a Costa Vicentina.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png',
      },
      {
        title: 'Dormir a bordo muda a escala da viagem.',
        text: 'A bordo, a experiência não acaba ao pôr do sol: continuas rodeado de mar, com 3 noites em cabine e espaço para 8 pessoas no total. É uma forma rara de viajar em Portugal, mais íntima do que um hotel e mais livre do que um roteiro fechado.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Sesimbra a Costa Alentejana', description: 'Saída de Sesimbra com rumo ao sul e entrada imediata numa costa mais aberta e menos domesticada. O primeiro dia serve para tomar o ritmo do barco, perceber a lógica da navegação e entrar no estado mental certo: menos pressa, mais mar.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Cabo de São Vicente a Algarve', description: 'O mar muda de tom quando o Cabo aparece. É um dia de navegação com carácter, onde a costa fica mais dramática e o horizonte começa a parecer uma decisão.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Grutas, arcos e praias secretas', description: 'Dia para explorar formações rochosas, enseadas escondidas e praias que só existem realmente a partir da água. É o momento mais visual da viagem — e também o mais difícil de traduzir em palavras sem estragar a experiência.', order_index: 2 },
      { day_label: 'Dia 4', title: 'Regresso a Sesimbra', description: 'Navegação de volta, com a sensação estranha de que a viagem passou depressa demais. O regresso fecha o círculo e devolve-te à costa com um pouco mais de sal na pele e menos necessidade de explicação.', order_index: 3 },
    ],
    faqs: [
      { question: 'Qual o nível de experiência necessário?', answer: 'Nenhum. A viagem é pensada para quem quer viver a navegação de forma acessível, com tripulação experiente a acompanhar cada momento.', order_index: 0 },
      { question: 'Como é a dormida a bordo?', answer: 'Em cabines partilhadas, com 4 cabines para 8 pessoas no total. Pode haver partilha com outro viajante ou com alguém do teu grupo.', order_index: 1 },
      { question: 'A experiência inclui refeições?', answer: 'Sim. Todas as refeições e vinhos estão incluídos no programa.', order_index: 2 },
      { question: 'Há atividade na água?', answer: 'Sim. O programa inclui snorkeling e mergulho, além de paragens ligadas à exploração costeira.', order_index: 3 },
    ],
  },

  // ── 4 ── CABINE NO MEIO DO NADA (desconexão) ─────────────────
  {
    slug: 'cabine-no-meio-do-nada',
    tagline: 'O silêncio também é um plano. Sem pessoas. Só tu, a Natureza e os teus próprios pensamentos.',
    description: 'Durante dois dias e duas noites, ficas num bungalow isolado no meio da natureza, sem wifi, sem notificações e sem ruído que não seja real. Não há programa, não há pressa e não há muito para fazer além de respirar, andar devagar, olhar longe e deixar o corpo lembrar-se de como é estar quieto.',
    includes: [
      { icon: '🏕️', label: '2 noites em bungalow isolado', detail: 'Uma experiência off-grid, sem internet, sem pressão e sem a urgência habitual do dia-a-dia.' },
      { icon: '🌿', label: 'Silêncio e privacidade', detail: 'Espaço para caminhar, contemplar e simplesmente estar.' },
    ],
    not_includes: [
      'Transporte até ao local',
      'Refeições, salvo indicação contrária',
      'Atividades organizadas',
      'Seguro pessoal de viagem',
    ],
    packing_list: [
      'Roupa confortável',
      'Calçado simples para caminhar',
      'Casaco quente',
      'Livro ou caderno',
      'Garrafa de água reutilizável',
      'Artigos de higiene pessoal',
      'Comida e snacks, se aplicável',
      'Power bank, apenas para o transporte',
      'Vontade de não fazer grande coisa',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos operacionais, meteorológicos ou de segurança, oferecemos nova data ou reembolso total.',
    curiosities: [
      {
        title: 'O silêncio também ocupa espaço.',
        text: 'Quando cortas o sinal, o que sobra não é vazio — é atenção. O ruído de fundo desaparece e tudo fica mais nítido: o vento, a luz, o tempo e os teus próprios pensamentos.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/4.png',
      },
      {
        title: 'Dois dias bastam para mudar o ritmo.',
        text: 'Uma estadia curta, sem ecrãs, sem agenda e sem estímulos constantes, já força o corpo a abrandar. Não é um milagre; é só o que acontece quando deixas de interromper o teu próprio descanso.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'A natureza não precisa de programação.',
        text: 'Não há aqui um itinerário rígido porque o valor da experiência está precisamente na ausência dele. Caminhar, ler, cozinhar, dormir, observar — o melhor plano é não competir com o lugar.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e desaceleração', description: 'Chegada ao bungalow e primeiro contacto com o isolamento. Não há programa para correr atrás: há entrada suave, desembarque mental e tempo para começar a baixar o volume.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Presença total', description: 'O dia é teu. Lê, caminha, dorme, cozinha, observa, desaparece um pouco do radar. A experiência vive menos do que fazes e mais da forma como deixas de te distrair.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Últimas horas e regresso', description: 'Mais uma manhã em silêncio antes da partida. O regresso acontece com menos ruído interno e, idealmente, com menos vontade de o recuperar logo à chegada.', order_index: 2 },
    ],
    faqs: [
      { question: 'Há internet ou rede no local?', answer: 'Não. A ausência de sinal faz parte da experiência.', order_index: 0 },
      { question: 'Posso levar o telemóvel?', answer: 'Podes, mas a proposta é não o usar durante a estadia.', order_index: 1 },
      { question: 'É uma experiência romântica ou a solo?', answer: 'Funciona muito bem nas duas versões. O conceito é suficientemente aberto para servir fuga, pausa ou recolhimento.', order_index: 2 },
      { question: 'Há atividades incluídas?', answer: 'Não de forma programada. A atividade principal é a desconexão.', order_index: 3 },
    ],
  },

  // ── 5 ── ALDEIAS HISTÓRICAS DE MOTA ──────────────────────────
  {
    slug: 'aldeias-historicas-de-mota',
    tagline: 'Portugal antigo, em modo lento.',
    description: 'Percorre as aldeias históricas de Portugal em scooter 50cc, ao teu ritmo e sem a pose habitual das rotas turísticas. Castelos, ruelas, miradouros e paragens inesperadas, com um virtual guide a abrir caminho para o que interessa. É uma viagem lenta, mas com personalidade.',
    includes: [
      { icon: '🛵', label: 'Scooter 50cc e capacete', detail: 'Veículo leve, prático e perfeito para explorar em modo descontraído.' },
      { icon: '📱', label: 'Virtual guide', detail: 'Orientação digital preparada para facilitar a viagem.' },
      { icon: '🏠', label: 'Alojamento', detail: 'Hospedagem selecionada ao longo da rota.' },
      { icon: '🤝', label: 'Assistência logística', detail: 'Apoio para garantir fluidez ao longo da experiência.' },
    ],
    not_includes: [
      'Combustível',
      'Refeições, salvo indicação contrária',
      'Seguro pessoal',
      'Depósito do aluguer (valor a confirmar)',
      'Despesas de caráter pessoal',
    ],
    packing_list: [
      'Carta de condução válida',
      'Roupa confortável',
      'Casaco leve',
      'Óculos de sol',
      'Protetor solar',
      'Mochila pequena',
      'Água',
      'Telemóvel com bateria',
      'Vontade de andar devagar',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Entre 10 dias e 48 horas: 50% do valor. Menos de 48 horas: sem reembolso.',
    curiosities: [
      {
        title: 'Há aldeias onde o tempo ficou por ali.',
        text: 'As Aldeias Históricas de Portugal reúnem alguns dos núcleos medievais mais marcantes do país, com muralhas, castelos, pedras gastas e traços urbanos que sobrevivem há séculos.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png',
      },
      {
        title: 'A scooter muda a escala da viagem.',
        text: 'Andar de 50cc não é pressa disfarçada; é uma forma de entrar no ritmo do território, parar sem cerimónia e dar espaço ao que normalmente passa despercebido.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'A história aqui não está num museu.',
        text: 'Ela está nas ruas, nas fachadas, nas praças e nos miradouros. A melhor parte não é "ver património"; é circular dentro dele.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e primeira aldeia', description: 'Entrada na rota e primeiros quilómetros em modo lento. A ideia é ajustar o ritmo, começar a ler a paisagem e perceber que aqui a viagem é tão importante como o destino.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Castelos, ruelas e miradouros', description: 'Dia dedicado às aldeias mais marcantes da rota, com paragens longas o suficiente para olhar, ouvir e abrandar sem culpa.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Últimas aldeias e regresso', description: 'Fecho da viagem com a sensação de ter atravessado uma versão mais silenciosa de Portugal. O regresso vem com menos pressa e mais memória.', order_index: 2 },
    ],
    faqs: [
      { question: 'É preciso experiência com scooter?', answer: 'Não necessariamente, mas ajuda sentir-te confortável com veículos leves e com ritmo de passeio.', order_index: 0 },
      { question: 'A rota é guiada?', answer: 'Sim, com virtual guide e orientação preparada para facilitar a viagem.', order_index: 1 },
      { question: 'A scooter está incluída?', answer: 'Sim, a experiência pressupõe o uso de scooter 50cc.', order_index: 2 },
    ],
  },

  // ── 6 ── RALLY PELA N2 ────────────────────────────────────────
  {
    slug: 'rally-pela-n2',
    tagline: 'Sem GPS. Sem garantias. Com sorte, chegas.',
    description: 'Atravessa Portugal de norte a sul pela N2 num carro com mais de 20 anos, sem GPS e com um mapa de papel como se isso ainda fosse perfeitamente normal. Há avarias, desvios e imprevistos. Faz parte. O objetivo não é chegar depressa — é chegar com história.',
    includes: [
      { icon: '🚗', label: 'Veículo com carácter', detail: 'Escolhido para entrar no espírito da viagem.' },
      { icon: '🗺️', label: 'Percurso pela N2', detail: 'Percurso desenhado ao longo da Estrada Nacional 2.' },
      { icon: '🏠', label: 'Alojamento', detail: 'Hospedagem ao longo da rota.' },
      { icon: '🔧', label: 'Assistência logística', detail: 'Apoio para lidar com o inevitável: atrasos, desvios e pequenos dramas mecânicos.' },
    ],
    not_includes: [
      'Carro clássico com mais de 20 anos — tens de trazer o teu',
      'GPS — sem distrações digitais',
      'Combustível',
      'Refeições, salvo indicação contrária',
      'Portagens, se aplicáveis',
      'Seguro adicional, se necessário',
      'Reparações extraordinárias',
    ],
    packing_list: [
      'Carro clássico com mais de 20 anos',
      'Carta de condução válida',
      'Roupa confortável',
      'Óculos de sol',
      'Água',
      'Snacks',
      'Sentido de humor',
      'Documentos pessoais',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Entre 10 dias e 48 horas: 50% do valor. Menos de 48 horas: sem reembolso.',
    curiosities: [
      {
        title: 'A N2 é um país dentro do país.',
        text: 'A Estrada Nacional 2 liga Chaves a Faro e atravessa o interior de Portugal ao longo de centenas de quilómetros, cruzando paisagens, ritmos e geografias muito diferentes.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/8.png',
      },
      {
        title: 'Carros velhos têm personalidade — e caprichos.',
        text: 'Neste tipo de viagem, o veículo não é só transporte. É parte da narrativa. E quando falha, também conta uma história.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png',
      },
      {
        title: 'O mapa de papel obriga-te a estar presente.',
        text: 'Sem GPS, a viagem pede atenção, conversa, improviso e tolerância ao inesperado. Não é eficiência: é carácter.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Norte e arranque', description: 'Saída com energia e pouca ilusão. O primeiro dia serve para entrar na lógica do carro, do mapa e da estrada sem pressa.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Interior profundo', description: 'É aqui que a N2 ganha densidade. Mais quilómetros, mais paisagem e mais oportunidades para descobrir que o plano A raramente sobrevive intacto.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Sul e chegada', description: 'A reta final traz calor, desgaste e algum orgulho. Chegar ao destino com o carro inteiro já é meio prémio.', order_index: 2 },
    ],
    faqs: [
      { question: 'Os carros são da Bored.?', answer: 'Não. Cada grupo de participantes trata de arranjar o seu próprio carro. Nós só validamos o requisito básico: ser uma velharia.', order_index: 0 },
      { question: 'Vamos usar GPS?', answer: 'Não. A ideia é precisamente navegar à moda antiga.', order_index: 1 },
      { question: 'É preciso gostar de carros clássicos?', answer: 'Ajuda, mas o mais importante é aceitar a imperfeição mecânica como parte da viagem.', order_index: 2 },
      { question: 'E se o carro avariar?', answer: 'Faz parte da experiência. Existe apoio logístico para lidar com os imprevistos.', order_index: 3 },
    ],
  },

  // ── 7 ── TRILHOS SELVAGENS NO GERÊS ──────────────────────────
  {
    slug: 'trilhos-selvagens-no-geres',
    title: 'Gerês Selvagem',
    tagline: 'Por caminhos que não aparecem no Google Maps.',
    description: 'Trilhos fora das rotas marcadas no único parque nacional de Portugal. Cascatas escondidas, floresta primária, silêncio absoluto. Só botas, mochila e instinto.',
    includes: [
      { icon: '🥾', label: 'Guia local experiente', detail: 'Conhecedor dos caminhos mais selvagens e menos óbvios do Gerês.' },
      { icon: '🗺️', label: 'Percurso selecionado', detail: 'Trilhos pensados para mostrar o lado mais selvagem e menos óbvio do Gerês.' },
      { icon: '🤝', label: 'Apoio logístico', detail: 'Organização da experiência e gestão prática da atividade.' },
      { icon: '👥', label: 'Experiência em pequeno grupo', detail: 'Para preservar o silêncio e a qualidade da travessia.' },
      { icon: '🏠', label: 'Alojamento', detail: 'Hospedagem selecionada na zona do Gerês.' },
    ],
    not_includes: [
      'Transporte até ao ponto de encontro',
      'Refeições, salvo indicação contrária',
      'Equipamento pessoal de trekking',
      'Seguro pessoal de viagem',
      'Despesas de caráter pessoal',
    ],
    packing_list: [
      'Botas de trekking',
      'Mochila pequena a média',
      'Casaco impermeável',
      'Roupa técnica confortável',
      'Fato de banho',
      'Toalha compacta',
      'Água',
      'Snacks',
      'Protetor solar',
      'Boné ou chapéu',
      'Bastões, se usares',
      'Telemóvel carregado',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos de segurança, meteorologia ou força maior, oferecemos nova data ou reembolso total.',
    curiosities: [
      {
        title: 'O Gerês ainda tem sítios onde a presença humana quase não chega.',
        text: 'Dentro do Parque Nacional da Peneda-Gerês, há zonas de floresta, ribeiros e vales onde o ritmo da paisagem continua a ser mais forte do que o das pessoas.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'Nem todos os trilhos querem ser fáceis.',
        text: 'Os caminhos mais interessantes no Gerês raramente são os mais óbvios. O terreno pede atenção, alguma resistência e vontade de sair da rota mais confortável.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png',
      },
      {
        title: 'A água aqui não é cenário.',
        text: 'Cascatas, poços e linhas de água fazem parte da experiência de forma muito concreta. O percurso ganha outra dimensão quando o som mais constante é o da água a cair.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/5.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Entrada no parque', description: 'Chegada à zona do Gerês e primeiro contacto com o ambiente do parque. A caminhada começa sem pressa, para deixar o corpo entrar no ritmo certo e a cabeça sair dele.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Trilhos escondidos', description: 'Dia dedicado aos caminhos menos óbvios, com passagem por florestas, vales e pontos de água. É o momento em que o Gerês começa a mostrar o que normalmente não se vê numa visita rápida.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Cascatas e regresso', description: 'Último dia com foco nas cascatas e nas paisagens mais marcantes da rota. O regresso acontece com o tipo de cansaço bom que só existe quando valeu a pena.', order_index: 2 },
    ],
    faqs: [
      { question: 'Qual o nível físico necessário?', answer: 'Médio. O percurso é exigente o suficiente para pedir resistência, mas acessível para quem tem hábito de caminhar.', order_index: 0 },
      { question: 'É preciso experiência em trekking?', answer: 'Não obrigatoriamente, mas ajuda sentir-te confortável em terreno natural e irregular.', order_index: 1 },
      { question: 'Há banho em cascatas?', answer: 'Depende das condições do percurso e da época, mas a água é parte central da experiência.', order_index: 2 },
      { question: 'Quantas pessoas vão?', answer: 'Idealmente em grupos pequenos, para preservar o silêncio e a qualidade da travessia.', order_index: 3 },
    ],
  },

  // ── 8 ── CAMINHOS DE SANTIAGO A CORRER ───────────────────────
  {
    slug: 'caminhos-de-santiago-a-correr',
    tagline: 'O caminho é o mesmo. As pernas não.',
    description: 'Os últimos 40 km do Caminho Português, mas em versão corrida. Três dias de trail running, granito, estrada e pernas a negociar com a cabeça. Menos contemplação, mais ritmo. Ainda assim, o caminho continua lá — só que com outro tipo de conversa.',
    includes: [
      { icon: '🏃', label: 'Guia e acompanhamento da experiência', detail: 'Apoio de alguém que conhece o percurso e ajuda a manter o ritmo certo.' },
      { icon: '🗺️', label: 'Percurso desenhado para 3 dias', detail: 'Os últimos 40 km do Caminho Português, adaptados a uma experiência de corrida.' },
      { icon: '🏠', label: 'Alojamento durante 2 noites', detail: 'Hospedagem selecionada ao longo do percurso.' },
      { icon: '☕', label: 'Pequeno-almoço', detail: 'Para começares os dias com energia suficiente para continuar a correr.' },
      { icon: '🤝', label: 'Apoio logístico', detail: 'Gestão prática da experiência ao longo dos 3 dias.' },
    ],
    not_includes: [
      'Transporte até ao ponto de partida',
      'Refeições, salvo indicação contrária',
      'Equipamento técnico pessoal',
      'Seguro pessoal de atividade',
      'Despesas de caráter pessoal',
    ],
    packing_list: [
      'Ténis de running/trail adequados',
      'Roupa técnica respirável',
      'Meias confortáveis',
      'Corta-vento leve',
      'Garrafa ou soft flask',
      'Boné ou viseira',
      'Protetor solar',
      'Muda de roupa',
      'Mochila ou colete de corrida',
      'Gel ou snacks energéticos',
      'Telemóvel carregado',
      'Artigos de higiene pessoal',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Se o cancelamento ocorrer após essa data e até 48 horas antes do início da actividade, o cancelamento tem um custo de 50%. A menos de 48 horas, não há direito a reembolso. Em caso de cancelamento pela Bored. ou pelo prestador por motivos de segurança, meteorologia ou força maior, oferecemos nova data ou reembolso total.',
    curiosities: [
      {
        title: 'O caminho muda quando o corres.',
        text: 'A mesma rota ganha outra escala quando deixas de a fazer a passo e a levas ao corpo inteiro. O que antes era contemplação passa a ser ritmo, respiração e decisão.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/10.png',
      },
      {
        title: '40 km podem parecer pouco até deixarem de parecer pouco.',
        text: 'Em corrida, a distância deixa de ser apenas métrica e passa a ser gestão de energia, cabeça e consistência. O corpo percebe isso antes de tu aceitares.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
      },
      {
        title: 'O Caminho continua a ser o Caminho.',
        text: 'Mesmo em versão corrida, continuam lá os marcos, as pedras gastas, as aldeias e a sensação estranha de estar a avançar por um percurso que já foi feito por milhares de pessoas antes de ti.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Entrada no caminho', description: 'Chegada e primeiro contacto com o percurso. A ideia é abrir pernas, entrar no ritmo e perceber logo que isto não é uma corrida qualquer — é um caminho com memória.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Ritmo e resistência', description: 'O dia mais exigente da experiência. O foco está em correr com intenção, gerir esforço e aceitar que o terreno, o corpo e a cabeça nem sempre estão de acordo.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Último impulso', description: 'Últimos quilómetros até à meta simbólica. O objetivo não é heroísmo; é chegar com a sensação de ter atravessado algo maior do que a distância.', order_index: 2 },
    ],
    faqs: [
      { question: 'Qual o nível físico necessário?', answer: 'Alto. A experiência pede conforto a correr vários quilómetros por dia, com recuperação limitada entre etapas.', order_index: 0 },
      { question: 'É preciso experiência em trail running?', answer: 'Ajuda, mas não é obrigatório. O importante é estares confortável em corrida prolongada e em terreno variável.', order_index: 1 },
      { question: 'É uma experiência espiritual?', answer: 'Pode ser, se quiseres. Mas acima de tudo é física, direta e honesta.', order_index: 2 },
      { question: 'A distância total é mesmo 40 km?', answer: 'Sim. O conceito foi pensado para manter a experiência compacta, intensa e realizável em 3 dias.', order_index: 3 },
    ],
  },

  // ── 11 ── CONQUISTA AS ONDAS (surf / Três Dias de Mar) ────────
  {
    slug: 'conquista-as-ondas',
    title: 'Três Dias de Mar',
    tagline: 'Primeiro cais, depois surfas.',
    description: 'Uma experiência de surf intensiva para quem quer começar do zero ou finalmente apanhar forma. Três dias entre técnica, água fria, quedas dignas e pequenas vitórias que sabem bem. Não é sobre parecer surfista. É sobre ganhar o direito a estar ali.',
    includes: [
      { icon: '🏄', label: 'Aulas de surf', detail: 'Acompanhamento técnico para iniciantes ou participantes em fase de evolução.' },
      { icon: '🏄', label: 'Pranchas e fatos', detail: 'Todo o equipamento incluído.' },
      { icon: '🏠', label: 'Alojamento', detail: '2 noites em alojamento selecionado.' },
      { icon: '☕', label: 'Pequeno-almoço', detail: 'Para começares os dias com energia.' },
    ],
    not_includes: [
      'Transporte até ao local',
      'Almoços e jantares, salvo indicação contrária',
      'Seguro pessoal',
      'Equipamento pessoal extra',
    ],
    packing_list: [
      'Fato de banho',
      'Toalha',
      'Chinelos',
      'Protetor solar',
      'Roupa confortável',
      'Garrafa de água',
      'Casaco leve',
      'Artigos de higiene pessoal',
    ],
    cancellations: 'Cancelamentos devem ser enviados por e-mail para bookings@boredtourist.com. O cancelamento é gratuito até 10 dias antes da partida. Entre 10 dias e 48 horas: 50% do valor. Menos de 48 horas: sem reembolso.',
    curiosities: [
      {
        title: 'Surf começa fora de água.',
        text: 'Boa parte do progresso vem de entender postura, leitura do mar, timing e segurança antes mesmo de apanhar a primeira onda.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png',
      },
      {
        title: 'A água fria é parte da lição.',
        text: 'Não é um detalhe. É um elemento central da experiência, e também uma das razões pelas quais cada vitória sabe melhor.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png',
      },
      {
        title: 'Ninguém nasce fluido.',
        text: 'No surf, a normalidade é cair, repetir e melhorar um pouco a cada tentativa. O estilo vem depois. Primeiro vem a insistência.',
        image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png',
      },
    ],
    itinerary: [
      { day_label: 'Dia 1', title: 'Chegada e primeiras bases', description: 'Introdução ao surf, segurança, técnica e primeiros contactos com o mar. O objetivo é perder a vergonha e ganhar leitura.', order_index: 0 },
      { day_label: 'Dia 2', title: 'Água, queda, repetição', description: 'Dia inteiro de prática, com foco em remar, levantar, equilibrar e perceber o tempo do mar. As quedas fazem parte do curso, não do erro.', order_index: 1 },
      { day_label: 'Dia 3', title: 'Consolidação e última sessão', description: 'Último dia para afinar técnica, ganhar confiança e sair da água com a sensação de que já não estás exatamente no ponto de partida.', order_index: 2 },
    ],
    faqs: [
      { question: 'Preciso de experiência?', answer: 'Não. A experiência foi pensada para iniciantes e para quem quer recuperar bases.', order_index: 0 },
      { question: 'A água é fria?', answer: 'Sim, e isso faz parte do pacote.', order_index: 1 },
      { question: 'Vou conseguir ficar em pé?', answer: 'Muito provavelmente sim, pelo menos algumas vezes. E isso já conta.', order_index: 2 },
    ],
  },
];

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

async function run() {
  console.log('\n🚀 BORED ORIGINALS — UPDATE DE COPY\n');
  console.log('='.repeat(50));

  let success = 0;
  let errors = 0;

  for (const update of updates) {
    const { slug, itinerary, faqs, curiosities, ...fields } = update;

    try {
      console.log(`\n📝 ${slug}...`);

      // 1. Actualizar campos principais
      const { data: adv, error: advErr } = await supabase
        .from('adventures')
        .update(fields)
        .eq('slug', slug)
        .select('id, title')
        .single();

      if (advErr) {
        console.error(`  ❌ aventura:`, advErr.message);
        errors++;
        continue;
      }

      const id = adv.id;
      console.log(`  ✅ "${adv.title}" actualizado`);

      // 2. Curiosidades
      if (curiosities?.length) {
        const { error } = await supabase
          .from('adventures')
          .update({ curiosities })
          .eq('id', id);
        if (error) console.error(`  ❌ curiosidades:`, error.message);
        else console.log(`  ✅ ${curiosities.length} curiosidades`);
      }

      // 3. Itinerário
      if (itinerary?.length) {
        await supabase.from('itinerary').delete().eq('adventure_id', id);
        const { error } = await supabase.from('itinerary').insert(
          itinerary.map(i => ({ ...i, adventure_id: id }))
        );
        if (error) console.error(`  ❌ itinerário:`, error.message);
        else console.log(`  ✅ ${itinerary.length} dias de itinerário`);
      }

      // 4. FAQs
      if (faqs?.length) {
        await supabase.from('faqs').delete().eq('adventure_id', id);
        const { error } = await supabase.from('faqs').insert(
          faqs.map(f => ({ ...f, adventure_id: id }))
        );
        if (error) console.error(`  ❌ FAQs:`, error.message);
        else console.log(`  ✅ ${faqs.length} FAQs`);
      }

      success++;

    } catch (err) {
      console.error(`  ❌ ERRO INESPERADO:`, err.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ ${success} aventuras actualizadas`);
  if (errors > 0) console.log(`❌ ${errors} erros`);
  console.log('\n');
}

run();
