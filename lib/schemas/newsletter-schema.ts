import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.email("Invalid email address"),
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
  captchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
});

export type NewsletterSubscribeData = z.infer<typeof newsletterSubscribeSchema>;

export const newsletterUnsubscribeSchema = z.object({
  code: z.string().min(1, "Unsubscribe code is required"),
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
});

export type NewsletterUnsubscribeData = z.infer<typeof newsletterUnsubscribeSchema>;

export const newsletterVerifyQuerySchema = z.object({
  code: z.string().min(1, "Verification code is required"),
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
});

export type NewsletterVerifyQuery = z.infer<typeof newsletterVerifyQuerySchema>;

export const newsletterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type NewsletterResponse = z.infer<typeof newsletterResponseSchema>;
