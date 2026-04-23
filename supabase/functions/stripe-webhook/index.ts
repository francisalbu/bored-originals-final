// @ts-nocheck
import Stripe from 'npm:stripe@14';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ── Checkout Session (redirect flow, legacy) ──────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    let holders: any[] = [];
    try { holders = JSON.parse(meta.holders || '[]'); } catch { holders = []; }
    const primaryHolder = holders[0] ?? {};

    const { error } = await supabase.from('bookings').insert({
      customer_name: primaryHolder.name || 'Desconhecido',
      customer_email: primaryHolder.email || session.customer_email || '',
      customer_phone: primaryHolder.phone || '',
      num_people: parseInt(meta.people || '1'),
      total_price: parseFloat(meta.totalAmount || '0'),
      deposit_paid: true,
      payment_status: 'deposit_paid',
      payment_method: 'stripe',
      status: 'confirmed',
      stripe_session_id: session.id,
      internal_notes: JSON.stringify({
        activityTitle: meta.activityTitle,
        dateRange: meta.dateRange,
        vespas: parseInt(meta.vespas || '1'),
        holders,
        depositAmount: parseFloat(meta.depositAmount || '0'),
      }),
    });

    if (error) { console.error('Supabase insert error:', error); return new Response('Database error', { status: 500 }); }
    console.log(`✅ Booking saved for checkout session ${session.id}`);
  }

  // ── Payment Intent (embedded flow) ────────────────────────────────────────
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const meta = intent.metadata ?? {};

    // Evitar duplicados: verificar se já existe booking para este payment intent
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('stripe_session_id', intent.id)
      .maybeSingle();

    if (existing) {
      console.log(`ℹ️ Booking already exists for intent ${intent.id}`);
      return new Response('ok', { status: 200 });
    }

    let holders: any[] = [];
    try { holders = JSON.parse(meta.holders || '[]'); } catch { holders = []; }
    const primaryHolder = holders[0] ?? {};

    const isDeposit = meta.bookingType === 'waitlist_deposit';

    const { error } = await supabase.from('bookings').insert({
      customer_name: primaryHolder.name || 'Desconhecido',
      customer_email: primaryHolder.email || '',
      customer_phone: primaryHolder.phone || '',
      num_people: parseInt(meta.people || '1'),
      total_price: parseFloat(meta.totalAmount || '0'),
      deposit_paid: isDeposit,
      payment_status: isDeposit ? 'deposit_paid' : 'paid',
      payment_method: 'stripe',
      status: 'confirmed',
      stripe_session_id: intent.id,
      internal_notes: JSON.stringify({
        activityTitle: meta.activityTitle,
        dateRange: meta.dateRange,
        vespas: parseInt(meta.vespas || '0'),
        holders,
        depositAmount: parseFloat(meta.depositAmount || '0'),
        bookingType: meta.bookingType || 'full',
      }),
    });

    if (error) { console.error('Supabase insert error:', error); return new Response('Database error', { status: 500 }); }
    console.log(`✅ Booking saved for payment intent ${intent.id}`);

    // Decrement available spots
    const activityDateId = meta.activityDateId;
    const numPeople = parseInt(meta.people || '1');
    if (activityDateId) {
      const { data: dateRow } = await supabase
        .from('activity_dates')
        .select('spots')
        .eq('id', activityDateId)
        .maybeSingle();

      if (dateRow) {
        const newSpots = Math.max(0, (dateRow.spots ?? 0) - numPeople);
        const newStatus = newSpots <= 0 ? 'esgotado' : newSpots <= 4 ? 'apreencher' : 'disponivel';
        await supabase
          .from('activity_dates')
          .update({ spots: newSpots, status: newStatus })
          .eq('id', activityDateId);
        console.log(`📉 Spots for date ${activityDateId}: ${dateRow.spots} → ${newSpots} (${newStatus})`);
      }
    }
  }

  return new Response('ok', { status: 200 });
});
