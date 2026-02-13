import { z } from "zod";
import { validateEnv } from "@/lib/env/validate-env";

const $bool = z.string().transform((str) => str === "1" || str === "true");

export const publicEnv = validateEnv(
  z.object({
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
    NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: z.string(),
    NEXT_PUBLIC_SHOW_DEV_BANNER: $bool.default(true).optional(),
    NEXT_PUBLIC_ENVIRONMENT: z.string().default("Unnamed Env").optional(),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().optional(),
  }),
  // must reference them here because they are replaced by Next at compile time, and process.env is {}
  {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_SHOW_DEV_BANNER: process.env.NEXT_PUBLIC_SHOW_DEV_BANNER,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
);
