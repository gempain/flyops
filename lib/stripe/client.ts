import Stripe from "stripe";
import { privateEnv } from "@/lib/env/private-env";

export const stripe = new Stripe(privateEnv.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
});
