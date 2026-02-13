import { z } from "zod";
import { validateEnv } from "@/lib/env/validate-env";
import { $locale } from "@/lib/locale";

export const privateEnv = validateEnv(
  z.object({
    SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
    SMTP_PORT: z.coerce.number(),
    SMTP_FROM: z.email(),
    SMTP_USER: z.email("SMTP_USER must be a valid email address").optional().or(z.literal("")),
    SMTP_PASSWORD: z.string().optional(),

    ADMIN_EMAIL: z.email("ADMIN_EMAIL must be a valid email address"),
    BILLIT_EMAIL: z.email("BILLIT_EMAIL must be a valid email address").optional(),
    EMAIL_SIGNATURE: z.string().transform((str) => Buffer.from(str, "base64").toString()),

    ADMIN_EMAIL_LOCALE: $locale,

    DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string().min(32),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    SENDCLOUD_PUBLIC_KEY: z.string().min(1, "SENDCLOUD_PUBLIC_KEY is required"),
    SENDCLOUD_SECRET_KEY: z.string().min(1, "SENDCLOUD_SECRET_KEY is required"),
    SENDCLOUD_WEBHOOK_TOKEN: z.string(),
    SENDCLOUD_INTEGRATION_ID: z
      .string()
      .regex(/^\d+$/, "SENDCLOUD_INTEGRATION_ID must be a number")
      .transform((val) => parseInt(val, 10)),
    SENDCLOUD_FROM_COUNTRY: z
      .string()
      .length(2, "SENDCLOUD_FROM_COUNTRY must be a 2-letter ISO country code")
      .toUpperCase(),
    SENDCLOUD_FROM_POSTAL: z.string().min(1, "SENDCLOUD_FROM_POSTAL is required"),

    GOOGLE_RECAPTCHA_SECRET_KEY: z.string().min(1, "GOOGLE_RECAPTCHA_SECRET_KEY is required"),
  }),
  process.env,
);
