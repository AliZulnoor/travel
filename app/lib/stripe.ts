import 'dotenv/config';
import Stripe from 'stripe';

// ✅ Required environment variables
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.BASE_URL;

if (!stripeSecret) {
  console.error("❌ STRIPE_SECRET_KEY is undefined. Make sure it's set in Railway.");
  process.exit(1);
}

if (!baseUrl) {
  console.error("❌ BASE_URL is undefined. Add your Railway URL in Railway's Environment tab.");
  process.exit(1);
}

// ✅ Initialize Stripe client
export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-03-31.basil',
});

// ✅ Create product, price, and payment link
export const createProduct = async (
  name: string,
  description: string,
  images: string[],
  price: number,
  tripId: string
) => {
  try {
    const product = await stripe.products.create({ name, description, images });

    const priceObject = await stripe.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: 'usd',
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: priceObject.id, quantity: 1 }],
      metadata: { tripId },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${baseUrl}/travel/${tripId}/success`,
        },
      },
    });

    return paymentLink;
  } catch (error) {
    console.error("❌ Failed to create Stripe product/payment link:", error);
    throw error;
  }
};
