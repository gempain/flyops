import "source-map-support/register";
import * as process from "node:process";
import { readFileSync } from "fs";
import { WooCustomer } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-customer";
import { WooOrder } from "@/scripts/woo-to-stripe/woo-commerce/types/woo-order";
import Stripe from "stripe";
import { getCustomerVatNumber } from "@/scripts/woo-to-stripe/woo-commerce/get-customer-vat-number";
import { upsertCustomerFromWooCustomer } from "@/scripts/woo-to-stripe/stripe/upsert-customer-from-woo-customer";
import { upsertCustomerVatNumber } from "@/scripts/woo-to-stripe/stripe/upsert-customer-vat-number";
import { upsertInvoice } from "@/scripts/woo-to-stripe/stripe/upsert-invoice";
import { upsertCustomerFromWooOrder } from "@/scripts/woo-to-stripe/stripe/upsert-customer-from-woo-order";
import { stripe } from "@/scripts/woo-to-stripe/stripe/client";
import { Locale } from "@/lib/locale";
import { CustomerMetadata } from "@/lib/schemas/customer-metadata-schema";

type Locales = { email: string; meta_value: string }[];

async function migrateCustomers(wooCustomers: WooCustomer[], stripeCustomers: Stripe.Customer[]) {
  const missingCustomers: WooCustomer[] = [];
  const missingVatNumbers: WooCustomer[] = [];

  for (const wooCustomer of wooCustomers) {
    const stripeCustomer = stripeCustomers.find((sc) => sc.email === wooCustomer.email);
    if (!stripeCustomer) {
      missingCustomers.push(wooCustomer);
      continue;
    }

    const vatNumber = getCustomerVatNumber(wooCustomer);

    if (!vatNumber) {
      continue;
    }
    const hasTaxId = stripeCustomer.tax_ids?.data.find((tid) => tid.value === vatNumber);
    if (!hasTaxId) {
      missingVatNumbers.push(wooCustomer);
    }
  }

  console.log(`missing customers: ${missingCustomers.length}`);
  for (let i = 0; i < missingCustomers.length; i++) {
    const cus = missingCustomers[i];

    console.log(`creating ${i + 1} / ${missingCustomers.length}`, cus.email);
    await upsertCustomerFromWooCustomer(cus);
  }

  console.log(`missing VAT numbers: ${missingVatNumbers.length}`);
  for (let i = 0; i < missingVatNumbers.length; i++) {
    const cus = missingVatNumbers[i];

    console.log(`creating ${i + 1} / ${missingVatNumbers.length}`, cus.email);
    const stripeCustomerId = await upsertCustomerFromWooCustomer(cus);
    const vatNumber = getCustomerVatNumber(cus);
    if (vatNumber) {
      await upsertCustomerVatNumber(cus, stripeCustomerId);
    }
  }
}

async function migrateOrders(orders: WooOrder[], wooCustomers: WooCustomer[], stripeCustomers: Stripe.Customer[]) {
  for (let i = 0; i < orders.length; i++) {
    const wooOrder = orders[i];
    const wooCustomer = wooCustomers.find((c) => c.id === wooOrder.customer_id);
    let stripeCustomerId: string | undefined;
    if (!wooCustomer) {
      if (wooOrder.billing.email) {
        stripeCustomerId = await upsertCustomerFromWooOrder(wooOrder);
      }
    } else {
      stripeCustomerId = stripeCustomers.find((sc) => sc.email === wooCustomer.email)?.id;
    }

    if (!stripeCustomerId) {
      console.warn(
        `Could not find stripe customer for order ${wooOrder.id} and customer email ${wooCustomer?.email || wooOrder.billing.email || wooOrder.shipping.email || "???"}`,
      );
      continue;
    }

    console.log(`${i + 1} / ${orders.length}`);
    await upsertInvoice(stripeCustomerId, wooOrder);
  }
}

function getInvoiceCheckData(wooOrders: WooOrder[], stripeOrders: Stripe.Invoice[]) {
  const ordersWithoutInvoiceNumber: WooOrder[] = [];
  const ordersWithoutInvoiceInStripe: WooOrder[] = [];
  const ordersWithWrongInvoiceTotal: { order: WooOrder; invoice: Stripe.Invoice }[] = [];

  for (const wooOrder of wooOrders) {
    if (!wooOrder.wpo_wcpdf_invoice_number) {
      ordersWithoutInvoiceNumber.push(wooOrder);
      continue;
    }

    const invoice = stripeOrders.find((inv) => inv.number === wooOrder.wpo_wcpdf_invoice_number);
    if (!invoice) {
      ordersWithoutInvoiceInStripe.push(wooOrder);
      continue;
    }

    if ((invoice.total / 100).toFixed(2) !== wooOrder.total) {
      ordersWithWrongInvoiceTotal.push({ order: wooOrder, invoice });
    }
  }

  return {
    ordersWithoutInvoiceNumber,
    ordersWithoutInvoiceInStripe,
    ordersWithWrongInvoiceTotal,
  };
}

