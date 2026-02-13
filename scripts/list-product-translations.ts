import Stripe from "stripe";
import dotenv from "dotenv";
import { z } from "zod";
import { writeFileSync } from "node:fs";

const $env = z.object({
  STRIPE_SECRET_KEY: z.string(),
});

dotenv.config({ path: ".env.test", override: true });
const srcEnv = $env.parse(process.env);
const stripe = new Stripe(srcEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

(async () => {
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  });

  // put title an description by product id in a JSON file
  const productData: Record<string, { title: string; description: string }> = {};
  for (const product of products.data) {
    productData[product.id] = {
      title: product.name,
      description: product.description || "",
    };
  }

  writeFileSync("tmp.json", JSON.stringify(productData, null, 2));
})();
