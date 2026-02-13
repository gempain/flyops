import Stripe from "stripe";
import dotenv from "dotenv";
import { z } from "zod";
import { subHours } from "date-fns/subHours";

const $env = z.object({
  STRIPE_SECRET_KEY: z.string(),
});

dotenv.config({ path: ".env.prod", override: true });
const srcEnv = $env.parse(process.env);
const stripe = new Stripe(srcEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

(async () => {
  await stripe.invoices.create({
    customer: "cus_Tm3YRNJkaN9orx",
    number: "JWUMLCBQ-0001",
    auto_advance: false,
    collection_method: "send_invoice",
    days_until_due: 30,
    effective_at: Math.floor(subHours(new Date(), 8).getTime() / 1000),
  });
})();
