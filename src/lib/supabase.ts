import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// TIPOS
// ============================================================

export type Adventure = {
  id: string;
  slug: string;
  index: number;
  title: string;
  location: string;
  tagline: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  max_people: number;
  coming_soon: boolean;
  hero_image: string;
  hero_video: string | null;
  card_image: string;
  hover_video: string | null;
  highlights: string[];
  includes: { icon: string; label: string; detail: string }[];
  not_includes: string[];
  packing_list: string[];
  digital_detox: string;
  cancellations: string;
  review_text: string;
  review_author: string;
  review_role: string;
  review_image: string;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ItineraryItem = {
  id: string;
  adventure_id: string;
  day_label: string;
  title: string;
  description: string;
  order_index: number;
};

export type Faq = {
  id: string;
  adventure_id: string;
  question: string;
  answer: string;
  order_index: number;
};

export type ActivityDate = {
  id: string;
  adventure_id: string;
  date_range: string;
  status: 'disponivel' | 'apreencher' | 'esgotado';
  spots: number;
  price: string;
  order_index: number;
};

export type ActivitySpot = {
  id: string;
  adventure_id: string;
  name: string;
  description: string;
  image: string;
  order_index: number;
};

export type AdventureWithDetails = Adventure & {
  itinerary: ItineraryItem[];
  faqs: Faq[];
  activity_dates: ActivityDate[];
  activity_spots: ActivitySpot[];
};

// ============================================================
// QUERIES
// ============================================================

/** Busca todas as aventuras (para a lista/cards) incluindo datas */
export async function getAdventures(): Promise<(Adventure & { activity_dates: ActivityDate[] })[]> {
  const { data, error } = await supabase
    .from('adventures')
    .select('*, activity_dates(*)')
    .eq('is_active', true)
    .order('index');

  if (error) throw error;

  // Ordenar datas por order_index
  if (data) {
    data.forEach((a: any) => {
      a.activity_dates?.sort((x: ActivityDate, y: ActivityDate) => x.order_index - y.order_index);
    });
  }

  return data as (Adventure & { activity_dates: ActivityDate[] })[];
}

/** Busca uma aventura pelo index (posição no array original) */
export async function getAdventureByIndex(index: number): Promise<AdventureWithDetails | null> {
  const { data, error } = await supabase
    .from('adventures')
    .select(`
      *,
      itinerary (*),
      faqs (*),
      activity_dates (*),
      activity_spots (*)
    `)
    .eq('index', index)
    .eq('is_active', true)
    .single();

  if (error) return null;

  // Ordenar relações por order_index
  if (data) {
    (data as any).itinerary?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).faqs?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).activity_dates?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).activity_spots?.sort((a: any, b: any) => a.order_index - b.order_index);
  }

  return data as AdventureWithDetails;
}

/** Busca uma aventura pelo slug */
export async function getAdventureBySlug(slug: string): Promise<AdventureWithDetails | null> {
  const { data, error } = await supabase
    .from('adventures')
    .select(`
      *,
      itinerary (*),
      faqs (*),
      activity_dates (*),
      activity_spots (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;

  if (data) {
    (data as any).itinerary?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).faqs?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).activity_dates?.sort((a: any, b: any) => a.order_index - b.order_index);
    (data as any).activity_spots?.sort((a: any, b: any) => a.order_index - b.order_index);
  }

  return data as AdventureWithDetails;
}

/** Submete uma reserva */
export async function createBooking(booking: {
  adventure_id: string;
  activity_date_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_country?: string;
  num_people: number;
  special_requests?: string;
  total_price?: number;
}) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Submete email para lista de notificação */
export async function joinNotifyList(adventure_title: string, email: string) {
  const { error } = await supabase
    .from('notify_list')
    .insert({ adventure_title, email });

  if (error) throw error;
}

// ============================================================
// SITE FAQS (página de Apoio)
// ============================================================

export type SiteFaqCategory = {
  id: string;
  key: string;
  title: string;
  icon: string;
  order_index: number;
  items: { id: string; question: string; answer: string; order_index: number }[];
};

// ============================================================
// WAITLIST
// ============================================================

export async function addToWaitlist(
  activityDateId: string,
  adventureId: string | null,
  email: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('waitlist').insert({
    activity_date_id: activityDateId,
    adventure_id: adventureId ?? null,
    email: email.trim().toLowerCase(),
  });
  if (error) {
    console.error('addToWaitlist error:', error);
    return { error: error.message };
  }
  return { error: null };
}

// ============================================================

export async function getSiteFaqs(): Promise<SiteFaqCategory[]> {
  const { data: cats, error: cErr } = await supabase
    .from('site_faq_categories')
    .select('*')
    .order('order_index');

  if (cErr || !cats) return [];

  const { data: faqs, error: fErr } = await supabase
    .from('site_faqs')
    .select('*')
    .order('order_index');

  if (fErr || !faqs) return [];

  return cats.map((cat: any) => ({
    ...cat,
    items: faqs
      .filter((f: any) => f.category_id === cat.id)
      .sort((a: any, b: any) => a.order_index - b.order_index),
  }));
}
