import { z } from "zod";

export const basketItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  priceId: z.string().min(1, "Price ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  name: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
  weight_g: z.number().positive("Weight must be positive").optional(),
});

export type BasketItem = z.infer<typeof basketItemSchema>;

export const checkoutRequestSchema = z.object({
  items: z.array(basketItemSchema).min(1, "At least one item is required").max(100, "Too many items"),
  locale: z.enum(["en", "fr", "de", "nl"]).default("en"),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

export const checkoutResponseSchema = z.object({
  clientSecret: z.string().nullable(),
});

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;

export const sessionStatusQuerySchema = z.object({
  session_id: z.string(),
});

export type SessionStatusQuery = z.infer<typeof sessionStatusQuerySchema>;

export const sessionStatusResponseSchema = z.object({
  status: z.string().nullable(),
  customer_email: z.string().optional().nullable(),
  payment_status: z.string(),
});

export type SessionStatusResponse = z.infer<typeof sessionStatusResponseSchema>;
