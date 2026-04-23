/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { MouseEvent, FormEvent } from 'react';
import { MapPin, Flame, Zap, Compass, Tent, Mountain } from 'lucide-react';
import { getAdventures, getAdventureByIndex, joinNotifyList, subscribeNewsletter } from './lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function Navbar({ onConquista, onHistoria, onHome, onApoio, onAllExperiences }: { onConquista?: () => void; onHistoria?: () => void; onHome?: () => void; onApoio?: () => void; onAllExperiences?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className={`pointer-events-auto flex items-center justify-between px-8 md:px-14 py-5 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/[0.06]' : 'bg-transparent backdrop-blur-0 border-b border-transparent'}`}>
          {/* Left links — desktop only */}
          <div className="hidden md:flex items-center gap-10">
          </div>

          {/* Center logo — desktop only */}
          <button onClick={onHome} className="hidden md:block absolute left-1/2 -translate-x-1/2 focus:outline-none">
            <img
              src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png"
              alt="Bored Originals."
              className="h-14 w-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] hover:opacity-80 transition-opacity duration-200"
            />
          </button>

          {/* Right links — desktop only */}
          <div className="hidden md:flex items-center gap-10">
            <button onClick={onHistoria} className="text-white font-body text-base font-semibold tracking-[0.1em] uppercase hover:text-neon-yellow transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Sobre Nós</button>
            <button onClick={onApoio} className="text-white font-body text-base font-semibold tracking-[0.1em] uppercase hover:text-neon-yellow transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Apoio</button>
            <button onClick={onAllExperiences} className="bg-neon-yellow text-brutal-black px-5 py-2 text-sm font-body font-bold uppercase tracking-[0.12em] rounded-lg hover:bg-white transition-colors duration-300">
              Reservar
            </button>
          </div>

          {/* Mobile bar: logo center + hamburger right */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="focus:outline-none flex flex-col gap-[5px] p-1"
              aria-label="Abrir menu"
            >
              <span className="block w-6 h-[2px] bg-white rounded-full" />
              <span className="block w-6 h-[2px] bg-white rounded-full" />
              <span className="block w-4 h-[2px] bg-white rounded-full" />
            </button>

            {/* Logo centered */}
            <button onClick={onHome} className="absolute left-1/2 -translate-x-1/2 focus:outline-none">
              <img
                src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png"
                alt="Bored Originals"
                className="h-9 w-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
              />
            </button>

            {/* Reservar */}
            <button onClick={onAllExperiences} className="bg-neon-yellow text-brutal-black px-4 py-1.5 text-xs font-body font-bold uppercase tracking-[0.1em] rounded-lg">
              Reservar
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 md:hidden bg-brutal-black flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <img
              src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png"
              alt="Bored Originals"
              className="h-9 w-auto"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors focus:outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col flex-1 px-6 pt-8 gap-0">
            {[
              { label: 'Experiências', action: () => { onAllExperiences?.(); setMenuOpen(false); } },
              { label: 'Sobre Nós',    action: () => { onHistoria?.();      setMenuOpen(false); } },
              { label: 'Apoio',        action: () => { onApoio?.();         setMenuOpen(false); } },
            ].map(({ label, action }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.35 }}
                onClick={action}
                className="group flex items-center justify-between py-6 border-b border-white/[0.07] focus:outline-none"
              >
                <span className="text-white font-body font-extrabold text-[2rem] leading-none tracking-tight group-active:text-neon-yellow transition-colors">
                  {label}
                </span>
                <svg className="text-white/20 group-active:text-neon-yellow transition-colors" width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <path d="M0 7h18M12 1l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            ))}
          </nav>

          {/* Bottom area */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="px-6 pb-12 flex flex-col gap-4"
          >
            <button
              onClick={() => { onAllExperiences?.(); setMenuOpen(false); }}
              className="block w-full text-center bg-neon-yellow text-brutal-black font-body font-extrabold text-sm uppercase tracking-[0.18em] py-5 rounded-2xl active:bg-white transition-colors"
            >
              Reservar lugar
            </button>
            <p className="text-center text-white/15 font-body text-[10px] uppercase tracking-[0.3em]">Aventuras que valem a pena</p>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brutal-black">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://storage.googleapis.com/bored_tourist_media/videos/videofinal.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-brutal-black/20 to-brutal-black/40"></div>

      {/* Bottom left branding */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-10 left-6 z-10 flex flex-col gap-4"
      >
        <h1 className="text-[11vw] md:text-[3vw] leading-[0.95] font-body font-extrabold text-white tracking-tight">
          Aventuras<br />que valem a pena<span className="text-neon-yellow">.</span>
        </h1>
      </motion.div>

      {/* Scroll hint bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 right-6 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 opacity-40"
        >
          <div className="w-px h-10 bg-white"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const originals = [
  {
    title: "Subida ao Pico",
    desc: "Sobe ao pico mais alto de Portugal e dorme entre as nuvens. Vista garantida, sono não.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png",
    hoverVideo: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/vulcaovideo.mp4",
    comingSoon: false,
  },
  {
    title: "Descida da Costa",
    desc: "De norte a sul pela costa, sem pressa e com muito vento na cara.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png",
    comingSoon: false,
  },
  {
    title: "À Vela pelo Oceano",
    desc: "Navega em alto mar sem saber muito bem o que estás a fazer. É assim que começa.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png",
    comingSoon: true,
  },
  {
    title: "Cabine no Meio do Nada",
    desc: "Sem wifi. Sem pessoas. Só tu, os javalis e os teus próprios pensamentos.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/4.png",
    comingSoon: true,
  },
  {
    title: "Sobreviver 24h",
    desc: "Aprende a comer insetos, fazer fogo do nada e a não morrer no meio do bosque.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/5.png",
    comingSoon: true,
  },
  {
    title: "Aldeias Históricas de Mota",
    desc: "Percorre as aldeias mais históricas de Portugal em 50cc de puro terror e mecânica duvidosa.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png",
    comingSoon: false,
  },
  {
    title: "Rally pela N2 Velharias",
    desc: "Carros a cair aos bocados, sem GPS, caos total. Vais conseguir? Provavelmente não.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/8.png",
    comingSoon: false,
  },
  {
    title: "Trilhos Selvagens no Gerês",
    desc: "Caminhos que não aparecem no Google Maps. Só botas, mapa e instinto.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png",
    comingSoon: true,
  },
  {
    title: "Caminhos de Santiago a Correr",
    desc: "O Caminho de Santiago, mas sem tempo para filosofar. Só pernas e asfalto.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/10.png",
    comingSoon: true,
  },
  {
    title: "Até Marrocos de 4x4",
    desc: "Atravessa o estreito e mergulha no deserto. Bússola obrigatória, medo opcional.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/11.png",
    comingSoon: true,
  },
  {
    title: "Conquista as Montanhas",
    desc: "Altitudes que tiram o fôlego. Literalmente. Traz casaco.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png",
    comingSoon: true,
  },
  {
    title: "Conquista as Ondas",
    desc: "Caminha até não conseguires mais e depois vai surfar. Porque não pode ser só sofrimento.",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png",
    imageSaturate: 0.7,
    comingSoon: true,
  },
];

function NotifyModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Insere um email válido (ex: joao@exemplo.com).');
      return;
    }

    setIsLoading(true);
    setEmailError(null);
    try {
      await joinNotifyList(title, normalizedEmail);
      setSubmitted(true);
    } catch {
      setEmailError('Não foi possível guardar. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm p-8 relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all text-xl">×</button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <span className="bg-neon-yellow/15 text-neon-yellow text-[9px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full">Em breve</span>
            </div>
            <h3 className="text-white font-bold text-2xl leading-snug mb-2">{title}</h3>
            <p className="text-white/35 text-sm leading-relaxed mb-7">
              Esta aventura ainda está a ser preparada. Deixa o teu email e és o primeiro a saber quando abrirem as inscrições.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="o.teu@email.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                required
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-neon-yellow/60 transition-colors"
              />
              {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
              <button type="submit"
                disabled={isLoading}
                className="w-full bg-neon-yellow text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-colors disabled:opacity-50">
                {isLoading ? 'A guardar…' : 'Avisa-me →'}
              </button>
            </form>
            <p className="text-white/20 text-[10px] text-center mt-4 uppercase tracking-widest">Sem spam. Só o essencial.</p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="text-4xl mb-5">🤙</div>
            <h3 className="text-white font-bold text-xl mb-3">Ficaste na lista!</h3>
            <p className="text-white/40 text-sm leading-relaxed">Quando <span className="text-white/70">{title}</span> abrir inscrições, és o primeiro a saber.</p>
            <button onClick={onClose} className="mt-7 border border-white/15 text-white/50 px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:border-white/40 hover:text-white transition-colors">Fechar</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function BoredOriginals({ onConquista, onActivity, onBooking, onAllExperiences, adventures: dbAdventures = [] }: { onConquista?: () => void; onActivity?: (i: number) => void; onBooking?: (i: number) => void; onAllExperiences?: () => void; adventures?: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [dragged, setDragged] = useState(false);
  const [notifyItem, setNotifyItem] = useState<string | null>(null);
  const [quickBooking, setQuickBooking] = useState<{ date: { id: string; date_range: string; status: string; spots: number; price: string }; title: string; image?: string; location?: string } | null>(null);

  const openBooking = (dbIndex: number) => {
    const adv = dbAdventures.find((a: any) => (a.index ?? 0) === dbIndex);
    if (!adv) return;
    const firstDate = (adv.activity_dates ?? []).find((d: any) => d.status !== 'esgotado') ?? adv.activity_dates?.[0];
    const d = firstDate ?? { id: adv.id, date_range: 'A definir', status: 'disponivel', spots: adv.max_people ?? 10, price: adv.price ?? '0€' };
    setQuickBooking({ date: { id: d.id, date_range: d.date_range, status: d.status, spots: d.spots, price: d.price }, title: adv.title, image: adv.hero_image, location: adv.location });
  };

  // Usar dados do Supabase se disponíveis, senão fallback para os hardcoded
  const items = dbAdventures.length > 0
    ? dbAdventures.map((a: any, i: number) => {
        const nextDate = (a.activity_dates ?? []).find((d: any) => d.status !== 'esgotado');
        return {
          title: a.title,
          desc: a.tagline || a.description,
          image: a.card_image,
          hoverVideo: a.hover_video || undefined,
          comingSoon: a.coming_soon,
          price: a.price ?? null,
          nextDate: nextDate?.date_range ?? null,
          _dbIndex: a.index ?? i,
        };
      })
    : originals.map((o, i) => ({ ...o, nextDate: null, _dbIndex: i }));

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    setDragged(false);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.8;
    if (Math.abs(walk) > 5) setDragged(true);
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  return (
    <section id="originals" className="bg-brutal-black relative z-10 pt-24 pb-0">
      {notifyItem && <NotifyModal title={notifyItem} onClose={() => setNotifyItem(null)} />}
      {quickBooking && <BookingModal date={quickBooking.date} activityTitle={quickBooking.title} activityImage={quickBooking.image} activityLocation={quickBooking.location} onClose={() => setQuickBooking(null)} onHome={() => setQuickBooking(null)} />}
      {/* Header */}
      <div className="px-4 md:px-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="text-white/60 font-body text-[10px] uppercase tracking-[0.4em] mb-4">As nossas experiências</p>
            <h2 className="text-4xl md:text-7xl font-body font-bold text-white leading-[0.9]">
              Bored.<br/><span className="text-neon-yellow">Originals</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 480, behavior: 'smooth' })}
              className="flex items-center gap-3 text-white/30 hover:text-white transition-colors duration-300 group/arrow"
            >
              <span className="font-body text-[10px] uppercase tracking-widest text-white/70">Arrasta para explorar</span>
              <div className="w-9 h-9 rounded-full border border-white/15 group-hover/arrow:border-neon-yellow/60 flex items-center justify-center transition-colors duration-300">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Drag scroll track */}
      <div
        ref={scrollRef}
        className="overflow-x-auto select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="flex gap-4 md:gap-5 px-4 md:px-16 pb-16" style={{ width: 'max-content' }}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              onClick={(e) => { if (!dragged && !(e.target as HTMLElement).closest('button')) { onActivity?.((item as any)._dbIndex ?? i); } }}
              className="group relative flex-shrink-0 overflow-hidden rounded-3xl"
              style={{ width: 'clamp(260px, 72vw, 520px)', aspectRatio: (item as any).cardAspectRatio ?? '2/3', pointerEvents: dragged ? 'none' : 'auto', cursor: 'pointer' }}
            >
              <img
                src={item.image}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out brightness-[1.05] contrast-[1.05] ${ (item as any).hoverVideo ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                style={{ objectPosition: (item as any).objectPosition ?? 'center center', filter: `saturate(${(item as any).imageSaturate ?? 1.3}) brightness(1.05) contrast(1.05)` }}
                draggable={false}
              />
              {(item as any).hoverVideo && (
                <video
                  src={(item as any).hoverVideo}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"></div>

              {/* Price tag — top left */}
              {(item as any).price && (
                <div className="absolute top-6 left-6">
                  <span className="bg-neon-yellow text-brutal-black font-body text-sm font-extrabold tracking-tight px-4 py-2 rounded-full shadow-lg">
                    {(item as any).price}
                  </span>
                </div>
              )}
              {/* Date — top right */}
              <div className="absolute top-6 right-6">
                <span className="bg-white/15 backdrop-blur-sm text-white font-body text-xs font-semibold tracking-[0.08em] px-3 py-2 rounded-full">
                  {item.comingSoon ? 'Em breve' : ((item as any).nextDate ?? 'Em breve')}
                </span>
              </div>

              {/* Content bottom */}
              <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col">
                {/* Title — always visible, slides up on hover */}
                <h3 className="text-2xl md:text-3xl font-body font-bold text-white leading-snug transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:text-neon-yellow">
                  {item.title}
                </h3>
                {/* Description + buttons — hidden by default, slide in on hover */}
                <div className="grid transition-all duration-500 ease-out grid-rows-[0fr] group-hover:grid-rows-[1fr] group-hover:mt-3">
                  <div className="overflow-hidden">
                    <p className="text-white/55 font-body text-xs leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                        <button onClick={e => { e.stopPropagation(); if (item.comingSoon) { setNotifyItem(item.title); } else { openBooking((item as any)._dbIndex ?? i); } }} className="bg-neon-yellow text-brutal-black px-4 py-2 text-[10px] font-body font-bold uppercase tracking-[0.15em] rounded-xl hover:bg-white transition-colors">
                          {item.comingSoon ? 'Entrar na lista' : 'Reservar'}
                        </button>
                        <button onClick={e => { e.stopPropagation(); onActivity?.((item as any)._dbIndex ?? i); }} className="border border-white/20 text-white/60 px-4 py-2 text-[10px] font-body font-medium uppercase tracking-[0.15em] rounded-xl hover:border-white/60 hover:text-white transition-colors">
                          Saber mais
                        </button>
                      </div>
                  </div>
                </div>
              </div>

              {/* Hover border glow */}
              <div className={`absolute inset-0 rounded-3xl ring-1 ring-white/5 transition-all duration-500 pointer-events-none ${item.comingSoon ? 'group-hover:ring-white/10' : 'group-hover:ring-neon-yellow/30'}`}></div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* CTA below carousel */}
      <div className="flex justify-center pb-20 pt-2">
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={onAllExperiences}
          className="group flex items-center gap-3 bg-white hover:bg-neon-yellow text-brutal-black px-8 py-4 rounded-2xl transition-all duration-300"
        >
          <span className="font-body font-bold text-sm uppercase tracking-[0.18em]">Descobre todas as experiências</span>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-colors duration-300"><path d="M0 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.button>
      </div>
    </section>
  );
}

const proximasSaidas = [
  {
    location: "AÇORES",
    title: "Subida ao Pico",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png",
    dateRange: "18–20 Jul",
    year: "2025",
    spots: "3 lugares disponíveis",
    urgent: true,
    spotsCount: 3,
    activityIndex: 0,
  },
  {
    location: "ALENTEJO",
    title: "Descida da Costa",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png",
    dateRange: "1–3 Ago",
    year: "2025",
    spots: "5 lugares disponíveis",
    urgent: false,
    spotsCount: 5,
    activityIndex: 1,
  },
  {
    location: "SERRA",
    title: "Sobreviver 24h",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/5.png",
    dateRange: "22–23 Ago",
    year: "2025",
    spots: "2 lugares disponíveis",
    urgent: true,
    spotsCount: 2,
    activityIndex: 4,
  },
  {
    location: "ATLÂNTICO",
    title: "Conquista as Ondas",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png",
    dateRange: "5–7 Set",
    year: "2025",
    spots: "6 lugares disponíveis",
    urgent: false,
    spotsCount: 6,
    activityIndex: 11,
  },
  {
    location: "MARROCOS",
    title: "Até Marrocos de 4x4",
    image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/11.png",
    dateRange: "10–20 Out",
    year: "2025",
    spots: "4 lugares disponíveis",
    urgent: false,
    spotsCount: 4,
    activityIndex: 9,
  },
];

const PT_MONTHS: Record<string, number> = { 'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6, 'Jul': 7, 'Ago': 8, 'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12 };
function parseDateRangeToNum(dr: string): number {
  const m = dr.match(/(\d+)\s+(\w{3})\s+(\d{4})/);
  if (!m) return 99999999;
  return parseInt(m[3]) * 10000 + (PT_MONTHS[m[2]] ?? 0) * 100 + parseInt(m[1]);
}

function ProximasSaidas({ onConquista, onActivity, onBooking, dbAdventures }: { onConquista?: () => void; onActivity?: (i: number) => void; onBooking?: (i: number) => void; dbAdventures?: any[] }) {
  const [quickBooking, setQuickBooking] = useState<{ date: { id: string; date_range: string; status: string; spots: number; price: string }; title: string; image?: string; location?: string } | null>(null);

  const openBooking = (activityIndex: number) => {
    const adv = (dbAdventures ?? []).find((a: any) => (a.index ?? 0) === activityIndex);
    if (!adv) return;
    const firstDate = (adv.activity_dates ?? []).find((d: any) => d.status !== 'esgotado') ?? adv.activity_dates?.[0];
    const d = firstDate ?? { id: adv.id, date_range: 'A definir', status: 'disponivel', spots: adv.max_people ?? 10, price: adv.price ?? '0€' };
    setQuickBooking({ date: { id: d.id, date_range: d.date_range, status: d.status, spots: d.spots, price: d.price }, title: adv.title, image: adv.hero_image, location: adv.location });
  };

  const fromDb = dbAdventures && dbAdventures.length > 0
    ? dbAdventures.filter(a => a.activity_dates?.length > 0).flatMap((a: any) =>
        (a.activity_dates ?? []).slice(0, 1).map((d: any) => ({
          location: a.location?.toUpperCase() ?? '',
          title: a.title,
          image: a.hero_image,
          dateRange: d.date_range,
          year: '',
          spots: d.spots != null ? `${d.spots} lugares disponíveis` : '',
          spotsCount: d.spots != null ? Number(d.spots) : null,
          urgent: d.status === 'apreencher' || (d.spots != null && Number(d.spots) < 4),
          activityIndex: a.index ?? 0,
          _dateNum: parseDateRangeToNum(d.date_range),
        }))
      ).sort((a: any, b: any) => a._dateNum - b._dateNum).slice(0, 6)
    : [];
  const items = fromDb.length > 0 ? fromDb : proximasSaidas;

  return (
    <section id="proximas-saidas" className="bg-brutal-black min-h-screen flex flex-col justify-center py-16 px-4 md:px-20">
      {quickBooking && <BookingModal date={quickBooking.date} activityTitle={quickBooking.title} activityImage={quickBooking.image} activityLocation={quickBooking.location} onClose={() => setQuickBooking(null)} onHome={() => setQuickBooking(null)} />}
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full mb-14 flex items-end justify-between">
        <div>
          <p className="text-white/30 font-body text-[11px] uppercase tracking-[0.3em] font-semibold mb-4">Reserva o teu lugar</p>
          <h2 className="text-4xl md:text-8xl font-body font-extrabold text-white leading-none tracking-tight">Próximas Saídas</h2>
        </div>
        <p className="text-white/25 font-body text-sm text-right leading-relaxed hidden md:block">
          Grupos reduzidos.<br />Vagas limitadas.
        </p>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto flex flex-col gap-4 w-full">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/5 border border-white/[0.07] rounded-2xl px-5 py-4 cursor-pointer hover:bg-white/10 transition-colors duration-300"
            onClick={() => onActivity?.((item as any).activityIndex ?? 0)}
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* Top row: thumbnail info + date */}
            <div className="flex items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
              {/* Title only */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-white font-body font-extrabold text-lg sm:text-2xl leading-snug truncate">{item.title}</span>
              </div>

              {/* Date + Spots */}
              <div className="flex flex-col items-end flex-shrink-0 sm:mr-6">
                <span className="font-body font-bold text-white text-base sm:text-xl leading-none">{item.dateRange}</span>
                {item.year && <span className="font-body text-xs text-white/30 mt-1">{item.year}</span>}
                <span className={`font-body text-[10px] font-bold uppercase tracking-[0.15em] mt-1 ${
                  (item as any).spotsCount != null && (item as any).spotsCount < 4
                    ? 'text-neon-yellow'
                    : item.urgent ? 'text-neon-yellow' : 'text-white/25'
                }`}>{item.spots}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={e => { e.stopPropagation(); openBooking((item as any).activityIndex ?? 0); }}
              className="w-full sm:w-auto flex-shrink-0 bg-white text-brutal-black font-body font-bold text-[11px] uppercase tracking-[0.15em] px-6 py-3 sm:py-4 rounded-xl hover:bg-neon-yellow transition-colors duration-300"
            >
              Reservar
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function OQueNosDiferencia({ onHistoria }: { onHistoria?: () => void }) {
  return (
    <section id="sobre" className="bg-neon-yellow overflow-hidden px-4 md:px-12 py-10 md:py-14">

      {/* 3-col grid: texto | reel | 2 fotos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* COL 1 — título em cima, texto + botão em baixo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-between py-6 md:py-2 pr-4"
        >
          <h2 className="text-[clamp(2.2rem,8vw,5rem)] font-body font-extrabold text-brutal-black leading-[0.85] tracking-tight">
            AVENTURA?<br />
            <em className="italic">É connosco.</em>
          </h2>
          <div className="mt-8 md:mt-0">
            <p className="text-brutal-black font-body text-base md:text-xl leading-[1.6] mb-7">
Lisboa até ao Qatar à boleia, atravessar os himalaias de scooter, ir de luanda até maputo com um toyota de 1994.. são apenas algumas das aventuras que nós já vivemos.. gostamos de explorar o desconhecido e agora queremos te dar a ti a oportunidade de viveres experiências únicas.            </p>
            <button
              onClick={onHistoria}
              className="bg-brutal-black text-neon-yellow font-body font-bold text-xs uppercase tracking-[0.18em] px-6 py-3.5 rounded-xl hover:bg-brutal-black/80 transition-colors duration-300"
            >
              A nossa história →
            </button>
          </div>
        </motion.div>

        {/* COL 2 — reel, ocupa toda a altura */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden flex items-center justify-center bg-black"
          style={{ height: 'clamp(420px, 80vw, 1100px)' }}
        >
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
            src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/nos.mp4"
          />
        </motion.div>

        {/* COL 3 — 2 fotos empilhadas */}
        <div className="flex flex-col gap-4" style={{ height: 'clamp(420px, 80vw, 1100px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl overflow-hidden"
            style={{ flex: 1, minHeight: 0 }}
          >
            <img
              src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/neve.jpeg"
              alt="Equipa Bored"
              className="w-full h-full object-cover object-center saturate-[1.1]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="rounded-3xl overflow-hidden"
            style={{ flex: 1, minHeight: 0 }}
          >
            <img
              src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/motofoto.JPG"
              alt="Aventura"
              className="w-full h-full object-cover saturate-[1.1]"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}

const spotsPortugal = [
  {
    category: 'PRAIA',
    title: 'Praia do Amado',
    desc: 'A praia mais selvagem do Alentejo. Ondas perfeitas, sem multidões.',
    image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png',
  },
  {
    category: 'PARQUE NATURAL',
    title: 'Serra da Estrela',
    desc: 'O ponto mais alto de Portugal continental. Para trilhar no inverno e no verão.',
    image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png',
  },
  {
    category: 'ATIVIDADE',
    title: 'Canyoning no Gerês',
    desc: 'Saltos, rapel e água gelada no coração do único parque nacional português.',
    image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png',
  },
];

function IntroPortugal({ onConquista }: { onConquista?: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  const scale  = useTransform(scrollYProgress, [0, 0.55], [1, 6]);
  const mapX   = useTransform(scrollYProgress, [0, 0.55], ['0%', '18%']);
  const mapY   = useTransform(scrollYProgress, [0, 0.55], ['0%', '12%']);

  // Fase 1: visível logo desde o início, fade out até 0.38
  const introOpacity = useTransform(scrollYProgress, [0, 0.25, 0.38], [1, 1, 0]);
  // Mapa: visível na fase 1, some com ela
  const mapOpacity   = useTransform(scrollYProgress, [0, 0.3, 0.45], [1, 1, 0]);
  // Fase 2: entra em 0.4, sai em 0.62→0.72
  const ptOpacity    = useTransform(scrollYProgress, [0.4, 0.52, 0.65, 0.74], [0, 1, 1, 0]);
  const ptScale      = useTransform(scrollYProgress, [0.4, 0.55], [0.85, 1]);
  // Fase 3: entra só depois de PORTUGAL sair
  const spotsOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);
  const spotsY       = useTransform(scrollYProgress, [0.75, 0.88], [40, 0]);

  const portugueseSpots = [
    { name: 'Praia do Amado',       region: 'Alentejo',        desc: 'A praia mais selvagem do litoral.',                      image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/praiadoamado.jpg' },
    { name: 'Aldeia de Drave',      region: 'Beira Interior',  desc: 'Uma aldeia mágica escondida no interior de Portugal.',     image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/aldeiadrave.jpg' },
    { name: 'Rafting no Paiva',     region: 'Parque Natural',  desc: 'Adrenalina pura nas águas do rio Paiva.',                  image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/rafting%20paiva.jpg' },
    { name: 'Passadiços do Paiva',  region: 'Arouca',          desc: 'Uma caminhada suspensa sobre o rio Paiva.',                image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/passadisos.jpg' },
    { name: 'Pastor por um Dia',    region: 'Açores',          desc: 'Vive um dia como pastor nas montanhas do Pico.',           image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pastor.jpg' },
    { name: 'Vale das Buracas',     region: 'Beira Interior',  desc: 'Formações rochosas únicas no meio do vale.',                 image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/buracas.jpg' },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#060608]" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">

        {/* Mapa mundo com zoom — globo */}
        <motion.div
          style={{ scale, x: mapX, y: mapY, opacity: mapOpacity }}
          className="absolute inset-0 flex items-center justify-center will-change-transform"
        >
          {/* Máscara circular para dar efeito de globo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div style={{
              width: '70vmin',
              height: '70vmin',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 120px 50px rgba(30,100,255,0.2), 0 0 60px 20px rgba(30,100,255,0.3), inset 0 0 80px 30px rgba(0,0,0,0.7)',
              border: '1px solid rgba(80,160,255,0.2)',
            }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png"
                alt="World map"
                className="w-full h-full object-cover"
                style={{
                  filter: 'invert(1) sepia(1) saturate(0) brightness(0.25)',
                  transform: 'scale(1.1)',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #060608 100%)' }} />

        {/* Fase 1 — "Já explorámos o mundo" */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
        >
          <p className="text-white/20 font-body text-[10px] uppercase tracking-[0.5em] mb-6">50+ países · 6 continentes</p>
          <h2 className="text-[clamp(2.2rem,8vw,9rem)] font-body font-extrabold text-white leading-[0.85] tracking-tight">
            Já explorámos<br />
            <em className="italic text-white/30">o mundo.</em>
          </h2>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-16 flex flex-col items-center gap-2 opacity-30"
          >
            <p className="text-white text-[9px] uppercase tracking-[0.4em]">Continua a scrollar</p>
            <div className="w-px h-10 bg-white" />
          </motion.div>
        </motion.div>

        {/* Fase 2 — PORTUGAL */}
        <motion.div
          style={{ opacity: ptOpacity, scale: ptScale }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="mb-4"
          >
            <div className="w-5 h-5 rounded-full bg-neon-yellow shadow-[0_0_30px_8px_rgba(255,230,0,0.4)] mx-auto" />
          </motion.div>
          <h2
            className="font-body font-extrabold text-neon-yellow leading-none tracking-tight text-center px-8"
            style={{ fontSize: 'clamp(1.8rem, 8vw, 9rem)' }}
          >
            Agora queremos<br />mostrar-te Portugal.
          </h2>
        </motion.div>

        {/* Fase 3 — Spots */}
        <motion.div
          style={{ opacity: spotsOpacity, y: spotsY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-20 gap-6"
        >
          <div className="text-center max-w-2xl mb-2">
            <p className="text-white/65 font-body text-xl md:text-2xl leading-[1.7]">
              Para além de todas as experiências que estamos a promover, queremos que tenhas acesso a outras aventuras, locais e experiências que achamos que devias conhecer&nbsp;😉
            </p>
          </div>

          {/* Cards — 2 linhas × 3 colunas */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-2.5 w-full max-w-5xl" style={{ height: 'auto' }}>
            {portugueseSpots.map((spot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                style={{ isolation: 'isolate', height: 'clamp(160px, 30vw, 240px)' }}
              >
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover saturate-[1.15] group-hover:scale-[1.06] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                <div className="absolute top-4 left-4">
                  <span className="text-white/70 font-body font-bold text-[8px] uppercase tracking-[0.3em]">{spot.region}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-6 h-0.5 bg-neon-yellow mb-3" />
                  <p className="text-white font-body font-extrabold text-lg leading-tight tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mb-1.5">{spot.name}</p>
                  <p className="text-white/70 font-body text-xs leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{spot.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <p className="text-white/40 font-body text-sm text-center leading-relaxed">
              Subscreve a nossa newsletter para receberes todas as semanas recomendações que não vais querer perder!
            </p>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex w-full gap-2"
            >
              <input
                type="email"
                placeholder="o.teu@email.com"
                required
                className="flex-1 bg-white/8 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-body placeholder-white/25 focus:outline-none focus:border-neon-yellow/50 transition-colors"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-neon-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-[0.15em] px-6 py-3.5 rounded-xl hover:bg-white transition-colors duration-300 whitespace-nowrap"
              >
                Subscrever →
              </button>
            </form>
            <p className="text-white/15 font-body text-[10px] uppercase tracking-widest">Sem spam. Só o essencial.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function AllExperiencesPage({ onBack, onActivity, onBooking, adventures }: { onBack: () => void; onActivity: (i: number) => void; onBooking?: (i: number) => void; adventures: any[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todas' | 'disponiveis' | 'embreve'>('todas');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [quickBooking, setQuickBooking] = useState<{ date: { id: string; date_range: string; status: string; spots: number; price: string }; title: string; image?: string; location?: string } | null>(null);

  const openBooking = (index: number) => {
    const adv = adventures.find((a: any) => (a.index ?? 0) === index);
    if (!adv) return;
    const firstDate = (adv.activity_dates ?? []).find((d: any) => d.status !== 'esgotado') ?? adv.activity_dates?.[0];
    const d = firstDate ?? { id: adv.id, date_range: 'A definir', status: 'disponivel', spots: adv.max_people ?? 10, price: adv.price ?? '0€' };
    setQuickBooking({ date: { id: d.id, date_range: d.date_range, status: d.status, spots: d.spots, price: d.price }, title: adv.title, image: adv.hero_image, location: adv.location });
  };

  const items = (adventures.length > 0 ? adventures.map((a: any, i: number) => ({
    title: a.title,
    desc: a.description,
    image: a.card_image,
    comingSoon: a.coming_soon,
    location: a.location ?? '',
    price: a.price ?? null,
    priceNum: a.price ? parseInt(String(a.price).replace(/[^0-9]/g, ''), 10) || 0 : 0,
    index: a.index ?? i,
  })) : originals.map((o, i) => ({ ...o, location: '', price: null, priceNum: 0, index: i })))
    .filter(item => {
      const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'todas' ? true : filter === 'disponiveis' ? !item.comingSoon : item.comingSoon;
      return matchSearch && matchFilter;
    });

  if (priceSort !== 'none') {
    items.sort((a, b) => {
      const pa = (a as any).priceNum ?? 0;
      const pb = (b as any).priceNum ?? 0;
      return priceSort === 'asc' ? pa - pb : pb - pa;
    });
  }

  return (
    <div className="min-h-screen bg-brutal-black selection:bg-neon-yellow selection:text-brutal-black">
      {quickBooking && <BookingModal date={quickBooking.date} activityTitle={quickBooking.title} activityImage={quickBooking.image} activityLocation={quickBooking.location} onClose={() => setQuickBooking(null)} onHome={() => setQuickBooking(null)} />}
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-brutal-black/95 backdrop-blur-md border-b border-white/[0.06] px-6 md:px-12 py-4 flex items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 font-body text-sm">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M16 6H2M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Voltar
        </button>
        <div className="flex items-center">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored" className="h-10 w-auto" />
        </div>
        <div className="w-16" />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Sidebar filters — desktop only */}
        <aside className="hidden md:flex flex-col gap-6 w-64 flex-shrink-0 px-8 pt-12 border-r border-white/[0.06] sticky top-[61px] self-start h-[calc(100vh-61px)] overflow-y-auto">
          <div>
            <p className="text-white/50 font-body text-[10px] uppercase tracking-[0.3em] mb-4">Pesquisar</p>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input
                type="text"
                placeholder="Buscar experiência..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-white text-xs font-body placeholder-white/35 focus:outline-none focus:border-neon-yellow/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <p className="text-white/50 font-body text-[10px] uppercase tracking-[0.3em] mb-4">Disponibilidade</p>
            <div className="flex flex-col gap-2">
              {(['todas', 'disponiveis', 'embreve'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-left px-4 py-2.5 rounded-xl font-body text-xs font-medium transition-all duration-200 ${filter === f ? 'bg-neon-yellow text-brutal-black' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  {f === 'todas' ? 'Todas' : f === 'disponiveis' ? 'Disponíveis agora' : 'Em breve'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/50 font-body text-[10px] uppercase tracking-[0.3em] mb-4">Ordenar por preço</p>
            <div className="flex flex-col gap-2">
              {([['none', 'Sem ordenação'], ['asc', 'Preço crescente ↑'], ['desc', 'Preço decrescente ↓']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setPriceSort(val)}
                  className={`text-left px-4 py-2.5 rounded-xl font-body text-xs font-medium transition-all duration-200 ${priceSort === val ? 'bg-neon-yellow text-brutal-black' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pb-8">
            <p className="text-white/40 font-body text-[10px] leading-relaxed">{items.length} experiência{items.length !== 1 ? 's' : ''}</p>
          </div>
        </aside>

        {/* Main content column (mobile: full width vertical; desktop: flex-1) */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Mobile sticky filter bar */}
          <div className="md:hidden sticky top-[61px] z-30 bg-brutal-black/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input
                type="text"
                placeholder="Pesquisar experiência..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white text-sm font-body placeholder-white/30 focus:outline-none focus:border-neon-yellow/40 transition-colors"
              />
            </div>
            {/* Filter + sort pills */}
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {(['todas', 'disponiveis', 'embreve'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-semibold transition-all ${filter === f ? 'bg-neon-yellow text-brutal-black' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                  {f === 'todas' ? 'Todas' : f === 'disponiveis' ? 'Disponíveis' : 'Em breve'}
                </button>
              ))}
              <div className="w-px bg-white/10 flex-shrink-0 mx-1" />
              {([['none', 'Preço'], ['asc', 'Preço ↑'], ['desc', 'Preço ↓']] as const).map(([val, label]) => (
                <button key={val} onClick={() => setPriceSort(val)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-xs font-semibold transition-all ${priceSort === val ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <main className="px-4 md:px-10 pt-8 pb-24">
            <div className="mb-6 md:mb-8">
              <h1 className="text-4xl md:text-6xl font-body font-extrabold text-white leading-none tracking-tight">
                Todas as<br /><span className="text-neon-yellow">Experiências</span>
              </h1>
              <p className="text-white/30 font-body text-xs mt-2">{items.length} experiência{items.length !== 1 ? 's' : ''}</p>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-white/20">
                <p className="font-body text-lg">Nenhuma experiência encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    onClick={() => onActivity(item.index)}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer"
                    style={{ aspectRatio: '2/3' }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ filter: 'saturate(1.2) brightness(1.0)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {item.comingSoon && (
                        <span className="bg-neon-yellow text-brutal-black font-body text-[8px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-full">Em breve</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 inset-x-0 p-3 md:p-4">
                      <h3 className="text-white font-body font-bold text-sm md:text-lg leading-snug group-hover:text-neon-yellow transition-colors duration-300">{item.title}</h3>
                      {(item as any).price && (
                        <p className="text-neon-yellow font-body text-xs md:text-sm font-extrabold mt-1">{(item as any).price}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!item.comingSoon && (
                          <button
                            onClick={e => { e.stopPropagation(); openBooking(item.index); }}
                            className="bg-neon-yellow text-brutal-black px-3 py-1.5 text-[9px] md:text-[10px] font-body font-bold uppercase tracking-[0.15em] rounded-lg hover:bg-white transition-colors"
                          >Reservar</button>
                        )}
                        <button
                          onClick={e => { e.stopPropagation(); onActivity(item.index); }}
                          className="border border-white/30 text-white/70 px-3 py-1.5 text-[9px] md:text-[10px] font-body font-medium uppercase tracking-[0.15em] rounded-lg hover:border-white/70 hover:text-white transition-colors"
                        >Saber mais</button>
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-neon-yellow/25 transition-all duration-300" />
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function NossaHistoriaPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-brutal-black selection:bg-neon-yellow selection:text-brutal-black overflow-x-hidden">

      {/* Nav */}
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="fixed top-6 left-6 z-40"
      >
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">
          <button onClick={onBack} className="text-white/50 font-body text-xs uppercase tracking-[0.15em] hover:text-white transition-colors">← Voltar</button>
          <div className="w-px h-3 bg-white/20" />
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored" className="h-7 w-auto" />
        </div>
      </motion.nav>

      {/* ── HERO full-bleed ── */}
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src="/foto4.jpeg"
          alt="Equipa Bored"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-brutal-black" />
        <div className="absolute bottom-16 left-8 md:left-16 right-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/50 font-body text-[10px] uppercase tracking-[0.35em] mb-4"
          >A nossa história</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="text-[clamp(2.5rem,9vw,9rem)] font-body font-extrabold text-white leading-[0.85] tracking-tight"
          >
            Nascemos<br />do cansaço<br />
            <em className="not-italic text-neon-yellow">do conforto.</em>
          </motion.h1>
        </div>
      </div>

      {/* ── PROPÓSITO — texto grande centrado ── */}
      <div className="px-8 md:px-20 py-28 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-neon-yellow font-body text-[10px] uppercase tracking-[0.35em] mb-8"
        >O nosso propósito</motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="space-y-7"
        >
          <p className="text-white text-[clamp(1.5rem,3.5vw,2.8rem)] leading-[1.3] font-body font-bold">
            Estamos cá para respeitar o planeta, criar experiências memoráveis, disseminar empatia e valorizar o conhecimento local. Queremos escapar das viagens aborrecidas e percorrer os cantinhos menos vistos de Portugal, numa missão de aventura e valorização do património.
          </p>
          <p className="text-white/80 text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.55] font-body">
            Somos por uma vida cheia, pelo prazer inigualável do ar puro, pela emoção, pela criatividade, pela autenticidade e pelo sonho. Queremos dar voz e espaço de afirmação a operadores locais, partindo das suas histórias e saberes para multiplicar momentos e sensações inesquecíveis.
          </p>
          <p className="text-white/80 text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.55] font-body">
            Queremos fugir do discurso ensaiado, da rotina dos dias, das fotos perfeitas e dos destinos previsíveis.
          </p>
          <p className="text-white/80 text-[clamp(1.1rem,2.2vw,1.6rem)] leading-[1.55] font-body">
            Estamos aqui para vos ajudar a criar histórias tão marcantes e únicas que o vosso eu do futuro vos vai agradecer terem-nas vivido.
          </p>
        </motion.div>
      </div>

      {/* ── FULL SCREEN: foto esquerda + texto direita ── */}
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col md:flex-row">
        {/* Left — full-height image */}
        <div className="relative w-full md:w-1/2 overflow-hidden" style={{ minHeight: 'clamp(420px, 100vw, 600px)' }}>
          <motion.img
            src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/DSC08797%202.JPG"
            alt=""
            initial={{ scale: 1.05 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 15%' }}
          />
        </div>
        {/* Right — text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3 }}
          className="relative z-10 flex flex-col justify-center items-end w-full md:w-1/2 px-10 md:px-20 py-20 text-right bg-brutal-black"
        >
          <p className="text-white/50 font-body text-[10px] uppercase tracking-[0.35em] mb-6">Porque criámos a Bored.</p>
          <p className="text-white text-lg md:text-2xl leading-[1.75] font-body mb-6">
            Acreditamos que as melhores histórias acontecem quando nos afastamos da rotina. E que a aventura é o único antídoto para os desassossegados, os inquietos e os curiosos.
          </p>
          <p className="text-white/70 text-base md:text-lg leading-[1.75] font-body mb-6">
            Como nós, que já fomos à boleia de Lisboa ao Qatar, percorremos o Líbano vendados e sem dinheiro nem telemóvel, atravessámos os EUA à boleia, completámos um Ironman com pouco treino, fizemos voluntariado na Índia ou vivemos com tribos na Colômbia.
          </p>
          <p className="text-white/70 text-base md:text-lg leading-[1.75] font-body mb-6">
            E que depois de tantas histórias percebemos que Portugal, a nossa casa, foi durante demasiado tempo tratada como se já a conhecêssemos em demasia. Como se fosse um sítio para voltar e não para descobrir. Até percebermos que temos um dos países mais absurdamente bonitos do mundo debaixo dos pés e que ele merece toda a nossa dedicação.
          </p>
          <p className="text-white/70 text-base md:text-lg leading-[1.75] font-body mb-6">
            Assim nasceu a <strong className="text-white">Bored.</strong> Para nos tirar do conformismo, da repetição acrítica do dia-a-dia e, sobretudo, para ser um ponto de encontro de uma tribo de exploradores que depende da aventura e da Natureza para conseguir sorrir.
          </p>
          <p className="text-white text-base md:text-lg leading-[1.75] font-body font-bold">
            Somos o antídoto contra as viagens aborrecidas.
          </p>
        </motion.div>
      </div>

      {/* ── QUOTE full-width amarelo ── */}
      <div className="bg-neon-yellow px-8 md:px-20 py-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-brutal-black text-[clamp(2rem,5vw,4.5rem)] font-body font-extrabold leading-[1.05] max-w-5xl"
        >
          &ldquo;A aventura começa onde o conforto acaba.&rdquo;
        </motion.p>
      </div>

      {/* ── MANIFESTO ── */}
      <div className="py-24">
        <p className="text-neon-yellow font-body text-[10px] uppercase tracking-[0.35em] mb-12 px-8 md:px-20">Manifesto</p>
        <div className="flex gap-5 px-8 md:px-20 overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[
            { num: "01", titulo: "A Aventura Não Tem Guião.", texto: "As melhores histórias são improvisadas, cheias de reviravoltas e completamente inesperadas.", photo: "/foto1.jpg" },
            { num: "02", titulo: "A Tua Zona de Conforto Não É Convidada.", texto: "As grandes aventuras começam onde a zona de conforto acaba. É aí que encontras crescimento, adrenalina e talvez um pouco de caos.", photo: "/foto2.JPG" },
            { num: "03", titulo: "A Viagem Supera Sempre o Destino.", texto: "Não se trata de onde vais, mas das histórias loucas e inesperadas que recolhes pelo caminho.", photo: "/foto3.png" },
            { num: "04", titulo: "Viaja Leve, Sonha Alto.", texto: "As nossas aventuras não são sobre o que trazes, mas sobre quem te tornas quando estás disposto a largar o ordinário.", photo: "/foto4.jpeg" },
            { num: "05", titulo: "Não Estás Sozinho.", texto: "A aventura é melhor em conjunto. Junta-te a uma comunidade de exploradores tão curiosos, ousados e ligeiramente malucos como tu.", photo: "/neve.jpeg" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative flex-shrink-0 snap-start rounded-3xl overflow-hidden flex flex-col justify-between cursor-default"
              style={{ width: 'clamp(300px, 38vw, 480px)', height: 'clamp(380px, 48vw, 560px)' }}
            >
              {/* Background photo */}
              <img src={item.photo} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-300" />
              {/* Content */}
              <div className="relative z-10 p-8">
                <span className="text-[11px] font-body font-bold uppercase tracking-[0.3em] text-white/50">{item.num}</span>
              </div>
              <div className="relative z-10 p-8">
                <p className="font-body font-extrabold text-[clamp(1.3rem,2.2vw,1.8rem)] leading-tight mb-3 text-white">{item.titulo}</p>
                <p className="text-sm leading-[1.8] text-white/65">{item.texto}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── SPLIT inverso: texto esquerda + foto direita ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="flex flex-col justify-center px-10 md:px-16 py-16 bg-brutal-black order-2 md:order-1"
        >
          <p className="text-neon-yellow font-body text-[10px] uppercase tracking-[0.35em] mb-6">Os originals</p>
          <h2 className="text-white text-[clamp(2rem,4vw,3.5rem)] font-body font-extrabold leading-tight mb-6">
            Não são tours.<br />São histórias.
          </h2>
          <p className="text-white/55 text-base md:text-lg leading-[1.8] font-body">
            Não há guias com bandeirinha, não há experiências empacotadas para parecerem aventura. Há Portugal, há nós, e há a pergunta de sempre: <em className="text-white/80">"E se isto fosse possível?"</em>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative overflow-hidden min-h-[50vh] md:min-h-full order-1 md:order-2"
        >
          <img src="/foto3.png" alt="" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </motion.div>
      </div>


      {/* ── CTA final ── */}
      <div className="px-8 md:px-20 py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-white/8">
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-white/20 font-body text-[10px] uppercase tracking-[0.5em] max-w-xs"
        >Bored Originals. · Portugal · {new Date().getFullYear()}</motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          onClick={onBack}
          className="bg-neon-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-xl hover:bg-white transition-colors"
        >Ver as aventuras →</motion.button>
      </div>
    </div>
  );
}

function SobreNos() {
  const photos = [
    { src: "/foto1.jpg", alt: 'Aventura 1', year: '2024' },
    { src: "/foto2.JPG", alt: 'Aventura 2', year: '2024' },
    { src: "/foto3.png", alt: 'Aventura 3', year: '2024' },
    { src: "/foto4.jpeg", alt: 'Aventura 4', year: '2024' },
    { src: "/neve.jpeg", alt: 'Aventura 5', year: '2024' },
  ];

  return (
    <section id="sobre" className="grain relative bg-brutal-black overflow-hidden">

      {/* Main grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* LEFT — text */}
        <div className="flex flex-col justify-between px-8 md:px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[clamp(2.8rem,5vw,5rem)] font-extrabold text-white leading-[0.88] tracking-tight mb-10">
              Nascemos<br/>do cansaço<br/>
              <em className="not-italic text-neon-yellow">do ordinário.</em>
            </h2>

            <div className="space-y-5 text-white/45 text-sm leading-[1.8] max-w-md">
              <p> Já viajámos por mais de 50 países. Fomos à boleia de Lisboa ao Qatar, atravessámos os Himalaias de scooter e atravessámos África num carro de 500 euros.
E no fim de tudo, voltámos sempre para aqui. </p>
<p> 
Portugal é a nossa casa e durante muito tempo tratámo-la como se já a conhecêssemos de mais. Como se fosse um sítio para voltar e não para descobrir. Até percebermos que tínhamos um dos países mais absurdamente bonitos do mundo debaixo dos pés e estávamos a ignorá-lo.</p>
              <p>Isso acabou. </p>
              <p>
Os Originals não são tours. Não há reviews, não há guias com chapéu e bandeirinha, não há experiências empacotadas para parecerem aventura. Há nós, há Portugal, e há a pergunta de sempre: <span className="text-white/70 italic">&ldquo;E se isto fosse possível?&rdquo;</span> </p>
            </div>

            <div className="mt-12 flex items-center gap-5">
              <motion.a
                href="#originals"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-neon-yellow text-brutal-black px-6 py-3 font-bold text-xs uppercase tracking-[0.15em] rounded-xl hover:bg-white transition-colors"
              >
                Ver aventuras
              </motion.a>
             
            </div>
          </motion.div>

          {/* Stats — horizontal rule style */}
          
         
        </div>

        {/* RIGHT — wild photo collage */}
        <div className="relative min-h-[680px] overflow-hidden">

          {/* Photo 1 — grande, topo esquerda, inclinada esquerda */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, rotate: -2 }}
            className="absolute top-[6%] left-[4%] w-[54%] h-[50%] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.75)] z-[2] cursor-pointer"
          >
            <img src={photos[0].src} alt={photos[0].alt} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] text-white/80 font-bold uppercase tracking-[0.3em]">{photos[0].alt}</p>
              <p className="text-[8px] text-white/40 tracking-widest">{photos[0].year}</p>
            </div>
          </motion.div>

          {/* Photo 2 — média, topo direita, inclinada direita */}
          <motion.div
            initial={{ opacity: 0, y: -40, rotate: 7 }}
            whileInView={{ opacity: 1, y: 0, rotate: 3.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="absolute top-[3%] right-[3%] w-[43%] h-[44%] rounded-2xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.65)] z-[3] cursor-pointer"
          >
            <img src={photos[1].src} alt={photos[1].alt} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] text-white/80 font-bold uppercase tracking-[0.3em]">{photos[1].alt}</p>
              <p className="text-[8px] text-white/40 tracking-widest">{photos[1].year}</p>
            </div>
          </motion.div>

          {/* Photo 3 — média, baixo esquerda, inclinada ligeiramente direita */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute bottom-[4%] left-[7%] w-[46%] h-[47%] rounded-[1.5rem] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.65)] z-[4] cursor-pointer"
          >
            <img src={photos[2].src} alt={photos[2].alt} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] text-white/80 font-bold uppercase tracking-[0.3em]">{photos[2].alt}</p>
              <p className="text-[8px] text-white/40 tracking-widest">{photos[2].year}</p>
            </div>
          </motion.div>

          {/* Photo 4 — grande, baixo direita, inclinada esquerda */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            whileHover={{ scale: 1.04, rotate: -1 }}
            className="absolute bottom-[3%] right-[2%] w-[50%] h-[50%] rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.75)] z-[1] cursor-pointer"
          >
            <img src={photos[3].src} alt={photos[3].alt} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-[9px] text-white/80 font-bold uppercase tracking-[0.3em]">{photos[3].alt}</p>
              <p className="text-[8px] text-white/40 tracking-widest">{photos[3].year}</p>
            </div>
          </motion.div>

          {/* Photo 5 — neve, meio, inclinada direita */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            whileHover={{ scale: 1.06, rotate: 2 }}
            className="absolute top-[36%] left-[28%] w-[40%] h-[32%] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[5] cursor-pointer"
          >
            <img src={photos[4].src} alt="neve" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

        </div>

      </div>

      {/* Bottom quote strip */}
      <div className="relative z-10 px-8 md:px-16 py-8">
        <p className="font-body text-white text-xs uppercase tracking-[0.5em] text-center">
          &ldquo;A aventura começa onde o conforto acaba.&rdquo;
        </p>
      </div>

    </section>
  );
}

// ─── Stripe embedded payment form ────────────────────────────────────────────
function StripePaymentForm({
  depositAmount,
  onSuccess,
  onBack,
}: {
  depositAmount: number;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}?payment=success`,
      },
      redirect: 'if_required',
    });

    console.log('[Stripe] confirmPayment result:', JSON.stringify(result));

    const { error, paymentIntent } = result;

    if (error) {
      console.error('[Stripe] error:', error);
      setErrorMsg(error.message ?? 'Erro no pagamento. Tenta novamente.');
      setIsProcessing(false);
    } else if (paymentIntent) {
      console.log('[Stripe] paymentIntent.status:', paymentIntent.status);
      if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing' || paymentIntent.status === 'requires_capture') {
        onSuccess();
      } else {
        setErrorMsg(`Estado: ${paymentIntent.status}. Tenta novamente.`);
        setIsProcessing(false);
      }
    } else {
      // Sem erro e sem paymentIntent = provavelmente redirecionou (não devia com redirect:'if_required')
      console.warn('[Stripe] No error and no paymentIntent returned');
      setErrorMsg('Resposta inesperada do Stripe. Verifica se o pagamento foi concluído.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 180 }}>
        {/* Loading skeleton enquanto o iframe do Stripe monta */}
        {!isReady && !loadError && (
          <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 p-5 animate-pulse">
            <div className="h-4 w-1/3 bg-white/10 rounded" />
            <div className="h-12 bg-white/10 rounded-xl" />
            <div className="flex gap-3">
              <div className="h-12 flex-1 bg-white/10 rounded-xl" />
              <div className="h-12 flex-1 bg-white/10 rounded-xl" />
            </div>
          </div>
        )}
        {loadError && (
          <div className="bg-red-500/15 border border-red-500/30 rounded-2xl px-5 py-6 text-red-400 text-xs text-center space-y-1">
            <p className="font-bold">Erro ao carregar o formulário de pagamento</p>
            <p className="text-red-400/70">{loadError}</p>
          </div>
        )}
        <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <PaymentElement
            onReady={() => setIsReady(true)}
            onLoadError={(e) => setLoadError(e.error?.message ?? 'Erro desconhecido do Stripe')}
            options={{ layout: 'tabs' }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-xs text-center">
          {errorMsg}
        </div>
      )}

      <div className="flex gap-6 items-center">
        <button type="button" onClick={onBack} disabled={isProcessing}
          className="text-white/40 text-xs uppercase tracking-[0.15em] hover:text-white transition-colors disabled:opacity-30 flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Voltar
        </button>
        <motion.button
          type="submit"
          disabled={!stripe || !isReady || isProcessing}
          className="flex-1 bg-white text-black py-4 rounded-full font-body font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isProcessing ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              A processar…
            </>
          ) : !isReady ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              A carregar…
            </>
          ) : (
            `Pagar ${depositAmount}€`
          )}
        </motion.button>
      </div>
      <p className="text-center text-white/20 text-[10px] uppercase tracking-widest">
        Pagamento seguro via Stripe · Cancelamento grátis até 30 dias antes
      </p>
    </form>
  );
}

// ─── Booking helpers ──────────────────────────────────────────────────────────
function calcBookingPrice(people: number, vespas: number, basePrice: number): number {
  const doubleVespas = people - vespas;
  const singleVespas = vespas - doubleVespas;
  // 2-on-a-vespa pays 25% more than base, solo pays base
  return doubleVespas * Math.round(basePrice * 1.25) + singleVespas * basePrice;
}

function getPeopleOnVespa(vespas: number, people: number): number[] {
  const dist = Array(vespas).fill(1);
  let rem = people - vespas;
  for (let i = 0; i < dist.length && rem > 0; i++) { dist[i] = 2; rem--; }
  return dist;
}

interface HolderForm {
  name: string; email: string; phone: string; address: string; needsTransfer: boolean;
}
const emptyHolder = (): HolderForm => ({ name: '', email: '', phone: '', address: '', needsTransfer: false });

function BookingModal({ date, activityTitle, bookingType = 'standard', onClose, onHome, activityImage, activityLocation }: {
  date: { id: string; date_range: string; status: string; spots: number; price: string } | null;
  activityTitle?: string;
  bookingType?: 'vespa' | 'standard';
  onClose: () => void;
  onHome?: () => void;
  activityImage?: string;
  activityLocation?: string;
}) {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState(1);
  const [vespas, setVespas] = useState(1);
  const [holders, setHolders] = useState<HolderForm[]>([emptyHolder()]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const payFull = true; // always pay full amount

  if (!date) return null;

  // Parse numeric base price from Supabase string e.g. "349€" → 349
  const basePrice = parseInt(date.price.replace(/[^0-9]/g, ''), 10) || 199;

  // Standard: total = people × basePrice
  const standardTotal = people * basePrice;

  const minV = Math.ceil(people / 2);
  const maxV = people;
  const dist = getPeopleOnVespa(vespas, people);
  const priceDouble = Math.round(basePrice * 1.25);
  const priceSingle = basePrice;
  const vespaPrices = dist.map(p => p === 2 ? priceDouble : priceSingle);
  const total = calcBookingPrice(people, vespas, basePrice);

  const grandTotal   = bookingType === 'vespa' ? total : standardTotal;
  const depositAmount = grandTotal; // always full amount

  const fetchClientSecret = useCallback(async () => {
    setIsLoading(true);
    setPaymentError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(bookingType === 'vespa' ? {
            activityId: date.id,
            activityDateId: date.id,
            activityTitle: activityTitle ?? 'Experiência Bored Originals',
            dateRange: date.date_range,
            people,
            vespas,
            holders: holders.slice(0, vespas),
            totalAmount: total,
            depositAmount,
          } : {
            activityId: date.id,
            activityDateId: date.id,
            activityTitle: activityTitle ?? 'Experiência Bored Originals',
            dateRange: date.date_range,
            people,
            vespas: 0,
            holders: [holders[0]],
            totalAmount: standardTotal,
            depositAmount,
          }),
        },
      );
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStep(4);
      } else {
        setPaymentError(data.error ?? 'Erro desconhecido. Tenta novamente.');
      }
    } catch {
      setPaymentError('Não foi possível conectar ao servidor de pagamento.');
    } finally {
      setIsLoading(false);
    }
  }, [bookingType, date, activityTitle, people, vespas, holders, total, standardTotal, depositAmount]);

  const changePeople = (n: number) => {
    const p = Math.max(1, Math.min(Math.min(8, date.spots), n));
    setPeople(p);
    const newMin = Math.ceil(p / 2);
    const newV = Math.max(newMin, Math.min(p, vespas));
    setVespas(newV);
    setHolders(prev => {
      const arr = [...prev];
      while (arr.length < newV) arr.push(emptyHolder());
      return arr.slice(0, newV);
    });
  };

  const changeVespas = (v: number) => {
    const clamped = Math.max(minV, Math.min(maxV, v));
    setVespas(clamped);
    setHolders(prev => {
      const arr = [...prev];
      while (arr.length < clamped) arr.push(emptyHolder());
      return arr.slice(0, clamped);
    });
  };

  const updateHolder = (i: number, field: keyof HolderForm, val: any) =>
    setHolders(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: val } : h));

  const step1Valid = holders[0].name !== '' && holders[0].email !== '' && holders[0].phone !== '';
  const step2Valid = bookingType === 'vespa'
    ? holders.slice(0, vespas).every(h => h.name && h.email && h.phone)
    : step1Valid;

  const currentTotal = bookingType === 'vespa' ? total : standardTotal;
  // Steps for standard: 1=details+people, 3=confirm, 4=payment
  // Map to display steps: 1→1, 3→2, 4→3
  const effectiveStep = step <= 1 ? 1 : step === 3 ? 2 : 3;

  // Shared primitives
  const inputCls = "w-full bg-transparent border-b border-white/30 pb-3 pt-1 text-white text-base placeholder-white/25 focus:outline-none focus:border-white/70 transition-colors";
  const labelCls = "text-white/60 text-xs uppercase tracking-[0.18em] block mb-2.5 font-semibold";
  const primaryBtn = "w-full bg-white text-black py-4 rounded-full font-body font-bold text-sm uppercase tracking-[0.15em] hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const ghostBtn  = "text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2";
  const rowCls    = "flex justify-between items-baseline py-4 border-b border-white/[0.08]";

  return (
    createPortal(<motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col overflow-hidden"
    >
      {/* ── Top bar ── */}
      <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/[0.08] px-6 md:px-12 py-4 flex items-center">
        <button onClick={onClose} className={ghostBtn}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Voltar
        </button>
        <div className="flex-1 flex justify-center">
          <button onClick={() => { onClose(); onHome?.(); }} className="focus:outline-none">
            <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored." className="h-8 w-auto" />
          </button>
        </div>
        <div className="w-16" />
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
      {/* ── Main 2-col ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

        {/* LEFT: form */}
        <div className="flex-1 min-w-0">

          {/* STANDARD */}
          {bookingType === 'standard' && (
            <>
              {step === 1 && (
                <div className="space-y-10">
                  {/* People */}
                  <div>
                    <h2 className="text-white font-body font-bold text-3xl mb-1">Número de pessoas</h2>
                    <p className="text-white/50 text-sm mt-1">{date.spots} lugares disponíveis nesta edição</p>
                  </div>
                  <div>
                    <p className={labelCls}>Quantas pessoas vão?</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => setPeople(p => Math.max(1, p - 1))} disabled={people <= 1}
                        className="w-11 h-11 rounded-full border border-white/30 text-white text-xl hover:border-white/70 disabled:opacity-20 transition-all flex items-center justify-center">−</button>
                      <span className="text-white font-body font-bold text-4xl w-10 text-center leading-none">{people}</span>
                      <button onClick={() => setPeople(p => Math.min(date.spots, p + 1))} disabled={people >= date.spots}
                        className="w-11 h-11 rounded-full border border-white/30 text-white text-xl hover:border-white/70 disabled:opacity-20 transition-all flex items-center justify-center">+</button>
                    </div>
                    <div className={`${rowCls} mt-6`}>
                      <span className="text-white/50 text-base">{people} × {basePrice}€ por pessoa</span>
                      <span className="text-white font-bold text-2xl">{standardTotal}€</span>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.07] pt-8">
                    <h2 className="text-white font-body font-bold text-3xl mb-6">Titular da reserva</h2>
                    <div className="space-y-7">
                      {[
                        { f: 'name',  label: 'Nome completo', ph: 'João Silva',       type: 'text'  },
                        { f: 'email', label: 'Email',         ph: 'joao@exemplo.com', type: 'email' },
                        { f: 'phone', label: 'Telemóvel',     ph: '+351 912 345 678', type: 'tel'   },
                      ].map(({ f, label, ph, type }) => (
                        <div key={f}>
                          <label className={labelCls}>{label}</label>
                          <input type={type} placeholder={ph} value={(holders[0] as any)[f]}
                            onChange={e => updateHolder(0, f as keyof HolderForm, e.target.value)}
                            className={inputCls} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setStep(3)} disabled={!step1Valid} className={primaryBtn}>Continuar</button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-white font-body font-bold text-3xl mb-1">Confirmação</h2>
                    <p className="text-white/50 text-sm mt-1">Verifica os detalhes antes de pagar</p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-0">
                    {[
                      ['Experiência', activityTitle ?? ''],
                      ['Data', date.date_range],
                      ['Pessoas', `${people} pessoa${people > 1 ? 's' : ''}`],
                      ['Preço por pessoa', `${basePrice}€`],
                    ].map(([k, v]) => (
                      <div key={k} className={rowCls}>
                        <span className="text-white/50 text-sm">{k}</span>
                        <span className="text-white text-sm font-medium">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-baseline py-5">
                      <span className="text-white/50 text-sm uppercase tracking-widest text-xs">Total</span>
                      <span className="text-white font-bold text-2xl">{standardTotal}€</span>
                    </div>
                  </div>

                  {/* Titular summary */}
                  <div className="border-l-2 border-white/15 pl-4 space-y-0.5">
                    <p className="text-white text-sm font-medium">{holders[0].name}</p>
                    <p className="text-white/40 text-sm">{holders[0].email} · {holders[0].phone}</p>
                  </div>

                  {paymentError && (
                    <p className="text-red-400 text-sm border border-red-500/20 rounded-xl px-4 py-3">{paymentError}</p>
                  )}

                  <div className="space-y-4">
                    <button onClick={fetchClientSecret} disabled={isLoading} className={primaryBtn}>
                      {isLoading
                        ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>A preparar…</>
                        : `Pagar ${standardTotal}€`
                      }
                    </button>
                    {/* Trust line */}
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      <p className="text-white/30 text-xs">Pagamento seguro via Stripe · SSL 256-bit</p>
                    </div>
                  </div>

                  <button onClick={() => setStep(1)} disabled={isLoading} className={ghostBtn}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Voltar
                  </button>
                </div>
              )}

              {step === 4 && clientSecret && !paymentSuccess && (
                <Elements stripe={stripePromise} options={{ locale: 'pt', clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ffffff', colorBackground: '#0a0a0a', borderRadius: '8px', colorText: '#ffffff', colorTextSecondary: 'rgba(255,255,255,0.5)' } } }}>
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-white font-body font-bold text-3xl mb-1">Pagamento</h2>
                      <p className="text-white/50 text-sm">A pagar agora: {depositAmount}€</p>
                    </div>
                    <StripePaymentForm depositAmount={depositAmount} onSuccess={() => setPaymentSuccess(true)} onBack={() => setStep(3)} />
                  </div>
                </Elements>
              )}

              {paymentSuccess && (
                <div className="py-16 space-y-6">
                  <div className="w-8 h-0.5 bg-white" />
                  <h2 className="text-white font-body font-bold text-3xl">Reserva confirmada.</h2>
                  <p className="text-white/50 text-base leading-relaxed max-w-sm">
                    <>Pagaste {depositAmount}€. Vais receber um email com todos os detalhes.<br/>Vemo-nos em breve.</>
                  </p>
                  <button onClick={onClose} className="bg-white text-black px-8 py-3.5 rounded-full font-body font-bold text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition-colors mt-4">
                    Fechar
                  </button>
                </div>
              )}
            </>
          )}

          {/* VESPA */}
          {bookingType === 'vespa' && (
            <>
              {step === 1 && (
                <div className="space-y-10">
                  <div>
                    <p className={labelCls}>Grupo</p>
                    <h2 className="text-white font-body font-bold text-2xl">Quantas pessoas vão?</h2>
                    <p className="text-white/30 text-xs mt-1">{date.spots} lugares disponíveis nesta edição</p>
                  </div>
                  <div>
                    <p className={labelCls}>Número de pessoas</p>
                    <div className="flex items-center gap-5 mt-1">
                      <button onClick={() => changePeople(people - 1)} disabled={people <= 1}
                        className="w-9 h-9 border border-white/20 text-white text-lg hover:border-white/50 disabled:opacity-20 transition-all flex items-center justify-center">−</button>
                      <span className="text-white font-body font-bold text-3xl w-8 text-center leading-none">{people}</span>
                      <button onClick={() => changePeople(people + 1)} disabled={people >= Math.min(8, date.spots)}
                        className="w-9 h-9 border border-white/20 text-white text-lg hover:border-white/50 disabled:opacity-20 transition-all flex items-center justify-center">+</button>
                    </div>
                  </div>
                  <div>
                    <p className={labelCls}>Número de vespas</p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {Array.from({ length: maxV - minV + 1 }, (_, i) => minV + i).map(n => (
                        <button key={n} onClick={() => changeVespas(n)}
                          className={`px-5 py-2.5 border text-xs uppercase tracking-[0.12em] font-semibold transition-all ${vespas === n ? 'border-white bg-white text-black' : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'}`}>
                          {n} vespa{n > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-0">
                    {dist.map((ppl, vi) => (
                      <div key={vi} className={rowCls}>
                        <span className="text-white/40 text-sm">Vespa {vi + 1} · {ppl} pessoa{ppl > 1 ? 's' : ''}</span>
                        <span className="text-white text-sm">{vespaPrices[vi]}€</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-baseline py-4">
                      <span className="text-white/40 text-xs uppercase tracking-[0.15em]">Total</span>
                      <span className="text-white font-bold text-2xl">{total}€</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className={primaryBtn}>Continuar</button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10">
                  <div>
                    <p className={labelCls}>Titulares</p>
                    <h2 className="text-white font-body font-bold text-2xl">{vespas > 1 ? 'Dados dos titulares' : 'Dados do titular'}</h2>
                    <p className="text-white/30 text-xs mt-1">Carta de condução válida obrigatória (Cat. B ou AM)</p>
                  </div>
                  {holders.slice(0, vespas).map((holder, vi) => (
                    <div key={vi} className="space-y-7">
                      <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                        <p className="text-white/50 text-xs uppercase tracking-[0.15em]">Vespa {vi + 1} · {dist[vi]} pessoa{dist[vi] > 1 ? 's' : ''}</p>
                        <span className="text-white text-sm font-semibold">{vespaPrices[vi]}€</span>
                      </div>
                      {[
                        { f: 'name',    label: 'Nome completo', ph: 'João Silva',         type: 'text'  },
                        { f: 'email',   label: 'Email',         ph: 'joao@exemplo.com',   type: 'email' },
                        { f: 'phone',   label: 'Telemóvel',     ph: '+351 912 345 678',   type: 'tel'   },
                        { f: 'address', label: 'Morada',        ph: 'Rua, Cidade, CP',    type: 'text'  },
                      ].map(({ f, label, ph, type }) => (
                        <div key={f}>
                          <label className={labelCls}>{label}</label>
                          <input type={type} placeholder={ph} value={(holder as any)[f]}
                            onChange={e => updateHolder(vi, f as keyof HolderForm, e.target.value)}
                            className={inputCls} />
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-white/50 text-xs">Transfer até Belmonte?</p>
                          <p className="text-white/25 text-[10px] mt-0.5">Podemos ajudar a organizar</p>
                        </div>
                        <button onClick={() => updateHolder(vi, 'needsTransfer', !holder.needsTransfer)}
                          className={`w-11 h-5 border transition-colors relative flex-shrink-0 ${holder.needsTransfer ? 'border-white bg-white' : 'border-white/20 bg-transparent'}`}>
                          <motion.div animate={{ x: holder.needsTransfer ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`absolute top-[2px] w-[14px] h-[14px] transition-colors ${holder.needsTransfer ? 'bg-black' : 'bg-white/30'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <button onClick={() => setStep(1)} className={ghostBtn}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Voltar
                    </button>
                    <button onClick={() => setStep(3)} disabled={!step2Valid}
                      className="bg-white text-black px-10 py-3.5 font-body font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <p className={labelCls}>Resumo</p>
                    <h2 className="text-white font-body font-bold text-2xl">Confirmação</h2>
                    <p className="text-white/30 text-xs mt-1">50% de sinal agora — restante à chegada a Belmonte</p>
                  </div>
                  <div className="space-y-0">
                    {[
                      ['Data', date.date_range],
                      ['Pessoas', `${people} pessoa${people > 1 ? 's' : ''}`],
                      ['Vespas', `${vespas} vespa${vespas > 1 ? 's' : ''}`],
                    ].map(([k, v]) => (
                      <div key={k} className={rowCls}>
                        <span className="text-white/40 text-sm">{k}</span>
                        <span className="text-white text-sm">{v}</span>
                      </div>
                    ))}
                    {holders.some(h => h.needsTransfer) && (
                      <div className={rowCls}>
                        <span className="text-white/40 text-sm">Transfer</span>
                        <span className="text-white/50 text-sm">A confirmar</span>
                      </div>
                    )}
                    {dist.map((ppl, vi) => (
                      <div key={vi} className={rowCls}>
                        <span className="text-white/25 text-xs">Vespa {vi + 1} · {holders[vi]?.name || '—'}</span>
                        <span className="text-white/40 text-xs">{vespaPrices[vi]}€</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-baseline py-4">
                      <span className="text-white/40 text-xs uppercase tracking-[0.15em]">Total</span>
                      <span className="text-white font-bold text-2xl">{total}€</span>
                    </div>
                    <div className="border border-white/15 px-5 py-4 flex justify-between items-center">
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.15em]">A pagar agora</p>
                        <p className="text-white/25 text-[10px] mt-0.5">Restante {Math.ceil(total * 0.5)}€ à chegada</p>
                      </div>
                      <span className="text-white font-bold text-2xl">{Math.floor(total * 0.5)}€</span>
                    </div>
                  </div>
                  {holders.slice(0, vespas).map((h, vi) => (
                    <div key={vi} className="border-l-2 border-white/10 pl-4 space-y-0.5">
                      <p className="text-white text-sm">{h.name}</p>
                      <p className="text-white/30 text-xs">{h.email} · {h.phone}{h.needsTransfer ? ' · Transfer' : ''}</p>
                    </div>
                  ))}
                  {paymentError && (
                    <p className="text-red-400 text-xs border border-red-500/30 px-4 py-3">{paymentError}</p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <button onClick={() => setStep(2)} disabled={isLoading} className={ghostBtn}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Voltar
                    </button>
                    <button onClick={fetchClientSecret} disabled={isLoading}
                      className="bg-white text-black px-10 py-3.5 font-body font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 disabled:opacity-30 flex items-center gap-2 transition-colors">
                      {isLoading ? <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>A preparar</> : `Pagar ${depositAmount}€`}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && clientSecret && !paymentSuccess && (
                <Elements stripe={stripePromise} options={{ locale: 'pt', clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ffffff', colorBackground: '#0a0a0a', borderRadius: '0px', colorText: '#ffffff', colorTextSecondary: 'rgba(255,255,255,0.4)' } } }}>
                  <div className="space-y-10">
                    <div>
                      <p className={labelCls}>Pagamento</p>
                      <h2 className="text-white font-body font-bold text-2xl">Detalhes do cartão</h2>
                      <p className="text-white/30 text-xs mt-1">A pagar agora: {depositAmount}€ · Restante {grandTotal - depositAmount}€ à chegada</p>
                    </div>
                    <StripePaymentForm depositAmount={depositAmount} onSuccess={() => setPaymentSuccess(true)} onBack={() => setStep(3)} />
                  </div>
                </Elements>
              )}

              {paymentSuccess && (
                <div className="py-16 space-y-6">
                  <div className="w-8 h-0.5 bg-white" />
                  <h2 className="text-white font-body font-bold text-3xl">Reserva confirmada.</h2>
                  <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                    Pagaste {depositAmount}€ de sinal. Vais receber um email com todos os detalhes.<br/>Prepara a scooter — vemo-nos em breve.
                  </p>
                  <button onClick={onClose} className="bg-white text-black px-10 py-3.5 font-body font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-colors mt-4">
                    Fechar
                  </button>
                </div>
              )}
            </>
          )}

        </div> {/* end left form */}

        {/* RIGHT: White card — 57Hours reference */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-3">

            {/* Main white card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Header: thumbnail + title */}
              <div className="flex items-start gap-4 p-5 border-b border-black/[0.07]">
                {activityImage && (
                  <img src={activityImage} alt={activityTitle ?? ''}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-black font-body font-bold text-base leading-tight">{activityTitle}</p>
                  {activityLocation && (
                    <p className="text-black/40 text-xs mt-1 uppercase tracking-[0.15em]">{activityLocation}</p>
                  )}
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-black/[0.07]">
                <div className="px-5 py-4">
                  <p className="text-black/40 text-xs font-bold uppercase tracking-[0.12em] mb-1">Experiência</p>
                  <div className="flex items-center justify-between">
                    <p className="text-black text-sm font-medium">{activityTitle}</p>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-black/25 flex-shrink-0 ml-2"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-black/40 text-xs font-bold uppercase tracking-[0.12em] mb-1">Data</p>
                  <p className="text-black text-sm font-medium">{date.date_range}</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-black/40 text-xs font-bold uppercase tracking-[0.12em] mb-1">Pessoas</p>
                  <p className="text-black text-sm font-medium">{people} pessoa{people > 1 ? 's' : ''}</p>
                </div>
                {holders[0].name && (
                  <div className="px-5 py-4">
                    <p className="text-black/40 text-xs font-bold uppercase tracking-[0.12em] mb-1">Titular</p>
                    <p className="text-black text-sm font-medium">{holders[0].name}</p>
                    {holders[0].email && <p className="text-black/40 text-xs mt-0.5">{holders[0].email}</p>}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="px-5 py-4 border-t border-black/[0.1] flex items-center justify-between">
                <span className="text-black font-body font-bold text-base">Total</span>
                <span className="text-black font-body font-bold text-2xl">{currentTotal}€</span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="pt-1 space-y-3">
              {[
                'Cancelamento grátis até 30 dias',
                'Pagamento seguro via Stripe',
                'Encriptação SSL 256-bit',
              ].map(text => (
                <div key={text} className="flex items-center gap-3 text-white/50 text-sm">
                  <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 text-[10px] text-white/40">✓</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div> {/* end main 2-col */}
      </div> {/* end scrollable content */}
    </motion.div>, document.body)
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WAITLIST MODAL — lista de espera + opção de depósito 50€
───────────────────────────────────────────────────────────────────────────── */
function WaitlistModal({ date, adventureId, activityTitle, onClose, onHome, activityImage, activityLocation }: {
  date: { id: string; date_range: string; status: string; spots: number; price: string } | null;
  adventureId?: string | null;
  activityTitle?: string;
  onClose: () => void;
  onHome?: () => void;
  activityImage?: string;
  activityLocation?: string;
}) {
  const [step, setStep] = useState<'choose' | 'email' | 'pay' | 'emailDone' | 'payDone'>('choose');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const ghostBtn = "text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2";

  if (!date) return null;

  const DEPOSIT = 50;

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setEmailError('Insere um email válido (ex: joao@exemplo.com).');
      return;
    }

    setIsLoading(true);
    setEmailError(null);
    try {
      const { addToWaitlist } = await import('./lib/supabase');
      const { error } = await addToWaitlist(date.id, adventureId ?? null, normalizedEmail);
      if (error) { setEmailError('Não foi possível guardar. Tenta novamente.'); return; }
    } catch {
      setEmailError('Erro de ligação. Tenta novamente.');
      return;
    } finally {
      setIsLoading(false);
    }
    setStep('emailDone');
  };

  const handleDepositSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            activityId: date.id,
            activityDateId: date.id,
            activityTitle: activityTitle ?? 'Experiência Bored Originals',
            dateRange: date.date_range,
            people: 1,
            vespas: 0,
            holders: [{ name, email, phone }],
            totalAmount: DEPOSIT * 100,
            depositAmount: DEPOSIT * 100,
            bookingType: 'waitlist_deposit',
          }),
        }
      );
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        setPaymentError(data.error ?? 'Erro desconhecido. Tenta novamente.');
      }
    } catch {
      setPaymentError('Não foi possível conectar ao servidor de pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const topBar = (
    <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/[0.08] px-6 md:px-12 py-4 flex items-center">
      <button onClick={onClose} className={ghostBtn}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Voltar
      </button>
      <div className="flex-1 flex justify-center">
        <button onClick={() => { onClose(); onHome?.(); }} className="focus:outline-none">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored." className="h-8 w-auto" />
        </button>
      </div>
      <div className="w-16" />
    </div>
  );

  const summaryCard = (
    <div className="lg:w-80 flex-shrink-0">
      <div className="rounded-2xl bg-white text-brutal-black overflow-hidden sticky top-8">
        {activityImage && <div className="flex items-center gap-3 p-5 border-b border-black/8">
          <img src={activityImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <p className="font-body font-bold text-base leading-tight">{activityTitle}</p>
            {activityLocation && <p className="font-body text-[10px] uppercase tracking-widest text-black/35 mt-0.5">{activityLocation}</p>}
          </div>
        </div>}
        <div className="p-5 space-y-3 text-sm font-body">
          <div className="flex justify-between"><span className="text-black/45">Experiência</span><span className="font-semibold">{activityTitle}</span></div>
          <div className="flex justify-between"><span className="text-black/45">Data</span><span className="font-semibold">{date.date_range}</span></div>
          <div className="h-px bg-black/8" />
          <div className="flex justify-between text-base font-bold"><span>Depósito</span><span>{DEPOSIT}€</span></div>
          <p className="text-[11px] text-black/40 leading-snug">Os {DEPOSIT}€ são descontados no valor final da reserva</p>
        </div>
        <div className="px-5 pb-5 space-y-1.5">
          {['Cancelamento grátis até 30 dias', 'Pagamento seguro via Stripe', 'Encriptação SSL 256-bit'].map(t => (
            <div key={t} className="flex items-center gap-2 text-[11px] text-black/40">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // When paying with deposit, switch to full-page BookingModal-style flow
  if (step === 'pay' || step === 'payDone') {
    return createPortal(
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col overflow-hidden">
        {/* top bar */}
        <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/[0.08] px-6 md:px-12 py-4 flex items-center">
          <button onClick={step === 'payDone' ? onClose : () => { setStep('choose'); setClientSecret(null); }} className="text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Voltar
          </button>
          <div className="flex-1 flex justify-center">
            <button onClick={() => { onClose(); onHome?.(); }} className="focus:outline-none">
              <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored." className="h-8 w-auto" />
            </button>
          </div>
          <div className="w-16" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            <div className="flex-1 min-w-0">
              {step === 'pay' && !clientSecret && (
                <form onSubmit={handleDepositSubmit}>
                  <h2 className="text-white font-body font-bold text-3xl mb-2">Garantir o lugar</h2>
                  <p className="text-white/40 font-body text-sm mb-10">Paga {DEPOSIT}€ de depósito para confirmar o teu lugar. Este valor é descontado no pagamento final.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.18em] block mb-3">Nome completo</label>
                      <input required value={name} onChange={e => setName(e.target.value)} placeholder="João Silva"
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none text-white font-body text-base py-2 placeholder-white/20 transition-colors" />
                    </div>
                    <div>
                      <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.18em] block mb-3">Email</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="joao@exemplo.com"
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none text-white font-body text-base py-2 placeholder-white/20 transition-colors" />
                    </div>
                    <div>
                      <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.18em] block mb-3">Telemóvel</label>
                      <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+351 912 345 678"
                        className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none text-white font-body text-base py-2 placeholder-white/20 transition-colors" />
                    </div>
                  </div>
                  {paymentError && <p className="mt-4 text-red-400 font-body text-sm">{paymentError}</p>}
                  <button type="submit" disabled={isLoading}
                    className="mt-10 w-full bg-neon-yellow text-brutal-black font-body font-bold text-sm uppercase tracking-[0.12em] py-4 rounded-xl hover:bg-white transition-colors duration-300 disabled:opacity-50">
                    {isLoading ? 'A processar…' : `Pagar depósito de ${DEPOSIT}€`}
                  </button>
                </form>
              )}
              {step === 'pay' && clientSecret && (
                <div>
                  <h2 className="text-white font-body font-bold text-3xl mb-8">Pagamento do depósito</h2>
                  <Elements stripe={stripePromise} options={{ locale: 'pt', clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#ffffff', colorBackground: '#0a0a0a', borderRadius: '8px', colorText: '#ffffff', colorTextSecondary: 'rgba(255,255,255,0.5)' } } }}>
                    <StripePaymentForm depositAmount={DEPOSIT} onSuccess={() => setStep('payDone')} onBack={() => setClientSecret(null)} />
                  </Elements>
                </div>
              )}
              {step === 'payDone' && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-neon-yellow/10 flex items-center justify-center mx-auto mb-6">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 14l7 7L24 7" stroke="#E8FF47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h2 className="text-white font-body font-bold text-3xl mb-3">Lugar garantido!</h2>
                  <p className="text-white/40 font-body text-sm max-w-xs mx-auto leading-relaxed">O teu depósito de {DEPOSIT}€ foi confirmado. Vais receber um email com todos os detalhes.</p>
                  <button onClick={onClose} className="mt-10 bg-white/8 hover:bg-white/15 text-white font-body font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-xl transition-colors">Fechar</button>
                </div>
              )}
            </div>
            {/* summary card */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="rounded-2xl bg-white text-brutal-black overflow-hidden sticky top-8">
                {activityImage && <div className="flex items-center gap-3 p-5 border-b border-black/8">
                  <img src={activityImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <p className="font-body font-bold text-base leading-tight">{activityTitle}</p>
                    {activityLocation && <p className="font-body text-[10px] uppercase tracking-widest text-black/35 mt-0.5">{activityLocation}</p>}
                  </div>
                </div>}
                <div className="p-5 space-y-3 text-sm font-body">
                  <div className="flex justify-between"><span className="text-black/45">Data</span><span className="font-semibold">{date.date_range}</span></div>
                  <div className="h-px bg-black/8" />
                  <div className="flex justify-between text-base font-bold"><span>Depósito</span><span>{DEPOSIT}€</span></div>
                  <p className="text-[11px] text-black/40 leading-snug">Descontado no valor final</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>,
      document.body
    );
  }

  // Popup overlay for choose / email / emailDone steps
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors z-10">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <div className="p-8">
          {/* CHOOSE */}
          {step === 'choose' && (
            <div>
              <p className="text-white/30 font-body text-[10px] uppercase tracking-[0.3em] mb-2">{date.date_range}</p>
              <h2 className="text-white font-body font-bold text-2xl mb-1">Entrar na lista</h2>
              <p className="text-white/40 font-body text-sm mb-8">Esta edição está quase cheia. Escolhe como queres ficar a par.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setStep('email')}
                  className="text-left rounded-2xl border border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6 transition-all p-5 group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-body font-bold text-base mb-0.5">Lista de espera</p>
                      <p className="text-white/40 font-body text-xs leading-relaxed">Deixa o teu email. Se abrir um lugar, avisamos.</p>
                      <p className="text-white/20 font-body text-[10px] mt-1.5 uppercase tracking-wider">Gratuito · Sem compromisso</p>
                    </div>
                    <svg className="mt-0.5 flex-shrink-0 text-white/20 group-hover:text-white/50 transition-colors" width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 10h6M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
                <button onClick={() => setStep('pay')}
                  className="text-left rounded-2xl border border-neon-yellow/30 bg-neon-yellow/5 hover:bg-neon-yellow/10 hover:border-neon-yellow/50 transition-all p-5 group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-body font-bold text-base mb-0.5">Garantir o meu lugar — {DEPOSIT}€</p>
                      <p className="text-white/40 font-body text-xs leading-relaxed">Depósito de {DEPOSIT}€, descontado no total.</p>
                      <p className="text-neon-yellow/60 font-body text-[10px] mt-1.5 uppercase tracking-wider">Depósito · Descontado no total</p>
                    </div>
                    <svg className="mt-0.5 flex-shrink-0 text-neon-yellow/40 group-hover:text-neon-yellow/80 transition-colors" width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 10h6M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* EMAIL */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <button type="button" onClick={() => setStep('choose')} className="text-white/30 hover:text-white transition-colors flex items-center gap-1.5 text-xs mb-6">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Voltar
              </button>
              <h2 className="text-white font-body font-bold text-2xl mb-1">Lista de espera</h2>
              <p className="text-white/40 font-body text-sm mb-8">Avisamos quando abrir um lugar nesta edição.</p>
              <div>
                <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.18em] block mb-3">Email</label>
                <input required type="email" value={email} onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                  placeholder="joao@exemplo.com"
                  className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none text-white font-body text-base py-2 placeholder-white/20 transition-colors" />
              </div>
              {emailError && <p className="mt-3 text-red-400 font-body text-sm">{emailError}</p>}
              <button type="submit" disabled={isLoading}
                className="mt-8 w-full bg-neon-yellow text-brutal-black font-body font-bold text-sm uppercase tracking-[0.12em] py-3.5 rounded-xl hover:bg-white transition-colors duration-300 disabled:opacity-50">
                {isLoading ? 'A guardar…' : 'Entrar na lista'}
              </button>
            </form>
          )}

          {/* EMAIL DONE */}
          {step === 'emailDone' && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-neon-yellow/10 flex items-center justify-center mx-auto mb-5">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M4 14l7 7L24 7" stroke="#E8FF47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2 className="text-white font-body font-bold text-2xl mb-2">Estás na lista!</h2>
              <p className="text-white/40 font-body text-sm leading-relaxed">Quando abrir um lugar nesta edição, és o primeiro a ser contactado.</p>
              <button onClick={onClose} className="mt-8 bg-white/8 hover:bg-white/15 text-white font-body font-bold text-sm uppercase tracking-widest px-8 py-3 rounded-xl transition-colors">Fechar</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

function ConquistaPage({ onBack }: { onBack: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<number>(0);
  const [dbAdv, setDbAdv] = useState<any>(null);

  useEffect(() => {
    // index 5 = Aldeias Históricas de Mota
    getAdventureByIndex(5).then(adv => { if (adv) setDbAdv(adv); }).catch(console.error);
  }, []);

  const dates = dbAdv
    ? (dbAdv.activity_dates ?? []).map((d: any) => ({
        id: d.id as string,
        date_range: d.date_range as string,
        status: d.status as string,
        spots: d.spots as number,
        price: d.price as string,
      }))
    : [] as { id: string; date_range: string; status: string; spots: number; price: string }[];

  const adventureTitle = dbAdv?.title ?? 'Aldeias Históricas de Mota';

  const [bookingDate, setBookingDate] = useState<typeof dates[0] | null>(null);

  const itinerary = [
    {
      day: "Dia 1", title: "Chegada a Belmonte",
      desc: "Ponto de encontro em Belmonte ao final da tarde. Entrega da scooter, briefing rápido sobre a rota e primeiro jantar em conjunto. Belmonte é a terra natal de Pedro Álvares Cabral — e já tens muito para ver mal chegas. Noite no alojamento local, tucado no casario medieval.",
      img: "/belmonte.jpg", tag: "Chegada → Belmonte"
    },
    {
      day: "Dia 2", title: "Explorar sem pressa",
      desc: "Pequeno-almoço incluido e dia teu. A scooter está carregada, a rota está no virtual guide e as aldeias estão à espera. Linhares da Beira, Trancoso, Castelo Mendo — escolhe o teu ritmo. Não há grupos, não há guias, não há horários. Regressa quando quiseres.",
      img: "/sortelha.jpg", tag: "Belmonte → Aldeias"
    },
    {
      day: "Dia 3", title: "Ultimo dia, regresso livre",
      desc: "Mais um pequeno-almoço e mais um dia de liberdade total. Últimas aldeias, últimas fotos, última paragem num café de aldeia. Devolves a scooter e regressas a casa com mais histórias do que bagagem.",
      img: "/castelomendo.jpg", tag: "Aldeias → Regresso"
    },
  ];

  const villages = [
    { name: "Sortelha",         region: "Beira Interior",       note: "Amuralhada e medieval",        day: "Dia 3", x: 66, y: 60,
      desc: "Uma muralha medieval envolve por completo o casario granítico. A forja ainda funciona, o sino bate às horas certas e a luz ao fim da tarde é de doer. É impossível não parar a scooter e simplesmente ficar.",
      img: "/sortelha.jpg" },
    { name: "Monsanto",         region: "Beira Baixa",          note: "Construída entre rochas",      day: "Dia 4", x: 64, y: 80,
      desc: "Eleita a aldeia mais portuguesa de Portugal. As casas crescem literalmente entre rochas graníticas gigantescas — algumas usam as pedras como tecto. Tens de subir a pé. Vale cada degrau.",
      img: "/monsanto.jpeg" },
    { name: "Piódão",           region: "Serra da Estrela",     note: "Xisto e silêncio",             day: "Dia 2", x: 25, y: 64,
      desc: "Escondida numa dobra da serra, acessível por uma estrada que parece não ter fim. As casas de xisto com janelas azul-cobalto formam uma paleta única em Portugal. Há um único restaurante — e a trufa de chocolate é obrigatória.",
      img: "/piodao.jpg" },
    { name: "Castelo Rodrigo",  region: "Riba Côa",             note: "Vista 360°",                   day: "Dia 3", x: 80, y: 20,
      desc: "No ponto mais alto do planalto, com vistas para Espanha e para o vale do Douro. O castelo foi incendiado pela própria população em 1640 como acto de resistência ao senhorio. As ruínas ainda lá estão.",
      img: "/castelorodrigo.webp" },
    { name: "Marialva",         region: "Guarda",               note: "Castelo fantasma",             day: "Dia 3", x: 55, y: 21,
      desc: "Uma aldeia medieval dentro de um castelo, quase completamente desabitada. Podes percorrer as ruas medievais de scooter sem encontrar uma única pessoa. O cemitério visigótico fica encostado à muralha.",
      img: "/marialva.webp" },
    { name: "Linhares da Beira",region: "Serra da Estrela",     note: "Castelo templário",            day: "Dia 2", x: 42, y: 42,
      desc: "No cimo de uma colina com vistas para o vale do Mondego. O castelo templário está em excelente estado e quase ninguém sabe que existe. A aldeia parece ter parado no século XIV.",
      img: "/linhares.jpg" },
    { name: "Idanha-a-Velha",   region: "Beira Baixa",          note: "2000 anos de história",        day: "Dia 4", x: 67, y: 83,
      desc: "Menos de 100 habitantes e 2000 anos de história contínua. A catedral visigótica do século VI ainda está de pé. Há ruínas romanas a 10 metros de casas habitadas.",
      img: "/idanhavelha.jpg" },
    { name: "Almeida",          region: "Riba Côa",             note: "Fortaleza estrelada",          day: "Dia 3", x: 74, y: 33,
      desc: "Uma das fortalezas abaluartadas mais bem preservadas da Península Ibérica. A forma de estrela é visível do alto. Dentro das muralhas ainda vivem famílias.",
      img: "/almeida.jpg" },
    { name: "Trancoso",         region: "Guarda",               note: "Castelo medieval intacto",     day: "Dia 2", x: 47, y: 23,
      desc: "Rodeada por muralhas medievais intactas, Trancoso guarda o segredo de ter sobrevivido aos séculos quase sem mudar. A lenda da Coca e as estalagens da Judiaria tornam cada rua num conto.",
      img: "/trancoso.jpg" },
    { name: "Castelo Mendo",    region: "Guarda",               note: "Aldeia histórica isolada",     day: "Dia 3", x: 69, y: 43,
      desc: "Uma das aldeias históricas menos visitadas de Portugal. Dentro das muralhas, o tempo parou. Há dois porcos de granito à entrada — símbolo de identidade que ninguém sabe bem explicar.",
      img: "/castelomendo.jpg" },
    { name: "Belmonte",         region: "Beira Interior Norte", note: "Terra de Pedro Álvares Cabral", day: "Dia 2", x: 55, y: 53,
      desc: "Terra natal do navegador que descobriu o Brasil. O castelo, a torre média e o museu judaico estão todos no mesmo bairro. A comunidade judaica de Belmonte é uma das mais antigas de Portugal.",
      img: "/belmonte.jpg" },
    { name: "Castelo Novo",     region: "Beira Baixa",          note: "Aldeia à sombra da serra",     day: "Dia 4", x: 46, y: 71,
      desc: "Encostada à Serra da Gardunha com um micro-clima único — as cerejas aqui são as mais famosas do país. A aldeia tem uma calma absoluta que contrasta com o castelo que a guarda desde o século XII.",
      img: "/castelonovo.jpeg" },
  ];

  const included = [
    { label: "Scooter 50cc", detail: "Revisada, com seguro. Pegas nela em Belmonte e deixas lá mesma." },
    { label: "Alojamento 2 noites", detail: "Alojamento local em Belmonte, no centro histórico." },
    { label: "2 pequenos-almoços", detail: "Incluidos nos dias 2 e 3, no alojamento." },
    { label: "1 jantar", detail: "Jantar de boas-vindas no dia 1, em conjunto com os restantes participantes." },
    { label: "Virtual Guide", detail: "Acesso à nossa app com a rota, pontos de interesse, dicas e segredos de cada aldeia." },
    { label: "Seguro de viagem", detail: "Cobertura completa: scooter, pessoa e bagagem durante toda a duração." },
  ];

  const notIncluded = [
    "Transporte até Belmonte (ponto de encontro)",
    "Refeições ao almoço e jantares dos dias 2 e 3",
    "Gastos pessoais e entradas em museus",
    "Combustível (mínimo, a scooter é 50cc)",
  ];

  const faqs = [
    { q: "Preciso de ter carta de moto?", a: "Não. Uma scooter de 50cc pode ser conduzida com carta de automóvel (Categoria B). Se tiveres mais de 16 anos precisas pelo menos da licença AM." },
    { q: "Há guia ou grupo organizado?", a: "Não. É exactamente o contrário. Tens um virtual guide no telemóvel com a rota, pontos de interesse e dicas de cada aldeia. Vas ao teu ritmo, paras onde quiseres, fazes o teu próprio dia." },
    { q: "Qual é o ponto de encontro?", a: "Belmonte. É lá que recebes a scooter, onde dormes e onde a devolveres no último dia. Fica na Beira Interior, a cerca de 30 minutos da Covilhã." },
    { q: "E se a scooter avariar?", a: "Tens o seguro da máquina incluído. Em caso de problema contactas-nos directamente e tratamos da situação. Já aconteceu uma vez — e acabou a ser a melhor história da viagem." },
    { q: "Qual é a política de cancelamento?", a: "Cancelamento gratuito até 30 dias antes. Entre 30 e 15 dias, devolução de 50%. Menos de 15 dias, sem reembolso. Podes sempre ceder o teu lugar a outra pessoa." },
  ];

  const galleryImgs = [
    "/aldeia1.jpg",
    "/aldeia2.jpg",
    "/aldeia3.jpeg",
    "/aldeia4.jpg",
    "/aldeia5.jpg",
    "/aldeia6.jpg",
    "/aldeia7.jpg",
    "/aldeia8.jpg",
  ];

  return (
    <div className="min-h-screen bg-[#f5f0eb] text-[#1a1a1a] font-body">
      {bookingDate && <BookingModal date={bookingDate} activityTitle={adventureTitle} bookingType="vespa" activityImage={dbAdv?.hero_image} activityLocation="Belmonte, Beira Interior" onClose={() => setBookingDate(null)} onHome={onBack} />}

      {/* Sticky nav — glass pill like home */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none"
      >
        <button onClick={onBack} className="pointer-events-auto flex items-center gap-2 text-white/70 hover:text-white font-body text-xs uppercase tracking-[0.2em] transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Todos os Originals
        </button>
        <div className="pointer-events-auto">
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored Originals" className="h-12 w-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]" />
        </div>
        <a href="#datas" className="pointer-events-auto bg-neon-yellow text-brutal-black px-5 py-2.5 text-xs font-body font-bold uppercase tracking-[0.1em] rounded-2xl hover:bg-white transition-colors">
          Reservar →
        </a>
      </motion.div>

      {/* HERO — full screen video, same as home */}
      <div className="relative h-screen w-full overflow-hidden bg-brutal-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://storage.googleapis.com/bored_tourist_media/videos/Seque%CC%82ncia%2005.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-brutal-black/20 to-brutal-black/40" />
        <div className="absolute bottom-10 left-6 z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-6">

            </div>
            <h1 className="text-[10vw] md:text-[6vw] leading-none font-body font-bold text-white tracking-tight mb-3">
              Conquista das<br/><span className="text-neon-yellow">Aldeias Históricas</span>
            </h1>
            <div className="flex flex-wrap gap-5">
              {[["📍","Belmonte, Beira Interior"],["⏱","3 dias · 2 noites"],["🛵","Scooter 50cc"],["👥","Máx. 8 pessoas"],["💶","199€ por pessoa"]].map(([icon, text]) => (
                <div key={text as string} className="flex items-center gap-2 text-white/55 font-body text-xs uppercase tracking-[0.1em]">{icon} <span>{text as string}</span></div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 right-6 z-10"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="opacity-30">
            <div className="w-px h-10 bg-white mx-auto" />
          </motion.div>
        </motion.div>
      </div>

      {/* INTRO — inspirational dark */}
      <section className="grain relative bg-brutal-black overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT — text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-10"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-4">A aventura</p>
            <h2 className="text-[clamp(2.2rem,3.5vw,3.5rem)] font-extrabold text-white leading-[0.88] tracking-tight mb-7">
              Três dias.<br/>Doze aldeias.<br/>
              <em className="not-italic text-neon-yellow">Uma scooter.</em>
            </h2>
            <div className="space-y-5 text-white/45 text-sm leading-[1.8] max-w-md">
              <p>Portugal tem aldeias que parecem saídas de um livro de história. Castelos em cima de rochas, ruelas de pedra, miradouros de cortar a respiração.</p>
              <p>A melhor forma de as ver? Devagar. Com o vento na cara. Numa scooter de 50cc.</p>
              
            </div>

            <div className="mt-7 flex gap-3 flex-wrap">
              <motion.a href="#datas" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-neon-yellow text-brutal-black px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] rounded-xl hover:bg-white transition-colors">
                Ver datas →
              </motion.a>
              <a href="#programa"
                className="border border-white/20 text-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] rounded-xl hover:border-white/50 hover:text-white/80 transition-all">
                Ver programa
              </a>
            </div>

          </motion.div>

          {/* RIGHT — raw photo, no captions */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center p-8 lg:p-10"
          >
            <div className="relative rounded-2xl overflow-hidden w-full shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <img
                src="/aldeiathumb.jpeg"
                alt="Conquista das Aldeias Históricas"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>

        {/* Bottom quote strip */}
        <div className="relative z-10 px-8 md:px-16 py-8 border-t border-white/5">
          <p className="text-white/12 text-xs uppercase tracking-[0.5em] text-center">
            &ldquo;O interior de Portugal está à espera. Só tens de ir.&rdquo;
          </p>
        </div>
      </section>

      {/* MAPA INTERATIVO */}
      <div className="bg-[#f5f0eb] py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-3">A rota</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold text-black">As 12 aldeias da conquista</h2>
              <p className="text-black/25 text-xs uppercase tracking-widest hidden md:block">Clica para explorar</p>
            </div>
          </motion.div>

          {/* Card container — rounded, no hard edges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#1a1a1a] rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-2xl"
          >

            {/* Map side */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-[#111]">
              <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: 480, width: '100%' }}>
                <img src="/mapa.jpeg" alt="Mapa da rota" className="w-full h-auto block" />
                <div className="absolute inset-0 bg-black/15 rounded-2xl" />

                {/* Village pins */}
                {villages.map((v, i) => (
                  <motion.button
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
                    onClick={() => setSelectedVillage(i)}
                    style={{ left: `${v.x}%`, top: `${v.y}%`, position: 'absolute' }}
                    className="transform -translate-x-1/2 -translate-y-1/2 group z-10"
                  >
                    {selectedVillage === i && (
                      <motion.div
                        animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                        className="absolute inset-0 rounded-full bg-neon-yellow"
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.3 }}
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shadow-2xl transition-all duration-200 ${
                        selectedVillage === i
                          ? 'bg-neon-yellow text-black scale-110'
                          : 'bg-black text-white border-2 border-white/60 hover:bg-white hover:text-black'
                      }`}
                      style={{ textShadow: 'none' }}
                    >
                      {i + 1}
                    </motion.div>
                    <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1.5 rounded-lg pointer-events-none transition-opacity duration-200 ${
                      selectedVillage === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      {v.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-black/90" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="w-full lg:w-[360px] flex-shrink-0 border-t border-white/5 lg:border-t-0 lg:border-l border-white/5 flex flex-col">
              <motion.div
                key={selectedVillage}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full p-7"
              >
                <div className="relative overflow-hidden rounded-2xl mb-5 flex-shrink-0" style={{ height: 190 }}>
                  <img
                    src={villages[selectedVillage].img}
                    alt={villages[selectedVillage].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="text-white/15 font-bold text-2xl leading-none tabular-nums">#{String(selectedVillage + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold text-white leading-tight">{villages[selectedVillage].name}</h3>
                </div>
                <p className="text-neon-yellow/60 text-xs italic mb-4">"{villages[selectedVillage].note}"</p>
                <p className="text-white/45 text-sm leading-relaxed flex-1">{villages[selectedVillage].desc}</p>

                <div className="mt-6 pt-5 border-t border-white/8 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedVillage(Math.max(0, selectedVillage - 1))}
                    disabled={selectedVillage === 0}
                    className="text-white/30 hover:text-white disabled:opacity-20 transition-colors text-xs uppercase tracking-widest"
                  >← Ant.</button>
                  <div className="flex gap-1.5 items-center">
                    {villages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVillage(i)}
                        className={`rounded-full transition-all duration-200 ${i === selectedVillage ? 'w-4 h-1.5 bg-neon-yellow' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/50'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedVillage(Math.min(villages.length - 1, selectedVillage + 1))}
                    disabled={selectedVillage === villages.length - 1}
                    className="text-white/30 hover:text-white disabled:opacity-20 transition-colors text-xs uppercase tracking-widest"
                  >Próx. →</button>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* PROGRAMA DIA A DIA */}
      <div id="programa" className="bg-[#f5f0eb] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-4">Itinerário</p>
            <h2 className="text-3xl font-bold text-black mb-14">O programa dia a dia</h2>
          </motion.div>
          <div className="space-y-6">
            {itinerary.map((day, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_280px]">
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{day.day}</span>
                    <span className="text-xs text-black/35 uppercase tracking-widest">{day.tag}</span>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-4">{day.title}</h3>
                  <p className="text-sm text-black/55 leading-relaxed">{day.desc}</p>
                </div>
                <div className="relative overflow-hidden min-h-[220px]">
                  <img src={day.img} alt={day.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* INCLUÍDO / NÃO INCLUÍDO */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-4">O que está incluído</p>
            <h2 className="text-2xl font-bold text-black mb-8">Tudo no preço</h2>
            <div className="space-y-4">
              {included.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3">
                  <span className="text-[#ccff00] bg-[#1a1a1a] rounded-full w-5 h-5 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <p className="font-semibold text-black text-sm">{item.label}</p>
                    <p className="text-xs text-black/45 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-4">Não incluído</p>
            <h2 className="text-2xl font-bold text-black mb-8">O que fica de fora</h2>
            <div className="space-y-3 mb-12">
              {notIncluded.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-black/25 flex-shrink-0 mt-0.5 text-sm">—</span>
                  <p className="text-sm text-black/50">{item}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#f5f0eb] rounded-2xl p-7">
              <p className="font-bold text-black text-sm mb-2">Nível de dificuldade</p>
              <div className="flex gap-2 mb-3">
                {[1,2,3,4,5].map(n => <div key={n} className={`h-2 flex-1 rounded-full ${n <= 2 ? 'bg-[#1a1a1a]' : 'bg-black/10'}`} />)}
              </div>
              <p className="text-xs text-black/45 leading-relaxed">Baixo. Não precisas de experiência com motos. Se consegues andar de bicicleta, consegues fazer esta rota.</p>
            </div>
            <div className="mt-4 bg-[#f5f0eb] rounded-2xl p-7">
              <p className="font-bold text-black text-sm mb-1">📍 Ponto de encontro</p>
              <p className="text-xs text-black/45 leading-relaxed">Belmonte, Beira Interior — a terra de Pedro Álvares Cabral. Podes chegar de carro, autocarro ou comboio até à Covilhã (30 min).</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* DATAS */}
      <div id="datas" className="bg-[#1a1a1a] py-20">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">Datas disponíveis</p>
            <h2 className="text-3xl font-bold text-white mb-12">Escolhe a tua edição</h2>
          </motion.div>
          <div className="space-y-3">
            {dates.length === 0 && (
              <div className="text-white/30 text-sm text-center py-8">A carregar datas…</div>
            )}
            {dates.map((d, i) => {
              const isEsgotado = d.status === 'esgotado';
              const isAPreencher = d.status === 'apreencher';
              return (
                <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 cursor-pointer grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold text-lg">{d.date_range}</span>
                      {isAPreencher && <span className="bg-[#ff4e00]/20 text-[#ff6040] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Últimas vagas</span>}
                      {isEsgotado && <span className="bg-white/10 text-white/40 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">Esgotado</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30 uppercase tracking-widest">{d.spots} vaga{d.spots !== 1 ? 's' : ''} disponíve{d.spots !== 1 ? 'is' : 'l'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{d.price}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">desde / pessoa</p>
                  </div>
                  {!isEsgotado ? (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setBookingDate(d)}
                      className="bg-[#FFE600] text-black px-7 py-3 font-bold text-xs uppercase tracking-[0.12em] rounded-xl hover:bg-white transition-colors whitespace-nowrap">
                      Reservar lugar
                    </motion.button>
                  ) : (
                    <span className="text-white/25 text-xs uppercase tracking-widest">Esgotado</span>
                  )}
                </motion.div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-white/25 text-xs font-body">Reserva com 50% de entrada · Cancelamento grátis até 30 dias antes</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/30 mb-4">Perguntas frequentes</p>
            <h2 className="text-3xl font-bold text-black mb-10">FAQ</h2>
          </motion.div>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="border border-black/8 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex items-center justify-between px-6 py-5 hover:bg-[#f5f0eb] transition-colors">
                  <span className="font-semibold text-sm text-black">{f.q}</span>
                  <span className="text-black/30 text-lg ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-black/55 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="bg-brutal-black pt-2 pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-1.5">
          {galleryImgs.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
              className="overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* OUTRAS AVENTURAS */}
      <section className="bg-brutal-black py-20">
        <div className="px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/25 mb-3">Bored Originals</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-[0.9]">Outras<br/><span className="text-neon-yellow">aventuras</span></h2>
            </div>
            <p className="text-white/30 font-body text-xs uppercase tracking-[0.25em]">Também deves gostar</p>
          </motion.div>
          <div className="flex gap-5 overflow-x-auto pb-4 select-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {originals.filter(o => o.title !== "Conquista das Aldeias Históricas").map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group relative flex-shrink-0 overflow-hidden rounded-3xl"
                style={{ width: 'clamp(260px, 22vw, 360px)', aspectRatio: '2/3' }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${item.comingSoon ? 'grayscale-[60%] brightness-75' : ''}`}
                  style={{ objectPosition: (item as any).objectPosition ?? 'center center' }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
                <div className="absolute top-6 right-6">
                  <span className="font-body text-xs font-semibold text-white/25 tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="absolute top-6 left-6 flex items-center gap-2">
                  <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 font-body text-[9px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
                    Original
                  </span>
                  {item.comingSoon && (
                    <span className="bg-neon-yellow/90 text-brutal-black font-body text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full">
                      Em breve
                    </span>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 flex flex-col">
                  <h3 className="text-xl font-bold text-white leading-snug mb-3 group-hover:text-neon-yellow transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="overflow-hidden">
                    <p className="text-white/55 font-body text-xs leading-relaxed translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out mb-4">
                      {item.desc}
                    </p>
                  </div>
                  {item.comingSoon && (
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 ease-out">
                      <p className="text-white/30 font-body text-[10px] uppercase tracking-[0.2em]">A caminho — fica atento</p>
                    </div>
                  )}
                </div>
                <div className={`absolute inset-0 rounded-3xl ring-1 ring-white/5 transition-all duration-500 ${item.comingSoon ? 'group-hover:ring-white/10' : 'group-hover:ring-neon-yellow/30'}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

function NewsletterSimple() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError('Insere um email válido.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error: subError } = await subscribeNewsletter(normalizedEmail);
      if (subError) throw new Error(subError);
      setSubmitted(true);
      setEmail('');
    } catch {
      setError('Não foi possível subscrever. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative bg-brutal-black overflow-hidden py-28 md:py-36">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* glow amarelo central */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-yellow/[0.05] blur-[120px]" />
        {/* linha topo */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {/* linha fundo */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-16 max-w-3xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-neon-yellow font-body text-[9px] font-bold uppercase tracking-[0.45em] mb-6">Newsletter</p>

          <h2 className="text-white font-body font-extrabold leading-[0.88] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
            Nunca percas<br /><span className="text-neon-yellow italic">uma aventura.</span>
          </h2>

          <p className="text-white/40 font-body text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Novas experiências, vagas que abrem, criadores de conteúdo a fazer algo único, locais desconhecidos. Mensalmente enviamos-te uma curadoria do melhor que há em Portugal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M4 14l7 7L24 7" stroke="#E8FF47" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-white font-body font-bold text-lg">Estás dentro.</p>
              <p className="text-white/35 font-body text-sm">Quando houver novidade, és o primeiro a saber.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="o.teu@email.com"
                className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-2xl px-5 py-4 text-white text-sm font-body placeholder-white/20 focus:outline-none focus:border-neon-yellow/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-neon-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-[0.18em] px-7 py-4 rounded-2xl hover:bg-white transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? 'A enviar…' : 'Subscrever →'}
              </button>
            </form>
          )}

          {error && (
            <p className="text-red-400 font-body text-xs mt-4">{error}</p>
          )}

          {!submitted && (
            <p className="text-white/15 font-body text-[10px] uppercase tracking-[0.35em] mt-5">
              Zero spam · podes sair quando quiseres
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function PartnerModal({ type, onClose }: { type: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const content: Record<string, { emoji: string; headline: string; body: string }> = {
    hotel: {
      emoji: '🏨',
      headline: 'Transforma o teu hotel num destino.',
      body: 'Há uma diferença entre um sítio onde se dorme e um sítio a que se volta. Queremos trabalhar com hotéis que percebem isso para construirmos experiências que marquem a vida das pessoas ',
    },
    alojamento: {
      emoji: '🏡',
      headline: 'O teu alojamento no coração da aventura.',
      body: 'Se tens um alojamento com identidade e algo fora da caixa, queremos conhecê-lo.',
    },
    quinta: {
      emoji: '🌿',
      headline: 'A tua quinta como ponto de paragem.',
      body: 'Uma quinta com história é exactamente o tipo de lugar que as nossas aventuras procuram. Seja para uma refeição, uma noite ou uma experiência, acreditamos que o território ganha quando os seus produtores fazem parte da rota.',
    },
    operador: {
      emoji: '🧭',
      headline: 'Vamos construir algo maior juntos.',
      body: 'Se és operador turístico e acreditas que Portugal merece experiências à altura do que tem para oferecer, estamos na mesma página. Queremos criar um ecossistema de aventuras que seja referência — e isso faz-se com os parceiros certos.',
    },
  };

  const c = content[type];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-sm p-8 relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all text-xl">×</button>

        {!submitted ? (
          <>
            <div className="text-4xl mb-5">{c.emoji}</div>
            <h3 className="text-white font-bold text-xl leading-snug mb-3">{c.headline}</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-7">{c.body}</p>
            <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true); }} className="space-y-3">
              <input
                type="email"
                placeholder="o.teu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-neon-yellow/60 transition-colors"
              />
              <button type="submit"
                className="w-full bg-neon-yellow text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-colors">
                Entrar em contacto →
              </button>
            </form>
            <p className="text-white/20 text-[10px] text-center mt-4 uppercase tracking-widest">Respondemos em 48h.</p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
            <div className="text-4xl mb-5">🤝</div>
            <h3 className="text-white font-bold text-xl mb-3">Mensagem recebida!</h3>
            <p className="text-white/40 text-sm leading-relaxed">Entraremos em contacto em breve. Vai ser bom.</p>
            <button onClick={onClose} className="mt-7 border border-white/15 text-white/50 px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:border-white/40 hover:text-white transition-colors">Fechar</button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  const [partner, setPartner] = useState<string | null>(null);

  const partners = [
    { key: 'hotel',      label: 'Tens um hotel?' },
    { key: 'alojamento', label: 'Tens um alojamento local?' },
    { key: 'quinta',     label: 'Tens uma quinta?' },
    { key: 'operador',   label: 'És operador turístico?' },
  ];

  return (
    <footer className="relative text-left overflow-hidden" style={{ backgroundImage: 'url(https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/footer.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top', minHeight: '55vh' }}>
      {partner && <PartnerModal type={partner} onClose={() => setPartner(null)} />}
      {/* Dark overlay — stronger at bottom */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.3) 100%)' }} />

      <div className="relative z-20 w-full flex flex-col justify-end px-8 md:px-16 pb-10 pt-40">

        {/* Main content row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10 border-b border-white/15 pb-10 text-center md:text-left items-center md:items-end">
          {/* Left — brand + tagline */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl leading-[0.95] font-body font-extrabold text-white tracking-tight">
              A tua próxima<br/><span className="text-neon-yellow italic">história</span><br/>começa aqui.
            </h2>
          </div>

          {/* Middle — nav links */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <p className="text-white/60 font-body text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Explorar</p>
            {[['Ver experiências', '#originals'], ['Próximas saídas', '#saidas'], ['Sobre nós', '#sobre'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={label} href={href} className="text-white/75 hover:text-neon-yellow font-body text-sm font-medium transition-colors duration-200">{label}</a>
            ))}
          </div>

          {/* Right — partners */}
          <div className="flex flex-col gap-2 items-center md:items-start">
            <p className="text-white/60 font-body text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">Parcerias</p>
            {partners.map(p => (
              <button key={p.key} onClick={() => setPartner(p.key)}
                className="text-left text-white/75 hover:text-neon-yellow font-body text-sm font-medium transition-colors duration-200">
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 items-center md:items-start">
            <p className="text-white/60 font-body text-[10px] uppercase tracking-[0.3em] mb-1 font-bold">Redes sociais</p>
            <div className="flex gap-2">
              <motion.a href="#" whileHover={{ scale: 1.12 }} className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:border-neon-yellow/70 hover:text-neon-yellow transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.12 }} className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:border-neon-yellow/70 hover:text-neon-yellow transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9.4l5.5 2.6-5.5 2.5z"/></svg>
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.12 }} className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:border-neon-yellow/70 hover:text-neon-yellow transition-all">
                <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 3h-3.2v11.4c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V8.3c-.3 0-.6-.1-.9-.1C9.3 8.2 6 11.5 6 15.6S9.3 23 13.5 23s7.5-3.3 7.5-7.4V8.5c1.2.9 2.7 1.4 4.3 1.4V6.7C22.5 6.7 19.6 5.1 19.6 3z"/></svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-white/40 font-body text-xs uppercase tracking-widest text-center">
          <p>&copy; {new Date().getFullYear()} Bored Original.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Sofrimento</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Activity Page Data ───────────────────────────────────────────────────────

const activityDetails = [
  {
    title: "Subida ao Pico",
    tagline: "O topo de Portugal está à tua espera.",
    location: "Açores, Ilha do Pico",
    duration: "3 dias · 2 noites",
    difficulty: "Difícil",
    price: "349€",
    maxPeople: 10,
    heroImage: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png",
    heroVideo: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/PICO%20ISLAND%20%20FAIAL%20AZORES%20PORTUGAL%20DRONE%204K_1.mp4",
    description: "O Pico tem 2351 metros e é o ponto mais alto de Portugal. Não é uma caminhada para iniciados — é uma escalada técnica, com passagens de lava vulcânica, neblina constante e temperaturas que mudam a cada 200 metros. Mas no topo, quando as nuvens abrem, vês os outros vulcões dos Açores à tua volta e percebes que não há sítio no mundo igual a este.",
    highlights: [
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png",
    ],
    review: {
      text: "Cheguei ao topo às 4h da manhã com as pernas a tremer e lágrimas nos olhos. Nunca me senti tão pequeno e tão poderoso ao mesmo tempo. Obrigado, Bored.",
      author: "Miguel R.",
      role: "Participante, Outubro 2024",
      image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/review.jpeg",
    },
    includes: [
      { icon: "🏔️", label: "Guia de montanha certificado", detail: "Guia experiente com certificação IFMGA e mais de 100 subidas ao Pico." },
      { icon: "⛺", label: "Alojamento 2 noites", detail: "Casa rural no sopé do vulcão, com vista para a caldeira." },
      { icon: "🍽️", label: "Todas as refeições incluídas", detail: "Pequenos-almoços, almoços de campo e jantares em conjunto." },
      { icon: "🎒", label: "Equipamento técnico", detail: "Bastões, gamashas e kit de segurança. Trazes apenas as botas." },
      { icon: "📸", label: "Fotógrafo na subida", detail: "Registo profissional da expedição. Ficheiros digitais entregues em 7 dias." },
      { icon: "🚐", label: "Transferes locais", detail: "Transportes entre o alojamento e o ponto de partida da subida." },
    ],
    notIncludes: [
      "Voo para a ilha do Pico",
      "Seguro de viagem pessoal (recomendado)",
      "Botas de trekking (lista detalhada enviada após reserva)",
      "Bebidas alcoólicas",
    ],
    itinerary: [
      { day: "Dia 1", title: "Chegada e aclimatação", desc: "Chegada ao aeroporto de Pico. Transfer para o alojamento, briefing completo com o guia, reconhecimento do terreno e jantar de boas-vindas. Dormir cedo — a subida começa antes do sol." },
      { day: "Dia 2", title: "Subida ao cume", desc: "Partida às 2h da madrugada. A subida demora entre 5 e 7 horas dependendo do ritmo. O objectivo é estar no topo ao nascer do sol. Descida na manhã, almoço no topo ou no regresso, tarde livre para recuperar." },
      { day: "Dia 3", title: "Explorar o Pico & regresso", desc: "Manhã livre para explorar a ilha — adegas centenárias, lagoas vulcânicas, costa de lava negra. Almoço em conjunto. Transfer para o aeroporto." },
    ],
    packingList: [
      "Botas de trekking impermeáveis (obrigatório)",
      "Mochila de 20-30L",
      "Casaco de lã ou softshell",
      "Impermeável leve",
      "Luvas e gorro (mesmo no verão)",
      "Lanterna frontal com pilhas extra",
      "Camadas base de merino ou sintético (2x)",
      "Bastões de trekking (fornecidos ou teus)",
      "Protetor solar SPF50+",
      "1.5L de água (pontos de reabastecimento limitados)",
    ],
    faqs: [
      { q: "Qual o nível de condição física necessário?", a: "Médio-alto. Deves ser capaz de caminhar 6+ horas com 1200m de desnível positivo. Não é necessária experiência técnica de escalada, mas é exigente." },
      { q: "Qual a melhor época para subir?", a: "Maio a Outubro. O inverno tem condições instáveis e a subida pode ser encerrada pelas autoridades. A nossa expedição acontece apenas em meses favoráveis." },
      { q: "E se o tempo não permitir a subida?", a: "Se as condições meteorológicas impedirem a subida, temos sempre um plano B com actividades alternativas na ilha. Reembolso parcial ou nova data em caso de cancelamento por mau tempo." },
      { q: "Quantas pessoas por expedição?", a: "Máximo 10. Grupos pequenos garantem mais atenção, ritmo personalizado e uma experiência muito mais autentica." },
    ],
    digitalDetox: "Nesta expedição pedimos que deixes o telemóvel no bolso durante a subida. Não há cobertura acima de certa altitude de qualquer forma — e é exactamente aí que as melhores conversas acontecem. O fotógrafo regista tudo. Tu podes simplesmente estar presente.",
    cancellations: "Cancelamento gratuito até 30 dias antes da partida. Entre 30 e 15 dias, devolução de 50% do valor pago. Menos de 15 dias, sem reembolso — mas podes ceder o teu lugar a outra pessoa sem custo adicional. Cancelamento por condições meteorológicas: nova data oferecida ou reembolso total.",
  },
  {
    title: "Descida da Costa",
    tagline: "De norte a sul, pelo litoral mais selvagem de Portugal.",
    location: "Costa Vicentina",
    duration: "4 dias · 3 noites",
    difficulty: "Moderado",
    price: "299€",
    maxPeople: 12,
    heroImage: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png",
    description: "A Costa Vicentina é a costa mais selvagem da Europa Ocidental. Dunas, falésias, praias sem nome, aldeias de pescadores. Fazemos este percurso de bicicleta, ao ritmo da costa atlântica, com paragens onde a vontade manda e noites em alojamentos locais escolhidos a dedo.",
    highlights: [
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png",
      "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png",
    ],
    review: {
      text: "Quatro dias a pedalar pela costa mais bonita que já vi. Cada paragem era melhor que a anterior. Volto com certeza.",
      author: "Ana P.",
      role: "Participante, Setembro 2024",
      image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png",
    },
    includes: [
      { icon: "🚴", label: "Bicicleta de trail", detail: "Bicicleta de qualidade, ajustada antes da partida. Capacete incluído." },
      { icon: "🏠", label: "Alojamento 3 noites", detail: "Alojamentos locais selecionados, com carácter e conforto." },
      { icon: "🍽️", label: "Pequenos-almoços e jantares", detail: "Almoços na estrada à tua escolha — tens sugestões no guia." },
      { icon: "🗺️", label: "Guia digital da rota", detail: "App com GPX, pontos de interesse, paragens recomendadas e segredos locais." },
      { icon: "🚐", label: "Transfer de regresso", detail: "No final do percurso, regresso ao ponto de partida incluído." },
    ],
    notIncludes: ["Transporte até ao ponto de partida", "Almoços ao longo do percurso", "Equipamento pessoal de ciclismo"],
    itinerary: [
      { day: "Dia 1", title: "Porto Covo → Vila Nova de Milfontes", desc: "Ponto de encontro em Porto Covo. Entrega das bicicletas e briefing. Primeiro troço pela costa, com paragem na Praia do Malhão." },
      { day: "Dia 2", title: "Vila Nova → Zambujeira do Mar", desc: "O troço mais selvagem. Falésias altas, praias desertas, muito vento. Almoço numa das praias sem nome." },
      { day: "Dia 3", title: "Zambujeira → Odeceixe", desc: "Troço mais curto mas mais técnico. Tarde livre em Odeceixe." },
      { day: "Dia 4", title: "Odeceixe → Sagres", desc: "Grande final até ao Cabo de São Vicente, o ponto mais sudoeste da Europa." },
    ],
    packingList: ["Roupa de ciclismo (2 sets)", "Calções e t-shirts para as noites", "Protetor solar", "Óculos de sol", "Garrafa de água", "Snacks para a estrada"],
    faqs: [
      { q: "Preciso de experiência em ciclismo?", a: "Não é necessária experiência técnica, mas deves estar confortável a pedalar 40-60km por dia em terreno variado." },
      { q: "As bicicletas são elétricas?", a: "Não. São bicicletas de trail convencionais. Se preferires elétrica, contacta-nos antes da reserva — pode ser arranjada com custo adicional." },
    ],
    digitalDetox: "A estrada é o detox. Quando estás a pedalar pela costa com o vento na cara, o telemóvel torna-se irrelevante naturalmente.",
    cancellations: "Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.",
  },
  // Remaining activities with minimal but complete data
  ...[
    { idx: 1, title: "Sobreviver 24h", location: "Serra, Portugal", duration: "1 dia · 1 noite", difficulty: "Difícil", price: "180€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/5.png", desc: "24 horas na natureza com o mínimo. Aprende a fazer fogo, a encontrar água, a construir abrigo e a não entrar em pânico. Um instrutor de sobrevivência lidera a experiência.", review: "Nunca pensei que conseguia. Mas consegui. E foi a coisa mais orgulhosa que já fiz.", reviewAuthor: "Pedro A." },
    { idx: 2, title: "Descida da Costa", location: "Costa Vicentina", duration: "4 dias · 3 noites", difficulty: "Moderado", price: "299€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png", desc: "A Costa Vicentina de bicicleta, do Porto Covo a Sagres. A costa mais selvagem da Europa Ocidental a um ritmo humano.", review: "Uma experiência incrível. A costa nunca mais vai ser a mesma.", reviewAuthor: "Ana C." },
    { idx: 3, title: "À Vela pelo Oceano", location: "Atlântico, Cascais", duration: "3 dias · 2 noites", difficulty: "Moderado", price: "399€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png", desc: "Navega em alto mar sob as instruções de um skipper experiente. Sem destino fixo, sem relógio, apenas o vento e o Atlântico. Aprende as manobras básicas de vela e dorme ao som das ondas.", review: "A melhor decisão que tomei este ano. Dormir no barco com o som do oceano é inesquecível.", reviewAuthor: "João F." },
    { idx: 4, title: "Cabine no Meio do Nada", location: "Interior de Portugal", duration: "2 dias · 1 noite", difficulty: "Fácil", price: "149€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/4.png", desc: "Uma cabine isolada no meio do monte, sem wifi, sem vizinhos, sem agenda. Fogueira, estrelas e silêncio total. O antídoto perfeito para o ruído da cidade.", review: "Precisava mesmo disto. 24h sem telemóvel e saí uma pessoa nova.", reviewAuthor: "Sara M." },
    { idx: 5, title: "Aldeias Históricas de Mota", location: "Beira Interior", duration: "3 dias · 2 noites", difficulty: "Fácil", price: "199€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png", desc: "Percorre as aldeias históricas de Portugal numa scooter de 50cc. Castelos, ruelas de pedra, miradouros de cortar a respiração. Ao teu ritmo, sem guia, com um virtual guide que te leva a todos os segredos.", review: "Três dias perfeitos. A scooter, as aldeias e a liberdade total são uma combinação imbatível.", reviewAuthor: "Catarina L." },
    { idx: 6, title: "Rally pela N2 Velharias", location: "N2, Portugal", duration: "4 dias · 3 noites", difficulty: "Moderado", price: "249€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/8.png", desc: "A N2 tem 738km de norte a sul. Fazemo-la em carros com mais de 20 anos, sem GPS, com um mapa de papel. Avarias fazem parte. É um rally, não é um road trip.", review: "O meu carro avariou 3 vezes. Foi a melhor aventura da minha vida. Já me inscrevi para o próximo.", reviewAuthor: "Bruno S." },
    { idx: 7, title: "Trilhos Selvagens no Gerês", location: "Parque Nacional Peneda-Gerês", duration: "2 dias · 1 noite", difficulty: "Difícil", price: "179€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png", desc: "Trilhos fora das rotas marcadas no único parque nacional de Portugal. Cascatas escondidas, floresta primária, silêncio absoluto. Só botas, mochila e instinto.", review: "Nunca vi o Gerês assim. Os trilhos que fizemos não existem no AllTrails — e é melhor assim.", reviewAuthor: "Inês G." },
    { idx: 8, title: "Caminhos de Santiago a Correr", location: "Caminho Português", duration: "5 dias · 4 noites", difficulty: "Muito Difícil", price: "349€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/10.png", desc: "O Caminho de Santiago a correr. Os últimos 120km do Caminho Português em 5 dias de trail running. Sem filosofia, com muito asfalto, granito e chuva.", review: "Parti os joelhos, a alma e o ego. E fiz os melhores amigos da minha vida em 5 dias.", reviewAuthor: "Rui T." },
    { idx: 9, title: "Até Marrocos de 4x4", location: "Portugal → Marrocos", duration: "10 dias · 9 noites", difficulty: "Moderado", price: "1290€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/11.png", desc: "Lisboa ao deserto do Saara em 4x4. Atravessamos o estreito de Gibraltar, mergulhamos nas medinas, dormimos em tendas berberes e voltamos com o carro cheio de areia e histórias.", review: "10 dias que mudaram a minha perspectiva sobre tudo. Portugal → Marrocos é uma viagem que toda a gente devia fazer.", reviewAuthor: "Diana C." },
    { idx: 10, title: "Conquista as Montanhas", location: "Serra da Estrela", duration: "2 dias · 1 noite", difficulty: "Difícil", price: "229€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png", desc: "Via ferrata, rappel e canyoning na Serra da Estrela. Altitudes que tiram o fôlego. Literalmente. Guia técnico incluído.", review: "Tinha medo de alturas. Já não tenho. Simples assim.", reviewAuthor: "Tomás N." },
    { idx: 11, title: "Conquista as Ondas", location: "Costa Atlântica", duration: "3 dias · 2 noites", difficulty: "Fácil/Moderado", price: "249€", image: "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png", desc: "Aulas de surf intensivas com instrutores locais, nas melhores praias do litoral. Para quem nunca surfou ou quer melhorar. Do white water ao green wave em 3 dias.", review: "Entrei na água com medo e saí com um sorriso enorme. O melhor investimento que fiz este ano.", reviewAuthor: "Filipa B." },
  ].map(a => ({
    title: a.title, tagline: a.desc.split('.')[0] + '.', location: a.location, duration: a.duration,
    difficulty: a.difficulty, price: a.price, maxPeople: 10, heroImage: a.image, description: a.desc,
    highlights: [a.image, "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png", "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png", "https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png"],
    review: { text: a.review, author: a.reviewAuthor, role: "Participante, 2024", image: a.image },
    includes: [
      { icon: "🗺️", label: "Guia ou virtual guide", detail: "Tudo o que precisas para não te perderes." },
      { icon: "🏠", label: "Alojamento incluído", detail: "Selecionado com critério. Sem surpresas." },
      { icon: "🍽️", label: "Refeições principais", detail: "Conforme indicado no programa." },
      { icon: "🛡️", label: "Seguro de viagem", detail: "Cobertura completa durante a expedição." },
    ],
    notIncludes: ["Transporte até ao ponto de partida", "Refeições não indicadas no programa", "Despesas pessoais"],
    itinerary: [
      { day: "Dia 1", title: "Chegada e briefing", desc: "Encontro com o grupo, apresentação do programa e primeira refeição em conjunto." },
      { day: "Dia 2", title: "A aventura começa", desc: "O coração da experiência. Tudo o que vieste aqui fazer." },
      { day: "Dia 3", title: "Regresso", desc: "Últimas horas de aventura, partilha de histórias e regresso." },
    ],
    packingList: ["Calçado adequado à atividade", "Mochila de dia", "Protetor solar", "Garrafa de água reutilizável", "Roupa em camadas", "Documento de identidade"],
    faqs: [
      { q: "Para que nível é indicado?", a: `Esta experiência é indicada para nível ${a.difficulty}. Preparação física básica recomendada.` },
      { q: "Quanto antecipação devo reservar?", a: "Recomendamos 2-4 semanas de antecedência. Vagas limitadas a ${a.maxPeople ?? 10} pessoas." },
    ],
    digitalDetox: "Pedimos que, sempre que possível, guardes o telemóvel e vivencias o momento. O fotógrafo cuida dos registos.",
    cancellations: "Cancelamento gratuito até 30 dias antes. Entre 30-15 dias, 50% de reembolso. Menos de 15 dias, sem reembolso.",
  })),
];

const tabIds = ['descricao', 'inclui', 'itinerario', 'material', 'faqs', 'cancelamentos'] as const;
const tabLabels = ['O que inclui', 'Itinerário', 'Lista de material', 'FAQs', 'Detox Digital', 'Cancelamentos'];

// Per-activity dates
const activityDates: Record<number, { range: string; status: 'disponivel' | 'apreencher' | 'esgotado'; spots: number; price: string }[]> = {
  0: [
    { range: '18 Jul — 20 Jul 2026', status: 'disponivel', spots: 3, price: '349€' },
    { range: '8 Ago — 10 Ago 2026', status: 'apreencher', spots: 4, price: '349€' },
    { range: '5 Set — 7 Set 2026', status: 'disponivel', spots: 8, price: '349€' },
  ],
  1: [
    { range: '1 Ago — 4 Ago 2026', status: 'disponivel', spots: 5, price: '299€' },
    { range: '12 Set — 15 Set 2026', status: 'disponivel', spots: 10, price: '299€' },
  ],
  2: [{ range: '22 Ago — 24 Ago 2026', status: 'disponivel', spots: 6, price: '399€' }, { range: '10 Out — 12 Out 2026', status: 'apreencher', spots: 2, price: '399€' }],
  3: [{ range: '5 Jul — 6 Jul 2026', status: 'disponivel', spots: 8, price: '149€' }, { range: '2 Ago — 3 Ago 2026', status: 'disponivel', spots: 8, price: '149€' }],
  4: [{ range: '22 Ago — 23 Ago 2026', status: 'apreencher', spots: 2, price: '199€' }, { range: '20 Set — 21 Set 2026', status: 'disponivel', spots: 8, price: '199€' }],
  5: [{ range: '18 Abr — 20 Abr 2026', status: 'disponivel', spots: 3, price: '199€' }, { range: '16 Mai — 18 Mai 2026', status: 'apreencher', spots: 2, price: '199€' }],
  6: [{ range: '10 Mai — 13 Mai 2026', status: 'disponivel', spots: 7, price: '249€' }, { range: '14 Jun — 17 Jun 2026', status: 'disponivel', spots: 8, price: '249€' }],
  7: [{ range: '6 Jun — 7 Jun 2026', status: 'disponivel', spots: 6, price: '179€' }, { range: '4 Out — 5 Out 2026', status: 'disponivel', spots: 8, price: '179€' }],
  8: [{ range: '15 Mai — 19 Mai 2026', status: 'disponivel', spots: 5, price: '349€' }, { range: '3 Out — 7 Out 2026', status: 'disponivel', spots: 8, price: '349€' }],
  9: [{ range: '10 Out — 20 Out 2026', status: 'disponivel', spots: 4, price: '1290€' }],
  10: [{ range: '28 Jun — 29 Jun 2026', status: 'disponivel', spots: 7, price: '229€' }, { range: '13 Set — 14 Set 2026', status: 'disponivel', spots: 8, price: '229€' }],
  11: [{ range: '5 Set — 7 Set 2026', status: 'disponivel', spots: 6, price: '249€' }, { range: '3 Out — 5 Out 2026', status: 'apreencher', spots: 3, price: '249€' }],
};

// Per-activity destination spots
const activitySpots: Record<number, { name: string; desc: string; image: string }[]> = {
  0: [
    { name: 'Cume do Pico', desc: 'O ponto mais alto de Portugal. Vista para todas as ilhas num dia limpo.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/1.png' },
    { name: 'Caldeira Negra', desc: 'Uma cratera vulcânica de tirar o fôlego no interior da ilha.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/12.png' },
    { name: 'Adega do Pico', desc: 'Vinhas centenárias classificadas pela UNESCO numa paisagem única no mundo.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png' },
    { name: 'Furnas do Enxofre', desc: 'Fumarolas e sulfurosas num cenário de outro planeta.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/9.png' },
  ],
  1: [
    { name: 'Praia do Amado', desc: 'A praia mais selvagem do Alentejo. Ondas perfeitas, sem multidões.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/2.png' },
    { name: 'Cabo de São Vicente', desc: 'O fim do mundo. Literalmente o ponto mais sudoeste da Europa.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/13.png' },
    { name: 'Zambujeira do Mar', desc: 'Falésia alta, praia escondida, silêncio absoluto.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/3.png' },
    { name: 'Porto Covo', desc: 'Vila de pescadores com casas caiadas e o melhor peixe da costa.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/6.png' },
  ],
};

function ActivityPage({ activityIndex, onBack, autoBook = false }: { activityIndex: number; onBack: () => void; autoBook?: boolean }) {
  const [dbAdv, setDbAdv] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('inclui');
  const [curiosityIndex, setCuriosityIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [bookingDate, setBookingDate] = useState<{ id: string; date_range: string; status: string; spots: number; price: string } | null>(null);
  const [waitlistDate, setWaitlistDate] = useState<{ id: string; date_range: string; status: string; spots: number; price: string } | null>(null);

  useEffect(() => {
    setDbAdv(null);
    getAdventureByIndex(activityIndex).then(adv => {
      if (adv) {
        setDbAdv(adv);
        if (autoBook) {
          // auto-open with first available date
          const firstAvailable = (adv.activity_dates ?? []).find((d: any) => d.status !== 'esgotado') ?? adv.activity_dates?.[0];
          const syntheticDate = firstAvailable ?? {
            id: adv.id,
            date_range: 'A definir',
            status: 'disponivel',
            spots: adv.max_people ?? 10,
            price: adv.price ?? '0€',
          };
          setBookingDate({ id: syntheticDate.id, date_range: syntheticDate.date_range, status: syntheticDate.status, spots: syntheticDate.spots, price: syntheticDate.price });
        }
      }
    }).catch(console.error);
  }, [activityIndex, autoBook]);

  // Mapear campos do Supabase para o formato esperado pelos componentes
  const data = dbAdv ? {
    id: dbAdv.id as string,
    title: dbAdv.title,
    tagline: dbAdv.tagline,
    location: dbAdv.location,
    duration: dbAdv.duration,
    difficulty: dbAdv.difficulty,
    price: dbAdv.price,
    maxPeople: dbAdv.max_people,
    heroImage: dbAdv.hero_image,
    heroVideo: dbAdv.hero_video,
    description: dbAdv.description,
    highlights: dbAdv.highlights ?? [],
    review: {
      text: dbAdv.review_text,
      author: dbAdv.review_author,
      role: dbAdv.review_role,
      image: dbAdv.review_image,
    },
    includes: dbAdv.includes ?? [],
    notIncludes: dbAdv.not_includes ?? [],
    itinerary: (dbAdv.itinerary ?? []).map((i: any) => ({
      day: i.day_label,
      title: i.title,
      desc: i.description,
    })),
    packingList: dbAdv.packing_list ?? [],
    faqs: (dbAdv.faqs ?? []).map((f: any) => ({ q: f.question, a: f.answer })),
    digitalDetox: dbAdv.digital_detox,
    galleryImages: dbAdv.gallery_images ?? [],
    cancellations: dbAdv.cancellations,
  } : (activityDetails[activityIndex] ?? activityDetails[0]);

  const dates = dbAdv
    ? (dbAdv.activity_dates ?? []).map((d: any) => ({
        id: d.id as string,
        date_range: d.date_range as string,
        status: d.status as string,
        spots: d.spots as number,
        price: d.price as string,
      }))
    : (activityDates[activityIndex] ?? activityDates[0]);

  const spots = dbAdv
    ? (dbAdv.activity_spots ?? []).map((s: any) => ({
        name: s.name,
        desc: s.description,
        image: s.image,
      }))
    : (activitySpots[activityIndex] ?? activitySpots[0]);

  const tabs = [
    { id: 'inclui', label: 'O que inclui' },
    { id: 'itinerario', label: 'Itinerário' },
    { id: 'material', label: 'Lista de material' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'cancelamentos', label: 'Cancelamentos' },
  ];

  const scrollToTabs = () => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!dbAdv) {
    return (
      <div className="fixed inset-0 z-[999] bg-brutal-black flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-neon-yellow animate-spin" />
        <p className="text-white/30 font-body text-xs uppercase tracking-[0.3em]">A carregar</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-black text-white font-body">

      {/* Top nav */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between pointer-events-none"
      >
        <div className="pointer-events-auto flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">
          <button onClick={onBack} className="text-white/50 font-body text-xs uppercase tracking-[0.15em] hover:text-white transition-colors">← Voltar</button>
          <div className="w-px h-3 bg-white/20" />
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored Originals" className="h-7 w-auto" />
        </div>
        <button onClick={scrollToTabs} className="pointer-events-auto bg-neon-yellow text-brutal-black px-5 py-2.5 text-xs font-body font-bold uppercase tracking-[0.1em] rounded-2xl hover:bg-white transition-colors">
          Ver datas →
        </button>
      </motion.div>

      {/* ── HERO — foto centrada + título centrado ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '100vh' }}>
        <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover saturate-[1.1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brutal-black via-brutal-black/20 to-brutal-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <p className="text-white/40 font-body text-[10px] uppercase tracking-[0.35em] mb-5">{data.location}</p>
            <h1 className="text-[clamp(2.8rem,10vw,10rem)] font-body font-extrabold text-white leading-[0.82] tracking-tight mb-10">
              {data.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-3">
              {[['⏱', data.duration], ['💪', data.difficulty], ['👥', `Máx. ${data.maxPeople} pessoas`], ['💶', `A partir de ${data.price}`]].map(([icon, val]) => (
                <div key={val} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2 rounded-full text-white/80 text-xs uppercase tracking-[0.1em]">
                  <span>{icon}</span><span>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── INTRO — texto esquerda + vídeo direita ── */}
      <div className="border-b border-white/6 px-6 md:px-20 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-16 items-center">
          {/* Esquerda — label + título + descrição + botões */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="flex flex-col gap-8">
            <div>
              <p className="text-white/25 font-body text-[10px] uppercase tracking-[0.4em] mb-6">A aventura</p>
              <h2 className="text-[clamp(2rem,4.5vw,5.5rem)] font-body font-extrabold text-white leading-[0.88] tracking-tight mb-8">
                {data.tagline}
              </h2>
              <p className="text-white/50 text-lg leading-[1.85]">{data.description}</p>

              {/* Nível de esforço */}
              {(() => {
                const levels: Record<string, { bars: number; color: string; label: string }> = {
                  'Fácil':         { bars: 1, color: '#4ade80', label: 'Fácil' },
                  'Fácil/Moderado':{ bars: 2, color: '#a3e635', label: 'Fácil / Moderado' },
                  'Moderado':      { bars: 2, color: '#FFE600', label: 'Moderado' },
                  'Difícil':       { bars: 3, color: '#fb923c', label: 'Difícil' },
                  'Muito Difícil': { bars: 4, color: '#f87171', label: 'Muito Difícil' },
                };
                const lvl = levels[data.difficulty] ?? { bars: 2, color: '#FFE600', label: data.difficulty };
                return (
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-white/30 font-body text-[10px] uppercase tracking-[0.3em]">Nível de esforço</span>
                    <div className="flex items-end gap-1.5">
                      {[1,2,3,4].map(n => (
                        <div
                          key={n}
                          style={{
                            width: 10,
                            height: 8 + n * 5,
                            borderRadius: 3,
                            background: n <= lvl.bars ? lvl.color : 'rgba(255,255,255,0.1)',
                            transition: 'background 0.3s',
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-body font-bold text-xs uppercase tracking-[0.12em]" style={{ color: lvl.color }}>{lvl.label}</span>
                  </div>
                );
              })()}
            </div>
            <div className="flex gap-4">
              <button onClick={scrollToTabs} className="bg-white text-brutal-black font-body font-bold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-xl hover:bg-neon-yellow transition-colors duration-300">
                Ver datas
              </button>
              <button onClick={() => { setActiveTab('itinerario'); scrollToTabs(); }} className="border border-white/20 text-white font-body font-semibold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-xl hover:bg-white/8 transition-colors duration-300">
                Ver programa
              </button>
            </div>
          </motion.div>

          {/* Direita — vídeo */}
          {(data as any).heroVideo && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
              className="rounded-3xl overflow-hidden w-full"
              style={{ aspectRatio: '16/9' }}
            >
              <video
                autoPlay loop muted playsInline
                className="w-full h-full object-cover"
                src={(data as any).heroVideo}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── DATAS / EDIÇÕES ── */}
      <div ref={tabsRef} className="px-4 md:px-20 py-16 md:py-28 border-b border-white/6">
        <div className="mb-14 text-center">
          <p className="text-white/25 font-body text-[10px] uppercase tracking-[0.4em] mb-4">Disponibilidade</p>
          <h3 className="text-4xl md:text-7xl font-body font-extrabold text-white leading-none tracking-tight">Escolhe a tua edição</h3>
        </div>
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {bookingDate && <BookingModal date={bookingDate} activityTitle={data.title} activityImage={data.heroImage} activityLocation={data.location} onClose={() => setBookingDate(null)} onHome={onBack} />}
          {waitlistDate && <WaitlistModal date={waitlistDate} adventureId={dbAdv?.id ?? null} activityTitle={data.title} activityImage={data.heroImage} activityLocation={data.location} onClose={() => setWaitlistDate(null)} onHome={onBack} />}
          {dates.map((d: any, i: number) => {
            const isAvailable = d.status === 'disponivel';
            const isFilling = d.status === 'apreencher';
            const isSoldOut = d.status === 'esgotado';
            const spotsNum = d.spots ?? 0;
            const spotsLabel = isFilling
              ? `Últimos ${spotsNum} lugares`
              : `${spotsNum} lugares disponíveis`;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative overflow-hidden rounded-2xl border transition-colors ${
                  isSoldOut ? 'border-white/5 bg-white/2 opacity-50' : 'border-white/8 bg-white/[0.03] hover:border-white/18 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-stretch">
                  {/* Left content */}
                  <div className="flex-1 px-6 md:px-8 py-6 md:py-7">
                    {/* Date */}
                    <p className="text-white/40 font-body text-xs uppercase tracking-[0.25em] mb-1.5">Data</p>
                    <p className="text-white font-body font-bold text-lg md:text-xl leading-tight mb-5">{d.date_range ?? d.range}</p>
                    {/* Price row */}
                    <div className="flex items-baseline gap-3">
                      <span className="text-white font-body font-extrabold text-4xl leading-none tracking-tight">{d.price}</span>
                      <span className="text-white/30 font-body text-sm">por pessoa</span>
                    </div>
                  </div>

                  {/* Right: spots + CTA */}
                  <div className="flex flex-col items-end justify-between px-6 md:px-8 py-6 md:py-7 border-l border-white/6 min-w-fit">
                    {/* Spots pill */}
                    {!isSoldOut ? (
                      <span className={`inline-flex items-center gap-1.5 font-body text-[11px] font-semibold px-3 py-1.5 rounded-full ${
                        isFilling
                          ? 'bg-amber-400/10 text-amber-400'
                          : 'bg-white/6 text-white/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isFilling ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        {spotsLabel}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-body text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white/4 text-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                        Esgotado
                      </span>
                    )}
                    {/* CTA */}
                    {!isSoldOut ? (
                      <button
                        onClick={() => {
                          const dateObj = { id: d.id, date_range: d.date_range ?? d.range, status: d.status, spots: d.spots, price: d.price };
                          if (isAvailable) setBookingDate(dateObj);
                          else setWaitlistDate(dateObj);
                        }}
                        className={`mt-4 font-body font-bold text-[11px] uppercase tracking-[0.15em] px-5 py-3 rounded-xl transition-colors duration-300 whitespace-nowrap ${
                          isAvailable
                            ? 'bg-neon-yellow text-brutal-black hover:bg-white'
                            : 'bg-white text-brutal-black hover:bg-neon-yellow'
                        }`}>
                        {isAvailable ? 'Reservar lugar' : 'Entrar na lista'}
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="text-white/20 text-xs text-center mt-8 font-body">Reserva com apenas 50€ de depósito · Pagamento total até 30 dias antes da saída</p>
      </div>

      {/* ── CURIOSIDADES ── */}
      <div className="mt-4">
      {(() => {
        const curiosities: { title: string; text: string; image: string }[] = dbAdv?.curiosities?.length
          ? dbAdv.curiosities
          : [
              { title: 'É literalmente uma montanha-ilha.', text: 'O Pico é o ponto mais alto de Portugal — 2351m. Mas mais curioso que isso: a ilha é basicamente a montanha. Estás literalmente a viver nas encostas de um vulcão activo. A última erupção foi em 1720 e os geólogos consideram-no dormente, não extinto.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico1.jpg' },
              { title: 'Vês ilhas do cume — e sentes o vulcão respirar.', text: 'Do cume, em dias limpos, vês o Faial, São Jorge, Graciosa e às vezes a Terceira. Na subida atravessas zonas climáticas diferentes — podes começar com 25°C e apanhar neve no topo no mesmo dia. A "Piquinho" ainda liberta fumarolas quentes: metes a mão nas rochas e estão mornas.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico2.jpeg' },
              { title: 'A vinha que chegou às cortes dos czares.', text: 'A vinha do Pico é Património Mundial da UNESCO — currais de pedra de lava negra construídos à mão durante séculos para proteger as videiras do vento atlântico. Visto de cima parece uma manta de retalhos geométrica impossível. O Verdelho daqui chegou a ser servido nas cortes russas no século XIX.', image: 'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/pico3.jpg' },
            ];
        const ci = curiosityIndex % curiosities.length;
        const cur = curiosities[ci];
        return (
          <section className="bg-neon-yellow overflow-hidden px-8 md:px-12 py-20">
            {/* grid: texto | foto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start" style={{ minHeight: 620 }}>

              {/* Coluna esquerda — título + texto + nav */}
              <motion.div
                className="flex flex-col justify-between h-full"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div>
                  <p className="text-brutal-black/40 font-body text-[9px] uppercase tracking-[0.45em] mb-5">
                    Sabia que… · {ci + 1}/{curiosities.length}
                  </p>
                  <motion.h3
                    key={`t-${ci}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-body font-extrabold text-brutal-black leading-[0.9] tracking-tight mb-6"
                    style={{ fontSize: 'clamp(2rem, 3.8vw, 4rem)' }}
                  >
                    {cur.title}
                  </motion.h3>
                  <motion.p
                    key={`p-${ci}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.08 }}
                    className="text-brutal-black/65 font-body text-xl md:text-2xl leading-[1.7] max-w-xl"
                  >
                    {cur.text}
                  </motion.p>
                </div>

                {/* Navegação */}
                <div className="flex items-center gap-3 mt-12">
                  <button
                    onClick={() => setCuriosityIndex(c => (c - 1 + curiosities.length) % curiosities.length)}
                    className="w-12 h-12 rounded-full bg-brutal-black/10 hover:bg-brutal-black/20 flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    onClick={() => setCuriosityIndex(c => (c + 1) % curiosities.length)}
                    className="w-12 h-12 rounded-full bg-brutal-black/10 hover:bg-brutal-black/20 flex items-center justify-center transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="flex gap-2 ml-3">
                    {curiosities.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCuriosityIndex(idx)}
                        className={`rounded-full transition-all duration-300 ${idx === ci ? 'w-6 h-2.5 bg-brutal-black' : 'w-2.5 h-2.5 bg-brutal-black/25 hover:bg-brutal-black/40'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Coluna direita — foto tall */}
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden w-full"
                style={{ height: 620 }}
              >
                <img
                  src={cur.image}
                  alt={cur.title}
                  className="w-full h-full object-cover saturate-[1.1]"
                />
              </motion.div>

            </div>
          </section>
        );
      })()}
      </div>

      {/* ── REVIEW — foto esquerda + quote direita ── */}
      <div className="border-b border-white/6 mt-24">
        <div className="flex flex-col md:flex-row" style={{ minHeight: 760 }}>
          {/* Foto */}
          <div className="md:w-[62%] relative p-6" style={{ minHeight: 500 }}>
            <img src={data.review.image} alt="" className="w-full h-full object-cover saturate-[1.1] rounded-3xl" style={{ position: 'absolute', inset: '1.5rem' }} />
          </div>
          {/* Quote */}
          <div className="md:w-[38%] bg-brutal-black flex flex-col items-center justify-center px-10 md:px-14 py-16 text-center">
            <div className="text-neon-yellow font-body font-extrabold leading-none mb-8" style={{ fontSize: '5rem' }}>&rdquo;</div>
            <p className="text-white font-body font-medium leading-relaxed mb-10 italic" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.35rem)', maxWidth: 420 }}>{data.review.text}</p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => <span key={i} className="text-neon-yellow text-lg">★</span>)}
              </div>
              <p className="text-white font-body font-bold text-sm">{data.review.author}</p>
              <p className="text-white/35 font-body text-[10px] uppercase tracking-[0.2em]">{data.review.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS WRAPPER ── */}
      <div>
      {/* ── TAB MENU ── */}
      <div style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(32px)', boxShadow: '0 8px 60px rgba(0,0,0,0.8)' }}>
        {/* top accent line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #FFE600 20%, #FFE600 80%, transparent 100%)' }} />
        {/* Right fade hint — only on mobile */}
        <div className="pointer-events-none absolute right-0 top-[2px] bottom-0 w-16 md:hidden z-10" style={{ background: 'linear-gradient(to left, rgba(8,8,8,0.98) 30%, transparent 100%)' }} />
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex md:justify-center whitespace-nowrap min-w-max md:min-w-0 mx-auto" style={{ padding: '0 16px' }}>
            {tabs.map(tab => {
              const icons: Record<string, string> = {
                inclui: '✦',
                itinerario: '◈',
                material: '⊞',
                faqs: '?',
                cancelamentos: '↩',
              };
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center gap-1.5 transition-all duration-300"
                  style={{
                    padding: 'clamp(14px, 3vw, 22px) clamp(16px, 4vw, 36px) 18px',
                    color: isActive ? '#FFE600' : 'rgba(255,255,255,0.35)',
                    borderBottom: isActive ? '2px solid #FFE600' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, opacity: isActive ? 1 : 0.6, transition: 'all 0.3s' }}>
                    {icons[tab.id] ?? '·'}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                    color: isActive ? '#FFE600' : 'rgba(255,255,255,0.4)',
                  }}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 32,
                      height: 2,
                      background: '#FFE600',
                      borderRadius: 2,
                      boxShadow: '0 0 12px rgba(255,230,0,0.8)',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* bottom separator */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="px-10 md:px-20 py-20 min-h-[55vh] flex flex-col items-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-5xl"
        >

          {activeTab === 'inclui' && (
            <div className="w-full">
              <h2 className="text-2xl font-extrabold text-white mb-10 text-center">O que está incluído</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {data.includes.map((inc, i) => (
                  <div key={i} className="group flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div className="w-8 h-px" style={{ background: '#b8860b' }} />
                    <div>
                      <p className="font-body font-bold text-base mb-2 tracking-wide" style={{ color: '#1a1a1a' }}>{inc.label}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>{inc.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white/4 border border-white/8 rounded-2xl p-8 max-w-2xl mx-auto">
                <p className="text-white/30 text-[9px] uppercase tracking-[0.35em] mb-5">Não incluído</p>
                <ul className="space-y-3">
                  {data.notIncludes.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-white/45 text-base">
                      <span className="w-4 h-px bg-white/20 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'itinerario' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-extrabold text-white mb-8 text-center">Itinerário</h2>
              <div className="space-y-3">
                {data.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-6 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <div className="flex-shrink-0 w-14 text-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1" style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.12)' }}>
                        <span className="font-bold text-xs" style={{ color: '#1a1a1a' }}>{i + 1}</span>
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.1em]" style={{ color: 'rgba(0,0,0,0.3)' }}>{day.day}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-2" style={{ color: '#1a1a1a' }}>{day.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>{day.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'material' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-extrabold text-white mb-8 text-center">Lista de Material</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.packingList.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-6 py-4 text-sm" style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.15)', color: '#1a1a1a', fontSize: 14 }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#b8860b' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-extrabold text-white mb-8 text-center">Perguntas Frequentes</h2>
              <div className="space-y-3">
                {data.faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cancelamentos' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-extrabold text-white mb-8 text-center">Cancelamentos</h2>
              <div className="rounded-3xl p-10" style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="leading-[1.9]" style={{ color: 'rgba(0,0,0,0.55)', fontSize: 15 }}>{data.cancellations}</p>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      </div>{/* ── fim TABS WRAPPER ── */}

      {/* ── ÁLBUM DE FOTOS ── */}
      <div className="px-10 md:px-20 py-20 border-t border-white/6">
        <div className="mb-10 text-center">
          <p className="text-white/25 font-body text-[9px] uppercase tracking-[0.45em] mb-3">Galeria</p>
          <h3 className="text-3xl md:text-4xl font-body font-extrabold text-white">Momentos reais</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(() => {
            const galleryImages: { src: string; tall: boolean }[] = (data as any).galleryImages?.length
              ? (data as any).galleryImages.map((src: string, i: number) => ({ src, tall: i === 0 || i === 3 }))
              : [
                  { src: data.heroImage, tall: true },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/picoHQ2.jpeg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico2.jpg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico3.jpeg`, tall: true },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico4.jpg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico5.jpeg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico6.jpeg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico7.jpg`, tall: false },
                  { src: `https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/reviewpico8.jpeg`, tall: false },
                ];
            return galleryImages.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl ${photo.tall ? 'row-span-2' : ''}`}
              style={{ aspectRatio: photo.tall ? undefined : '4/3', minHeight: photo.tall ? 420 : undefined }}
            >
              <img src={photo.src} alt="" className="w-full h-full object-cover saturate-[1.1] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </motion.div>
          ));
          })()}
        </div>
      </div>

      {/* ── OUTRAS ATIVIDADES ── */}
      <div className="px-10 md:px-20 py-20 border-t border-white/6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-white/25 font-body text-[9px] uppercase tracking-[0.45em] mb-3">Explora mais</p>
            <h3 className="text-3xl md:text-4xl font-body font-extrabold text-white">Outras aventuras</h3>
          </div>
          <button onClick={onBack} className="text-white/40 font-body text-xs uppercase tracking-[0.2em] hover:text-white transition-colors hidden md:block">
            Ver todas →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {originals.filter(o => o.title !== data.title).slice(0, 4).map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              <img src={o.image} alt={o.title} className="w-full h-full object-cover saturate-[1.1] group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/30" />
              <div className="absolute top-5 right-5">
                <span className="text-white/20 font-body font-extrabold text-xs tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              </div>
              {o.comingSoon && (
                <div className="absolute top-5 left-5">
                  <span className="bg-white/8 backdrop-blur-md border border-white/12 text-white/55 font-body text-[7px] uppercase tracking-[0.3em] px-2.5 py-1 rounded-full">Em breve</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="w-5 h-px bg-neon-yellow/60 mb-3 group-hover:w-10 transition-all duration-300" />
                <p className="text-white font-body font-extrabold text-base leading-tight tracking-tight mb-2">{o.title}</p>
                <p className="text-white/40 font-body text-[11px] leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{o.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}


function FaqItem({ q, a, ..._ }: { q: string; a: string; [k: string]: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(255,255,255,0.15)' }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-6 py-5 text-left">
        <span className="font-semibold text-base pr-4" style={{ color: '#1a1a1a' }}>{q}</span>
        <span className={`text-xl flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} style={{ color: 'rgba(0,0,0,0.35)' }}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm leading-relaxed pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', color: 'rgba(0,0,0,0.55)', fontSize: 14, lineHeight: 1.8 }}>
          {a}
        </div>
      )}
    </div>
  );
}


// ─── Payment Success Page ─────────────────────────────────────────────────────
function PaymentSuccessPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="min-h-screen bg-brutal-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl mb-6"
        >
          🤙
        </motion.div>
        <div className="bg-neon-yellow/10 border border-neon-yellow/25 rounded-xl px-4 py-2 inline-block mb-6">
          <span className="text-neon-yellow text-[10px] font-bold uppercase tracking-[0.25em]">Reserva confirmada</span>
        </div>
        <h1 className="text-white font-bold text-3xl leading-snug mb-3">
          Estás dentro<span className="text-neon-yellow">.</span>
        </h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          O sinal foi recebido com sucesso. Vais receber um email de confirmação em breve com todos os detalhes da tua reserva.
        </p>
        <div className="bg-white/5 border border-white/8 rounded-2xl px-5 py-4 mb-8 text-left space-y-2">
          <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mb-3">Próximos passos</p>
          {[
            ['📧', 'Confirmação por email com os detalhes'],
            ['📍', 'Ponto de encontro em Belmonte'],
            ['🛵', 'Entrega da vespa + briefing da rota'],
            ['💰', 'Restante 50% pago à chegada'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{icon}</span>
              <p className="text-white/55 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onHome}
          className="w-full bg-neon-yellow text-black py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.12em] hover:bg-white transition-colors"
        >
          Voltar ao início
        </button>
        <p className="text-white/20 text-[10px] uppercase tracking-widest mt-4">Qualquer dúvida: hello@boredoriginals.com</p>
      </motion.div>
    </div>
  );
}

function ApoioPage({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('./lib/supabase').then(({ getSiteFaqs }) => {
      getSiteFaqs().then(data => {
        if (data && data.length > 0) {
          setSections(data.map(cat => ({
            id: cat.key,
            icon: cat.icon,
            title: cat.title,
            color: cat.key === 'reservas' ? 'from-neon-yellow/10 to-transparent' : 'from-white/5 to-transparent',
            border: cat.key === 'reservas' ? 'border-neon-yellow/20' : 'border-white/10',
            items: cat.items.map(i => ({ q: i.question, a: i.answer })),
          })));
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    });
  }, []);

  const allItems = sections.flatMap((s: any) => s.items.map((item: any) => ({ ...item, section: s.title })));
  const filtered = search.trim()
    ? allItems.filter(i => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-brutal-black selection:bg-neon-yellow selection:text-brutal-black">

      {/* Nav */}
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="fixed top-6 left-6 z-40"
      >
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">
          <button onClick={onBack} className="text-white/50 font-body text-xs uppercase tracking-[0.15em] hover:text-white transition-colors">← Voltar</button>
          <div className="w-px h-3 bg-white/20" />
          <img src="https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png" alt="Bored" className="h-7 w-auto" />
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="pt-40 pb-16 px-8 md:px-20 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-neon-yellow font-body text-[10px] uppercase tracking-[0.4em] mb-6"
        >Apoio</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[clamp(3rem,8vw,7rem)] font-body font-extrabold text-white leading-[0.88] tracking-tight mb-8"
        >
          Nenhuma dúvida<br /><span className="text-neon-yellow">fica por responder.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="text-white/40 font-body text-lg max-w-xl"
        >
          Tudo o que precisas de saber sobre reservas, aventuras, preparação e muito mais.
        </motion.p>
      </div>

      {/* Search */}
      <div className="px-8 md:px-20 max-w-6xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="relative"
        >
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Pesquisa a tua dúvida..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 text-white placeholder-white/25 font-body text-sm pl-12 pr-5 py-4 rounded-2xl focus:outline-none focus:border-neon-yellow/50 transition-colors"
          />
        </motion.div>

        {/* Search results */}
        {search.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden"
          >
            {filtered.length === 0 ? (
              <p className="text-white/30 font-body text-sm px-6 py-5">Nenhum resultado para "{search}"</p>
            ) : filtered.map((item, i) => (
              <div key={i} className="px-6 py-5 border-b border-white/[0.06] last:border-0">
                <p className="text-[9px] font-body uppercase tracking-[0.3em] text-neon-yellow/70 mb-1">{item.section}</p>
                <p className="text-white font-body text-sm font-semibold mb-2">{item.q}</p>
                <p className="text-white/50 font-body text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Quick contact cards */}
      <div className="px-8 md:px-20 max-w-6xl mx-auto mb-20">
        <p className="text-white/25 font-body text-[10px] uppercase tracking-[0.4em] mb-6">Contacto direto</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '✉️', label: 'Email', value: 'bookings@boredtourist.com', sub: 'Resposta em menos de 24h', href: 'mailto:bookings@boredtourist.com' },
            { icon: '💬', label: 'Instagram', value: '@bored_tourist', sub: 'DM para dúvidas rápidas', href: 'https://instagram.com/bored_tourist' },
            { icon: '📞', label: 'WhatsApp', value: '+351 967 407 859', sub: 'Dias úteis, 9h–19h', href: 'https://wa.me/351967407859' },
          ].map((c, i) => (
            <motion.a
              key={i}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-neon-yellow/30 px-6 py-5 rounded-2xl transition-all duration-200 group"
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-[9px] font-body uppercase tracking-[0.3em] text-white/30 mb-0.5">{c.label}</p>
                <p className="text-white font-body text-sm font-semibold group-hover:text-neon-yellow transition-colors">{c.value}</p>
                <p className="text-white/35 font-body text-xs">{c.sub}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Main content: sidebar + accordion */}
      <div className="px-8 md:px-20 max-w-6xl mx-auto pb-32 flex flex-col md:flex-row gap-10">

        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <p className="text-white/25 font-body text-[10px] uppercase tracking-[0.4em] mb-5">Categorias</p>
          <nav className="flex flex-col gap-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-left transition-all duration-200 ${
                  activeSection === s.id
                    ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Accordion sections */}
        <div className="flex-1 flex flex-col gap-8">
          {sections
            .filter(s => !activeSection || s.id === activeSection)
            .map((s, si) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: si * 0.06 }}
              >
                <div className={`flex items-center gap-3 mb-4 pb-4 border-b ${s.border}`}>
                  <span className="text-xl">{s.icon}</span>
                  <h2 className="text-white font-body font-bold text-lg">{s.title}</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {s.items.map((item, ii) => (
                    <FaqItem key={ii} q={item.q} a={item.a} />
                  ))}
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/[0.06] px-8 md:px-20 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-none">
        <div>
          <p className="text-white/20 font-body text-[10px] uppercase tracking-[0.5em] mb-1">Ainda tens dúvidas?</p>
          <p className="text-white font-body font-bold text-lg">Fala diretamente connosco.</p>
        </div>
        <a
          href="mailto:bookings@boredtourist.com"
          className="bg-neon-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-xl hover:bg-white transition-colors"
        >
          bookings@boredtourist.com
        </a>
      </div>
    </div>
  );
}

function ActivityRoute({ adventures }: { adventures: any[] }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoBook = searchParams.get('book') === '1';

  const activityIndex = useMemo(() => {
    if (!slug) return 0;
    if (adventures.length === 0) return 0;
    const found = adventures.find((a: any) => slugify(a.title) === slug);
    return found ? (found.index ?? 0) : parseInt(slug) || 0;
  }, [slug, adventures]);

  if (adventures.length === 0) {
    return (
      <div className="fixed inset-0 z-[999] bg-brutal-black flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-neon-yellow animate-spin" />
        <p className="text-white/30 font-body text-xs uppercase tracking-[0.3em]">A carregar</p>
      </div>
    );
  }

  return <ActivityPage activityIndex={activityIndex} autoBook={autoBook} onBack={() => navigate(-1 as any)} />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [dbAdventures, setDbAdventures] = useState<any[]>([]);
  const [quickBooking, setQuickBooking] = useState<{ date: { id: string; date_range: string; status: string; spots: number; price: string }; title: string; image?: string; location?: string } | null>(null);

  useEffect(() => {
    getAdventures().then(setDbAdventures).catch(console.error);
    // Handle legacy ?payment=success query
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') navigate('/pagamento-confirmado');
  }, []);

  const goToActivity = useCallback((index: number) => {
    const adv = dbAdventures.find((a: any) => (a.index ?? 0) === index);
    const slug = adv ? slugify(adv.title) : String(index);
    navigate(`/actividade/${slug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [dbAdventures, navigate]);

  const goToBooking = useCallback((index: number) => {
    const adv = dbAdventures.find((a: any) => (a.index ?? 0) === index);
    if (!adv) {
      // Data not yet loaded — navigate as fallback
      navigate(`/actividade/${index}?book=1`);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // Use first available date, or first date of any status, or synthesise one from the activity price
    const firstDate = (adv.activity_dates ?? []).find((d: any) => d.status !== 'esgotado') ?? adv.activity_dates?.[0];
    const syntheticDate = firstDate ?? {
      id: adv.id,
      date_range: 'A definir',
      status: 'disponivel',
      spots: adv.max_people ?? 10,
      price: adv.price ?? '0€',
    };
    setQuickBooking({
      date: { id: syntheticDate.id, date_range: syntheticDate.date_range, status: syntheticDate.status, spots: syntheticDate.spots, price: syntheticDate.price },
      title: adv.title,
      image: adv.hero_image,
      location: adv.location,
    });
  }, [dbAdventures, navigate]);

  const nav = {
    toHome:           () => { navigate('/');               window.scrollTo({ top: 0, behavior: 'instant' }); },
    toAllExperiences: () => { navigate('/experiencias');   window.scrollTo({ top: 0, behavior: 'instant' }); },
    toHistoria:       () => { navigate('/sobre-nos');      window.scrollTo({ top: 0, behavior: 'instant' }); },
    toApoio:          () => { navigate('/apoio');          window.scrollTo({ top: 0, behavior: 'instant' }); },
    toConquista:      () => { navigate('/conquista');      window.scrollTo({ top: 0, behavior: 'instant' }); },
    back:             () => navigate(-1 as any),
  };

  const sharedNavbar = (
    <Navbar
      onConquista={nav.toConquista}
      onHistoria={nav.toHistoria}
      onHome={nav.toHome}
      onApoio={nav.toApoio}
      onAllExperiences={nav.toAllExperiences}
    />
  );

  return (
    <>
      {quickBooking && (
        <BookingModal
          date={quickBooking.date}
          activityTitle={quickBooking.title}
          activityImage={quickBooking.image}
          activityLocation={quickBooking.location}
          onClose={() => setQuickBooking(null)}
          onHome={() => { setQuickBooking(null); nav.toHome(); }}
        />
      )}
      <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-brutal-black selection:bg-neon-yellow selection:text-brutal-black">
          {sharedNavbar}
          <Hero />
          <BoredOriginals onConquista={nav.toConquista} onActivity={goToActivity} onBooking={goToBooking} onAllExperiences={nav.toAllExperiences} adventures={dbAdventures} />
          <ProximasSaidas onConquista={nav.toConquista} onActivity={goToActivity} onBooking={goToBooking} dbAdventures={dbAdventures} />
          <OQueNosDiferencia onHistoria={nav.toHistoria} />
          <NewsletterSimple />
          <Footer />
        </div>
      } />
      <Route path="/experiencias" element={<AllExperiencesPage onBack={nav.back} onActivity={goToActivity} onBooking={goToBooking} adventures={dbAdventures} />} />
      <Route path="/sobre-nos" element={<NossaHistoriaPage onBack={nav.back} />} />
      <Route path="/apoio" element={<ApoioPage onBack={nav.back} />} />
      <Route path="/conquista" element={<ConquistaPage onBack={nav.back} />} />
      <Route path="/actividade/:slug" element={<ActivityRoute adventures={dbAdventures} />} />
      <Route path="/pagamento-confirmado" element={<PaymentSuccessPage onHome={nav.toHome} />} />
      <Route path="*" element={
        <div className="min-h-screen bg-brutal-black flex flex-col items-center justify-center gap-4">
          <p className="text-white/30 font-body text-xs uppercase tracking-[0.3em]">404 — Página não encontrada</p>
          <button onClick={nav.toHome} className="bg-neon-yellow text-brutal-black font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl">Voltar ao início</button>
        </div>
      } />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
