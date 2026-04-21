// @ts-nocheck
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      activityId,
      activityTitle,
      dateRange,
      people,
      vespas,
      holders,
      totalAmount,
      depositAmount,
    } = await req.json();

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Bored Originals — ${activityTitle ?? 'Experiência'}`,
              description: `${dateRange} · ${people} pessoa${people > 1 ? 's' : ''} · ${vespas} vespa${vespas > 1 ? 's' : ''} · Sinal de 50%`,
              images: [
                'https://prifvutxutzcspiukzek.supabase.co/storage/v1/object/public/Originals/Check%20In%20EdItory.png',
              ],
            },
            unit_amount: Math.round(depositAmount * 100), // centimos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}?payment=cancelled`,
      locale: 'pt',
      metadata: {
        activityId: String(activityId),
        activityTitle: activityTitle ?? '',
        dateRange,
        people: String(people),
        vespas: String(vespas),
        holders: JSON.stringify(holders),
        totalAmount: String(totalAmount),
        depositAmount: String(depositAmount),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('create-checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
