import { z } from "zod";
import { $locale } from "@/lib/locale";

export const invoiceStatusSchema = z.enum(["draft", "open", "paid", "void", "uncollectible"]);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const orderSchema = z.object({
  id: z.string(),
  number: z.string(),
  locale: $locale,
  stripeInvoiceId: z.string(),
  sendcloudOrderId: z.string().nullable(),
  customerEmail: z.string(),
  customerName: z.string().nullable(),
  customerRole: z.string().nullable(),
  totalAmount: z.number(),
  currency: z.string(),
  shippingStatus: z.string(),
  invoiceStatus: invoiceStatusSchema,
  trackingNumber: z.string().nullable(),
  trackingUrl: z.string().nullable(),
  carrierName: z.string().nullable(),
  discountsCount: z.number(),
  creditNotesAmount: z.number(),
  hasCreditNotes: z.boolean(),
  creditNoteUrls: z.array(z.string()),
  invoiceUrl: z.string().nullable(),
  paidAt: z.string().nullable(),
  orderedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const ordersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

export type OrdersResponse = z.infer<typeof ordersResponseSchema>;
