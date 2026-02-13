import { z } from "zod";

export const billingPortalRequestSchema = z.object({
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
});

export type BillingPortalRequest = z.infer<typeof billingPortalRequestSchema>;

export const billingPortalResponseSchema = z.object({
  url: z.url(),
});

export type BillingPortalResponse = z.infer<typeof billingPortalResponseSchema>;
