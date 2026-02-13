import Stripe from "stripe";
import dotenv from "dotenv";
import { z } from "zod";

const $env = z.object({
  STRIPE_SECRET_KEY: z.string(),
});

dotenv.config({ path: ".env.1", override: true });
const srcEnv = $env.parse(process.env);
const sourceStripe = new Stripe(srcEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

dotenv.config({ path: ".env.2", override: true });
const dstEnv = $env.parse(process.env);
const destStripe = new Stripe(dstEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

(async () => {
  const products = await sourceStripe.products.list({
    active: true,
    limit: 100,
  });

  for (const product of products.data) {
    const newProduct = await destStripe.products.create({
      name: product.name,
      description: product.description || undefined,
      metadata: product.metadata,
    });

    const prices = await sourceStripe.prices.list({
      product: product.id,
      limit: 100,
    });

    // create price
    for (const price of prices.data) {
      await destStripe.prices.create({
        product: newProduct.id,
        unit_amount: price.unit_amount || 0,
        currency: price.currency,
        metadata: price.metadata,
      });
    }
  }
})();
