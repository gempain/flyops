import Stripe from "stripe";
import { Order } from "@/lib/schemas/orders-schema";
import { validateInvoiceMetadata } from "@/lib/schemas/invoice-metadata-schema";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { stripe } from "@/lib/stripe/client";

export const INVOICE_EXPAND_FIELDS = ["customer", "shipping_cost.shipping_rate"];

function buildCreditNotesMap(creditNotes: Stripe.CreditNote[]): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const creditNote of creditNotes) {
    if (typeof creditNote.invoice === "string" && creditNote.pdf) {
      const invoiceId = creditNote.invoice;
      const existingUrls = map.get(invoiceId) || [];
      map.set(invoiceId, [...existingUrls, creditNote.pdf]);
    }
  }

  return map;
}

export async function getCreditNotesMapByInvoiceId(
  customerId?: string | null,
  invoiceIds?: string[],
): Promise<Map<string, string[]>> {
  if (!customerId) {
    return new Map();
  }

  const creditNotes = await stripe.creditNotes.list({
    customer: customerId,
    limit: 100,
  });

  const filteredCreditNotes = invoiceIds
    ? creditNotes.data.filter((cn) => typeof cn.invoice === "string" && invoiceIds.includes(cn.invoice))
    : creditNotes.data;

  return buildCreditNotesMap(filteredCreditNotes);
}

export function mapInvoiceToOrder(invoice: Stripe.Invoice, creditNotesMap?: Map<string, string[]>): Order {
  const invoiceMetadata = validateInvoiceMetadata(invoice);

  const customer = typeof invoice.customer === "string" ? null : invoice.customer;

  const customerMetadata = customer && !customer.deleted ? validateCustomerMetadata(customer) : null;

  const discountsCount = invoice.total_discount_amounts?.length ?? 0;

  const creditNotesAmount =
    (invoice.post_payment_credit_notes_amount || 0) + (invoice.pre_payment_credit_notes_amount || 0);

  const hasCreditNotes = creditNotesAmount > 0;

  let carrierName: string | null = null;
  if (invoice.shipping_cost?.shipping_rate) {
    if (typeof invoice.shipping_cost.shipping_rate === "string") {
      carrierName = invoice.shipping_cost.shipping_rate;
    } else {
      carrierName = invoice.shipping_cost.shipping_rate.display_name || invoice.shipping_cost.shipping_rate.id;
    }
  }

  return {
    id: invoice.id,
    number: invoice.number || "",
    locale: customerMetadata?.locale || "en",
    stripeInvoiceId: invoice.id,
    sendcloudOrderId: invoiceMetadata.sendcloudOrderId || null,
    customerEmail: invoice.customer_email || "",
    customerName: invoice.customer_name || null,
    customerRole: customerMetadata?.role || null,
    totalAmount: invoice.total,
    currency: invoice.currency,
    shippingStatus: invoiceMetadata.shippingStatus || "awaiting_shipment",
    invoiceStatus: invoice.status || "draft",
    trackingNumber: invoiceMetadata.trackingNumber || null,
    trackingUrl: invoiceMetadata.trackingUrl || null,
    carrierName,
    discountsCount,
    creditNotesAmount,
    hasCreditNotes,
    creditNoteUrls: creditNotesMap?.get(invoice.id) || [],
    invoiceUrl: invoice.hosted_invoice_url || null,
    paidAt: invoice.status_transitions.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : null,
    orderedAt: invoice.effective_at ? new Date(invoice.effective_at * 1000).toISOString() : invoiceMetadata.effectiveAt,
    createdAt: new Date(invoice.created * 1000).toISOString(),
    updatedAt: new Date(invoice.created * 1000).toISOString(),
  };
}
