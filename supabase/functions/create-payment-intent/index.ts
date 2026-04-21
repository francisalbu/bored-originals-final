// @ts-nocheck
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);

Deno.serve(async (req) => {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(depositAmount * 100), // cêntimos
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      description: `Bored Originals — ${activityTitle ?? 'Experiência'} · ${dateRange} · ${people} pessoa${people > 1 ? 's' : ''} · Sinal 50%`,
      metadata: {
        activityId: String(activityId),
        activityTitle: activityTitle ?? '',
        dateRange,
        people: String(people),
        vespas: String(vespas ?? 0),
        holders: JSON.stringify(holders),
        totalAmount: String(totalAmount),
        depositAmount: String(depositAmount),
      },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err: any) {
    console.error('create-payment-intent error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
