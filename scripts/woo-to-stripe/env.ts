import { config } from "dotenv";
import process from "node:process";
import { z } from "zod";

config({ path: ".env.prod" });

export const env = z
  .object({
    WOOCOMMERCE_PUBLIC_KEY: z.string(),
    WOOCOMMERCE_SECRET_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_VAT_TAX_RATE_ID: z.string(),
  })
  .parse(process.env);