async function recreateInvoiceForOrder(wooOrders: WooOrder[], orderId: number, wooCustomers: WooCustomer[]) {
  const order = wooOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const wooCustomer = wooCustomers.find((c) => c.id === order.customer_id);
  if (!wooCustomer) {
    throw new Error(`Customer ${order.customer_id} not found`);
  }

  // console.log(JSON.stringify(order, null, 2));

  const test_stripeCustomerId = await upsertCustomerFromWooCustomer(wooCustomer);
  await upsertCustomerVatNumber(wooCustomer, test_stripeCustomerId);
  await upsertInvoice(test_stripeCustomerId, order);
}

async function deleteAllDraftInvoices(invoices: Stripe.Invoice[]) {
  for (let i = 0; i < invoices.length; i++) {
    const order = invoices[i];

    console.log(`Deleting invoice ${i + 1} / ${invoices.length}: ${order.id}`);

    if (order.status === "draft") {
      await stripe.invoices.del(order.id);
    }
  }
}

async function checkIntegrity(wooOrders: WooOrder[], stripeInvoices: Stripe.Invoice[]) {
  const { ordersWithoutInvoiceNumber, ordersWithoutInvoiceInStripe, ordersWithWrongInvoiceTotal } = getInvoiceCheckData(
    wooOrders,
    stripeInvoices,
  );
  console.log(
    `orders without invoice number:\n${ordersWithoutInvoiceNumber.map((o) => `${o.billing.email} ${o.status}`).join("\n\t")}`,
  );
  console.log(`orders without invoice in stripe: ${ordersWithoutInvoiceInStripe.length}`);
  const skippedStatus = new Set(["cancelled", "processing", "failed", "refunded"]);
  ordersWithoutInvoiceInStripe
    .filter((o) => !skippedStatus.has(o.status))
    .forEach((o) => {
      console.log(`\t ${o.id} ${o.status} ${o.billing.email}`);
    });
  console.log(`orders with wrong invoice total: ${ordersWithWrongInvoiceTotal.length}`);
  const ordersWithMoreThan5CentsDIff = ordersWithWrongInvoiceTotal.filter(({ invoice, order }) => {
    const orderTotalInCents = parseFloat(order.total) * 100;
    return Math.abs(invoice.total - orderTotalInCents) >= 5;
  });
  console.log(`Orders with more than 5 cents difference: ${ordersWithMoreThan5CentsDIff.length}`);
  ordersWithMoreThan5CentsDIff.forEach(({ invoice, order }) => {
    console.log(
      `\t ${order.id} expected ${JSON.stringify(order.total)} got ${(invoice.total / 100).toFixed(2)} (${invoice.id})`,
    );
  });
}

async function updateLocales(wooCustomers: WooCustomer[], stripeCustomers: Stripe.Customer[], locales: Locales) {
  for (let i = 0; i < stripeCustomers.length; i++) {
    const stripeCustomer = stripeCustomers[i];

    const locale: Locale =
      (locales.find((l) => l.email === stripeCustomer.email)?.meta_value.split("_")[0] as Locale) || "fr";

    console.log(
      `Updating locale for customer ${i + 1} / ${wooCustomers.length}: ${stripeCustomer.email} -> ${locale}`,
      { locale: locale },
    );

    if (stripeCustomer.metadata.locale === locale) {
      continue;
    }

    await stripe.customers.update(stripeCustomer.id, {
      preferred_locales: [locale],
      metadata: {
        locale: locale,
      } satisfies Partial<CustomerMetadata>,
    });
  }
}

async function finalizeInvoices(stripeInvoices: Stripe.Invoice[]) {
  for (let i = 0; i < stripeInvoices.length; i++) {
    const invoice = stripeInvoices[i];

    if (invoice.status !== "draft") {
      continue;
    }

    console.log(`Finalizing invoice ${i + 1} / ${stripeInvoices.length}: ${invoice.id}`);
    await stripe.invoices.pay(invoice.id, {
      paid_out_of_band: true,
    });
  }
}

async function main() {
  const wooCustomers: WooCustomer[] = JSON.parse(readFileSync("./data/woo-customers.json", "utf-8"));
  const wooOrders: WooOrder[] = JSON.parse(readFileSync("./data/woo-orders.json", "utf-8"));
  const stripeCustomers: Stripe.Customer[] = JSON.parse(readFileSync("./data/stripe-customers.json", "utf-8"));
  const stripeInvoices: Stripe.Invoice[] = JSON.parse(readFileSync("./data/stripe-invoices.json", "utf-8"));
  const locales: Locales = JSON.parse(readFileSync("./data/user-locales.json", "utf-8"));

  await migrateCustomers(wooCustomers, stripeCustomers);
  // await updateLocales(wooCustomers, stripeCustomers, locales);
  // await migrateOrders(wooOrders, wooCustomers, stripeCustomers);
  // await checkIntegrity(wooOrders, stripeInvoices);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
