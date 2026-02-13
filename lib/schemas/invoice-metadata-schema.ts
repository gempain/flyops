import { z } from "zod";
import { TranslatableError } from "@/lib/api/translatable-error";
import Stripe from "stripe";

export const $shippingStatusEnum = z.enum(["awaiting_shipment", "shipped", "delivered"]);

const invoiceMetadataSchema = z.object({
  sendcloudOrderId: z.string().optional(),
  shippingStatus: z.union([$shippingStatusEnum, z.string()]).optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  woocommerceOrderId: z.string().optional(),
  source: z.union([z.enum(["stripe_checkout_session", "woocommerce"]), z.string()]).optional(),
  effectiveAt: z.string().optional(),
  visible: z.union([z.literal("0"), z.literal("1")]).optional(),
});

export type InvoiceMetadata = z.infer<typeof invoiceMetadataSchema>;

export function validateInvoiceMetadata(invoice: Stripe.Invoice): InvoiceMetadata {
  const { data, success, error } = invoiceMetadataSchema.safeParse(invoice.metadata);

  if (!success) {
    throw new TranslatableError("errors.invalidMetadata", {
      type: "invoice",
      id: invoice.id,
      validation: error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
    });
  }

  return data;
}
