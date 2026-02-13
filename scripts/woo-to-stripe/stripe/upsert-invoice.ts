import { WooOrder } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-order";
import { stripe } from "./client";
import { InvoiceMetadata } from "@/lib/schemas/invoice-metadata-schema";
import Stripe from "stripe";
import { parseISO } from "date-fns/parseISO";
import { format } from "date-fns/format";
import { env } from "@/scripts/woo-to-stripe/env";
import { addDays } from "date-fns/addDays";
import { subYears } from "date-fns/subYears";
import { isAfter } from "date-fns/isAfter";

async function getInvoice(invoiceNumber: string): Promise<Stripe.Invoice> {
  const invoices = await stripe.invoices.search({
    query: `number:'${invoiceNumber}'`,
    limit: 1,
  });

  return invoices.data[0];
}

export async function upsertInvoice(stripeCustomerId: string, order: WooOrder): Promise<void> {
  if (order.status !== "completed") {
    console.warn(`Skipping order ${order.id} with status ${order.status}`);
    return;
  }

  if (!order.wpo_wcpdf_invoice_number) {
    console.warn(`Order ${order.id} has no invoice number, skipping`);
    return;
  }

  const copyNumber = order.wpo_wcpdf_invoice_number;

  const orderTotalInCents = Math.round(parseFloat(order.total) * 100);

  const existingInvoice = await getInvoice(copyNumber);

  if (existingInvoice) {
    if (existingInvoice.total === orderTotalInCents) {
      return;
    } else if (Math.abs(existingInvoice.total - orderTotalInCents) <= 5) {
      return;
    } else {
      console.warn(
        `Invoice ${existingInvoice.id} for order ${order.id} has total ${existingInvoice.total}, which differs from order total ${order.total} by more than 5 cents. Manual intervention required.`,
      );

      // try {
      //   await stripe.invoices.del(existingInvoice.id);
      // } catch (e) {
      //   console.error(`Failed to delete invoice ${existingInvoice.id} for order ${order.id}:`, e);
      //   return;
      // }

      return;
    }
  }

  const invoiceItems: Stripe.InvoiceItemCreateParams[] = [];

  for (const lineItem of order.line_items) {
    invoiceItems.push({
      customer: stripeCustomerId,
      amount: Math.round(parseFloat(lineItem.total) * 100),
      currency: order.currency.toLowerCase(),
      description: `${lineItem.quantity} x ${lineItem.name}`,
      tax_behavior: "exclusive",
    });
  }

  const shipping = order.shipping_lines[0];

  if (shipping) {
    invoiceItems.push({
      customer: stripeCustomerId,
      amount: Math.round(parseFloat(order.shipping_total || order.shipping_tax) * 100),
      currency: order.currency.toLowerCase(),
      description: `${shipping.method_title}`,
      tax_behavior: "exclusive",
    });
  }

  for (const item of invoiceItems) {
    await stripe.invoiceItems.create(item);
  }

  const fiveYearsAgo = addDays(subYears(new Date(), 5), 1);
  const creationDate = parseISO(order.date_created_gmt);
  const isWithinFiveYears = isAfter(creationDate, fiveYearsAgo);

  const effectiveAt = isWithinFiveYears ? Math.round(creationDate.getTime() / 1000) : undefined;

  const invoiceRealDate = format(parseISO(order.date_created_gmt), "dd/MM/yyyy");
  const hasTax = parseFloat(order.total_tax) !== 0;

  const invoice = await stripe.invoices.create({
    customer: stripeCustomerId,
    auto_advance: false, // do not send invoice automatically when finalized
    pending_invoice_items_behavior: "include",
    default_tax_rates: !hasTax ? [] : [env.STRIPE_VAT_TAX_RATE_ID],
    metadata: {
      woocommerceOrderId: order.id.toString(),
      shippingStatus: "delivered",
      source: "woocommerce",
    } satisfies InvoiceMetadata,
    number: copyNumber, // TODO uncomment this
    effective_at: effectiveAt,
    description: `Copy of invoice ${order.wpo_wcpdf_invoice_number} dated ${invoiceRealDate} for order ${order.id}. The total amount shown on this copy may differ from the original by a few cents due to rounding differences. The original amount of ${order.total} remains the one valid.`,
    shipping_details: {
      name: `${order.billing.first_name} ${order.billing.last_name}`,
      address: {
        line1: order.billing.address_1,
        line2: order.billing.address_2 || undefined,
        city: order.billing.city,
        postal_code: order.billing.postcode,
        state: order.billing.state || undefined,
        country: order.billing.country,
      },
      phone: order.billing.phone || undefined,
    },
    shipping_cost: shipping
      ? {
          shipping_rate_data: {
            type: "fixed_amount",
            tax_behavior: "unspecified",
            display_name: shipping.method_title || "Shipping",
            fixed_amount: {
              amount: 0,
              currency: order.currency,
            },
          },
        }
      : undefined,
  });

  if (orderTotalInCents !== invoice.total) {
    console.warn(`Invoice ${invoice.id} total ${invoice.total / 100} != total ${order.total} of order ${order.id}.`);
  }
}
