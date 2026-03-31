import Stripe from 'stripe'

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export const PLAN_LIMITS = {
  free:    { bot_limit: 1,   chat_limit: 100,   page_limit: 20,   white_label: false, api_access: false },
  starter: { bot_limit: 1,   chat_limit: 500,   page_limit: 50,   white_label: false, api_access: false },
  pro:     { bot_limit: 5,   chat_limit: 3000,  page_limit: 300,  white_label: false, api_access: false },
  scale:   { bot_limit: 999, chat_limit: 10000, page_limit: 9999, white_label: true,  api_access: true },
}

export function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_SCALE_PRICE_ID) return 'scale'
  return 'free'
}
