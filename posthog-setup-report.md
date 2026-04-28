<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Bored Originals React + Vite application.

## Summary of changes

### `src/main.tsx`
- Added `@posthog/react` import (`PostHogProvider`, `PostHogErrorBoundary`).
- Switched the `api_host` value from a hardcoded string to `import.meta.env.VITE_POSTHOG_HOST` (with fallback).
- Wrapped the entire app in `<PostHogProvider client={posthog}>` and `<PostHogErrorBoundary>` so React errors are automatically captured and all components can access PostHog via hooks.

### `src/App.tsx`
Five new `posthog.capture()` calls added alongside existing events (no existing code altered):

| # | Event | Location |
|---|-------|----------|
| 1 | `booking_payment_started` | `BookingModal.fetchClientSecret` — fires when Stripe payment intent is obtained and step 4 is shown |
| 2 | `booking_payment_success` | `StripePaymentForm.handleSubmit` — fires when `paymentIntent.status` is `succeeded` / `processing` / `requires_capture` |
| 3 | `booking_payment_failed` | `StripePaymentForm.handleSubmit` — fires on Stripe error, includes `error_code` and `error_message` |
| 4 | `waitlist_email_submitted` | `WaitlistModal.handleEmailSubmit` — fires after email is successfully saved to Supabase waitlist |
| 5 | `waitlist_deposit_started` | `WaitlistModal.handleDepositSubmit` — fires when the 50€ deposit payment intent is created |

### `.env.local`
- `VITE_POSTHOG_KEY` — set to the project token.
- `VITE_POSTHOG_HOST` — set to `https://eu.i.posthog.com`.

### `package.json`
- `@posthog/react` added as a dependency.

## All tracked events

| Event | Description | File |
|-------|-------------|------|
| `booking_open` | User opens the booking modal for an experience | `src/App.tsx` |
| `booking_payment_started` | Stripe payment intent created; payment form shown | `src/App.tsx` |
| `booking_payment_success` | Payment confirmed by Stripe | `src/App.tsx` |
| `booking_payment_failed` | Payment error returned by Stripe | `src/App.tsx` |
| `waitlist_email_submitted` | User joins free email waitlist for a sold-out date | `src/App.tsx` |
| `waitlist_deposit_started` | User initiates 50€ deposit for a waitlist spot | `src/App.tsx` |
| `adventure_open` | User opens an adventure detail page | `src/App.tsx` |
| `interest_modal_open` | Interest modal opened for a teaser experience | `src/App.tsx` |
| `interest_submit` | User submits the interest form | `src/App.tsx` |
| `notify_open` | Notify-me modal opened for a coming-soon experience | `src/App.tsx` |
| `notify_submit` | User submits email for coming-soon notifications | `src/App.tsx` |
| `newsletter_subscribe` | User subscribes to the newsletter | `src/App.tsx` |
| `suggest_activity_submit` | User submits an activity suggestion | `src/App.tsx` |

## Next steps

We've built a dashboard and five insights to monitor user behaviour based on the events just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/168384/dashboard/648995
- **Booking conversion funnel** (booking_open → payment_started → payment_success): https://eu.posthog.com/project/168384/insights/GqloGNGu
- **Payment failures over time**: https://eu.posthog.com/project/168384/insights/HIogN0KY
- **Top adventures by opens**: https://eu.posthog.com/project/168384/insights/d0XgLcMs
- **Waitlist signups over time**: https://eu.posthog.com/project/168384/insights/lxV4elw7
- **Newsletter & notify subscriptions**: https://eu.posthog.com/project/168384/insights/ReTTuYfo

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
