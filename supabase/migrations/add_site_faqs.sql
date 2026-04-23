-- ============================================================
-- Site-wide FAQ (página de Apoio)
-- ============================================================

CREATE TABLE IF NOT EXISTS site_faq_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '❓',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_faqs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES site_faq_categories(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_faqs_category ON site_faqs(category_id, order_index);

-- RLS — leitura pública
ALTER TABLE site_faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_faqs            ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_faq_categories" ON site_faq_categories FOR SELECT USING (true);
CREATE POLICY "Public read site_faqs"           ON site_faqs            FOR SELECT USING (true);

-- ============================================================
-- SEED — categorias
-- ============================================================
INSERT INTO site_faq_categories (key, title, icon, order_index) VALUES
  ('reservas',      'Reservas',             '📅', 1),
  ('pagamentos',    'Pagamentos',           '💳', 2),
  ('cancelamentos', 'Cancelamentos',        '↩️', 3),
  ('aventuras',     'Sobre as Aventuras',   '🧭', 4),
  ('preparacao',    'Preparação',           '🎒', 5),
  ('seguranca',     'Segurança',            '🛡️', 6),
  ('contacto',      'Contacto',             '💬', 7)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- SEED — perguntas (usar subquery para obter category_id)
-- ============================================================

-- RESERVAS
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Como faço uma reserva?',
  'Escolhe a aventura, a data e segue para o checkout. Fácil. Sem drama.', 1
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Há reserva imediata ou pré-reserva?',
  'Depende da aventura e das datas. Em função da antecedência, umas abrem com reserva imediata, outras funcionam em pré-reserva.', 2
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que é a pré-reserva?',
  'É a tua forma de dizer "quero ir" antes de abrirmos vendas. Podes entrar na lista de espera, sem pagamento nem reserva de vaga, ou garantir logo o teu lugar, com um depósito de €50.', 3
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que é o botão "Entrar na Lista"?',
  'É para nos deixares o teu email e seres avisado quando abrirmos vendas. Simples, limpo e sem spam inútil.', 4
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso pré-reservar sem pagar tudo logo?',
  'Em algumas aventuras, sim. Nesses casos, podes garantir o lugar apenas com o pagamento do depósito.', 5
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Quando é que pago o resto?',
  'Será indicado no momento da reserva e por email. Sem surpresas escondidas.', 6
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Aceitam que eu reserve para outra pessoa?',
  'Sim, desde que os dados estejam corretos no momento da reserva.', 7
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Como posso pagar?',
  'Os pagamentos podem ser feitos via Cartão de Crédito, MbWay, Klarna, Google Pay, Apple Pay, Paypal e Revolut Pay.', 8
FROM site_faq_categories WHERE key = 'reservas';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Qual a segurança do sistema de pagamentos?',
  'Todos os pagamentos são processados através do Stripe, plataforma segura e certificada.', 9
FROM site_faq_categories WHERE key = 'reservas';

-- PAGAMENTOS
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Tenho de pagar tudo de uma vez?',
  'Nas aventuras com reserva imediata, sim. Nesses casos, o pagamento é feito na totalidade no momento da reserva.', 1
FROM site_faq_categories WHERE key = 'pagamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Se for pré-reserva, quanto pago?',
  'Podes ficar com o lugar através de um depósito, com valor fixo de 50€, para garantirmos o teu lugar.', 2
FROM site_faq_categories WHERE key = 'pagamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Porque é que existem duas modalidades de pagamento?',
  'Porque há aventuras com datas já abertas e outras que só são lançadas mais tarde. Nós adaptamo-nos ao calendário da experiência, não o contrário.', 3
FROM site_faq_categories WHERE key = 'pagamentos';

-- CANCELAMENTOS
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso cancelar a minha reserva?',
  'Podes, claro. A vida acontece.', 1
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Até quando é grátis cancelar?',
  'Até 10 dias antes da data da aventura.', 2
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E se cancelar até 48 horas antes?',
  'Nesse caso, o cancelamento tem um custo de 50%.', 3
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E com menos de 48 horas?',
  'Por regra, não há direito a reembolso. Estamos disponíveis para avaliar situações excepcionais, mas a análise é feita caso a caso.', 4
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Como faço para cancelar?',
  'Por e-mail, para bookings@boredtourist.com. Sempre por e-mail.', 5
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso mudar a data da minha reserva?',
  'Depende da disponibilidade e deve ser tratado por e-mail.', 6
FROM site_faq_categories WHERE key = 'cancelamentos';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E se a aventura for cancelada por vocês ou pelo operador?',
  'Em caso de cancelamento por nossa parte (inscrições insuficientes, condições meteorológicas extremas, força maior), oferecemos nova data ou reembolso total. Nunca ficas a perder.', 7
FROM site_faq_categories WHERE key = 'cancelamentos';

-- SOBRE AS AVENTURAS
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'A Bored Originals opera as experiências?',
  'Não. Somos uma plataforma tecnológica e de comercialização. As experiências são operacionalizadas por parceiros locais, experientes e certificados.', 1
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Então quem organiza no terreno?',
  'O operador local responsável por essa experiência.', 2
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que está incluído no preço?',
  'Depende da aventura. Cada página indica claramente o que está incluído e o que não está, de forma transparente.', 3
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que normalmente não está incluído?',
  'Normalmente, tudo o que estiver explicitamente referido como "não incluído" e/ou omisso na página da experiência.', 4
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'As aventuras são para iniciantes?',
  'Depende da aventura. Cada experiência tem um nível de dificuldade indicado. Algumas são acessíveis a qualquer pessoa, outras requerem preparação física. Lê bem a descrição antes de reservar — e se tiveres dúvidas, fala connosco.', 5
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso ir sozinho?',
  'Absolutamente. A maioria dos participantes vem sozinho e vai embora com amigos para a vida. É parte do conceito Bored.', 6
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Há mínimo ou máximo de participantes?',
  'Sim, e varia consoante a aventura. A Bored. reserva-se ao direito de cancelar qualquer experiência que não tenha atingido o número mínimo de inscritos, 15 dias antes do início da atividade.', 7
FROM site_faq_categories WHERE key = 'aventuras';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso pedir uma experiência privada?',
  'Podes e deves. Dependendo da aventura, podemos avaliar essa opção. Envia-nos um e-mail para bookings@boredtourist.com com a tua ideia, inspiração ou pedido de ajuda, e nós fazemos acontecer.', 8
FROM site_faq_categories WHERE key = 'aventuras';

-- PREPARAÇÃO
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que devo levar?',
  'A lista varia por experiência, mas regra geral: roupa confortável, calçado adequado e vontade de fazer algo diferente. Boa disposição é obrigatória e flexibilidade para acomodar imprevistos e surpresas é altamente recomendada.', 1
FROM site_faq_categories WHERE key = 'preparacao';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O equipamento técnico está incluído?',
  'Quando for necessário, sim. Isso será sempre indicado na página da experiência.', 2
FROM site_faq_categories WHERE key = 'preparacao';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E a alimentação?',
  'Também varia por aventura. Se houver refeições incluídas, isso estará assinalado.', 3
FROM site_faq_categories WHERE key = 'preparacao';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Tenho de estar em boa forma?',
  'Depende da aventura. Algumas pedem só curiosidade; outras pedem pernas, pulmão e juízo.', 4
FROM site_faq_categories WHERE key = 'preparacao';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso indicar restrições alimentares?',
  'Podes. Após a reserva, caso sintas necessidade de fazer algum pedido especial, relativo à tua dieta ou outro, deves enviar um e-mail para bookings@boredtourist.com com esses detalhes.', 5
FROM site_faq_categories WHERE key = 'preparacao';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Tenho uma dúvida antes da aventura. O que faço?',
  'Alguns dias antes da aventura recebes os últimos detalhes e os contactos diretos do teu guia. Para questões urgentes, envia um email com "URGENTE" no assunto e respondemos no próprio dia.', 6
FROM site_faq_categories WHERE key = 'preparacao';

-- SEGURANÇA
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'As experiências têm seguro?',
  'Algumas podem incluir cobertura específica. Em qualquer caso, recomendamos que verifiques sempre a informação da aventura e, se fizer sentido, que tenhas o teu próprio seguro.', 1
FROM site_faq_categories WHERE key = 'seguranca';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'É seguro fazer estas aventuras?',
  'Trabalhamos com operadores locais experientes e certificados. Ainda assim, como em qualquer experiência ativa, há sempre algum nível de risco.', 2
FROM site_faq_categories WHERE key = 'seguranca';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E se estiver mau tempo?',
  'Se o tempo comprometer a segurança ou a experiência, pode haver remarcação ou cancelamento. Em caso de remarcação, será sempre dada opção de reembolso.', 3
FROM site_faq_categories WHERE key = 'seguranca';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'O que é o conceito de detox digital?',
  'Em cada aventura, incentivamos (ou impomos) momentos sem telemóvel. Não é uma regra rígida — é um convite a estar presente. Acredita, é libertador.', 4
FROM site_faq_categories WHERE key = 'seguranca';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Posso usar o telemóvel em emergências?',
  'Sempre. A desconexão é um convite, nunca uma prisão. Em situação de emergência tens sempre acesso ao telemóvel e ao apoio da equipa.', 5
FROM site_faq_categories WHERE key = 'seguranca';

-- CONTACTO
INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Como vos posso contactar?',
  'Por e-mail: bookings@boredtourist.com. É o canal certo para reservas, alterações e cancelamentos. Podes também enviar-nos uma mensagem no Instagram @bored_tourist.', 1
FROM site_faq_categories WHERE key = 'contacto';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'E se tiver uma questão urgente?',
  'Escreve-nos por email com indicação de "URGENTE" no assunto.', 2
FROM site_faq_categories WHERE key = 'contacto';

INSERT INTO site_faqs (category_id, question, answer, order_index)
SELECT id, 'Onde posso saber das novas aventuras?',
  'Fica atento ao site, a @boredtourist no instagram e à nossa newsletter. As boas aventuras não gostam de ficar escondidas.', 3
FROM site_faq_categories WHERE key = 'contacto';
