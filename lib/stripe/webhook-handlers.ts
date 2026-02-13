import Stripe from "stripe";
import { privateEnv } from "@/lib/env/private-env";
import { sendOrderConfirmationCustomer } from "@/lib/email/templates/order-confirmation-customer/order-confirmation-customer";
import { sendOrderNotificationAdmin } from "@/lib/email/templates/order-notification-admin/order-notification-admin";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { stripe } from "@/lib/stripe/client";
import { InvoiceMetadata, validateInvoiceMetadata } from "@/lib/schemas/invoice-metadata-schema";
import { createSendcloudOrder } from "@/lib/sendlcoud/create-sendcloud-order";
import { searchCoupons } from "@/lib/stripe/search-coupons";
import { ProductMetadata, validateProductMetadata } from "@/lib/schemas/product-metadata-schema";
import { sendInvoiceToBillit } from "@/lib/stripe/send-invoice-to-billit";

export async function handleCreditNoteCreated(creditNote: Stripe.CreditNote): Promise<void> {
  await sendInvoiceToBillit(creditNote.pdf);
}

export async function handleInvoiceCreated(_invoice: Stripe.Invoice): Promise<void> {
  console.log("[Webhook] Invoice created:", _invoice.id);

  const metadata = validateInvoiceMetadata(_invoice);

  if (metadata.source === "stripe_checkout_session" || metadata.source === "woocommerce") {
    console.log(`skipping invoice ${_invoice.id} as woocommerce_order_id is defined`);
    return;
  }

  // invoice was created from Stripe dashboard or API, apply any relevant coupons

  const customerId = typeof _invoice.customer === "string" ? _invoice.customer : _invoice.customer?.id;
  if (!customerId) {
    console.error("[Webhook] Invoice has no valid customer ID:", _invoice.id);
    return;
  }

  const coupons = await searchCoupons(customerId);
  if (coupons.length === 0) {
    console.log(`[Webhook] No applicable coupons found for customer ${customerId} on invoice ${_invoice.id}`);
    return;
  }

  try {
    await stripe.invoices.update(_invoice.id, {
      discounts: coupons.map((couponId) => ({ coupon: couponId })),
    });
    console.log(`[Webhook] Applied coupons to invoice ${_invoice.id}:`, coupons);
  } catch (error) {
    console.error(`[Webhook] Failed to apply coupons to invoice ${_invoice.id}:`, error);
  }
}

export async function handleInvoiceFinalized(_invoice: Stripe.Invoice): Promise<void> {
  console.log("[Webhook] Invoice payment succeeded:", _invoice.id);

  const metadata = validateInvoiceMetadata(_invoice);
  if (metadata.source === "woocommerce") {
    console.log(`skipping invoice ${_invoice.id} as woocommerceOrderId is defined`);
    return;
  }

  const invoice = await stripe.invoices.retrieve(_invoice.id, {
    expand: ["lines.data.pricing.price_details.price", "customer"],
  });

  if (!invoice.effective_at) {
    console.error(
      `[Webhook] Invoice ${invoice.id} does not have an effective date (status: ${invoice.status}). Skipping.`,
    );
    return;
  }

  const customer = typeof invoice.customer === "string" ? null : invoice.customer;
  const isDeletedCustomer = customer && "deleted" in customer;

  if (isDeletedCustomer || !customer || !("metadata" in customer)) {
    console.error("[Webhook] Invalid customer for invoice:", invoice.id);
    return;
  }

  const { locale } = validateCustomerMetadata(customer);

  const lineItems = invoice.lines.data.map((item) => ({
    id: item.id,
    name: item.description || "Product",
    quantity: item.quantity || 1,
    amount: item.amount,
    currency: item.currency,
  }));

  const sendCloudOrder = await createSendcloudOrder(invoice);

  await stripe.invoices.update(invoice.id, {
    metadata: {
      sendcloudOrderId: sendCloudOrder?.orderId || "",
      shippingStatus: "awaiting_shipment",
    } satisfies InvoiceMetadata,
  });

  for (const line of invoice.lines.data) {
    const price = line.pricing?.price_details?.price as string | Stripe.Price;
    const quantity = line.quantity;
    if (!price || !quantity || quantity <= 0) {
      continue;
    }

    const retrievedPrice = await stripe.prices.retrieve(typeof price === "string" ? price : price.id, {
      expand: ["product"],
    });

    const product = retrievedPrice.product as Stripe.Product;

    let metadata: ProductMetadata;
    try {
      metadata = validateProductMetadata(product);
    } catch {
      console.warn("[Webhook] Skipping product stock update due to invalid metadata for product:", product.id);
      continue;
    }

    const currentStock = metadata.stock_quantity;
    const newStock = currentStock - quantity;

    await stripe.products.update(product.id, {
      metadata: {
        stock_quantity: newStock,
      } satisfies Partial<ProductMetadata>,
    });
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formattedLineItems = lineItems.map((item) => ({
    description: item.name,
    quantity: item.quantity,
    amount: item.amount,
    currency: item.currency,
    formattedAmount: formatCurrency(item.amount, item.currency),
  }));

  try {
    await sendOrderConfirmationCustomer({
      to: invoice.customer_email!,
      name: invoice.customer_name || "Customer",
      orderId: invoice.id,
      orderDate: formatDate(new Date(invoice.status_transitions.paid_at! * 1000)),
      lineItems: formattedLineItems,
      formattedTotal: formatCurrency(invoice.total, invoice.currency),
      trackOrderUrl: `${privateEnv.BETTER_AUTH_URL}/${locale}/orders`,
      contactUrl: `${privateEnv.BETTER_AUTH_URL}/${locale}/contact`,
      locale: locale,
    });

    console.log("[Webhook] Customer confirmation email sent:", invoice.customer_email);
  } catch (emailError) {
    console.error("[Webhook] Failed to send customer email:", emailError);
  }

  try {
    await sendOrderNotificationAdmin({
      to: privateEnv.ADMIN_EMAIL,
      orderId: invoice.id,
      orderDate: formatDate(new Date(invoice.effective_at * 1000)),
      invoiceId: invoice.id,
      customerName: invoice.customer_name || "N/A",
      customerEmail: invoice.customer_email!,
      lineItems: formattedLineItems,
      formattedTotal: formatCurrency(invoice.amount_paid, invoice.currency),
      dashboardUrl: `https://dashboard.stripe.com/invoices/${invoice.id}`,
      locale: privateEnv.ADMIN_EMAIL_LOCALE,
    });
  } catch (emailError) {
    console.error("[Webhook] Failed to send admin email:", emailError);
  }

  if (invoice.invoice_pdf) {
    await sendInvoiceToBillit(invoice.invoice_pdf);
  }
}
