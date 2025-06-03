import 'dotenv/config'; // Load .env at runtime
import Stripe from 'stripe';

// Ensure the secret key is loaded properly
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY is undefined. Make sure it's in your .env file.");
    process.exit(1);
}

if (!process.env.BASE_URL) {
    console.error("❌ BASE_URL is undefined. Make sure it's in your .env file.");
    process.exit(1);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
});

export const createProduct = async (
    name: string,
    description: string,
    images: string[],
    price: number,
    tripId: string
) => {
    const product = await stripe.products.create({
        name,
        description,
        images,
    });

    const priceObject = await stripe.prices.create({
        product: product.id,
        unit_amount: price * 100, // Stripe expects smallest currency unit (e.g. cents)
        currency: 'usd',
    });

    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: priceObject.id, quantity: 1 }],
        metadata: { tripId },
        after_completion: {
            type: 'redirect',
            redirect: {
                url: `${process.env.BASE_URL}/travel/${tripId}/success`,
            },
        },
    });

    return paymentLink;
};
