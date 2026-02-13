import "source-map-support/register";
import * as process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";
import Stripe from "stripe";
import { stripe } from "@/scripts/woo-to-stripe/stripe/client";

async function fetchAllCustomers(): Promise<Stripe.Customer[]> {
  const customers: Stripe.Customer[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  console.log("Fetching Stripe customers...");

  while (hasMore) {
    const response = await stripe.customers.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.tax_ids"],
    });

    customers.push(...response.data);
    hasMore = response.has_more;

    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }

    console.log(`Fetched ${customers.length} customers...`);
  }

  return customers;
}

async function fetchAllInvoices(): Promise<Stripe.Invoice[]> {
  const invoices: Stripe.Invoice[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;

  console.log("Fetching Stripe invoices...");

  while (hasMore) {
    const response = await stripe.invoices.list({
      // status: "draft",
      limit: 100,
      starting_after: startingAfter,
    });

    invoices.push(...response.data);
    hasMore = response.has_more;

    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }

    console.log(`Fetched ${invoices.length} invoices...`);
  }

  return invoices;
}

async function main() {
  const customers = await fetchAllCustomers();
  const invoices = await fetchAllInvoices();

  console.log(`Total customers: ${customers.length}`);
  console.log(`Total invoices: ${invoices.length}`);

  mkdirSync("./data", { recursive: true });
  writeFileSync("./data/stripe-customers.json", JSON.stringify(customers, null, 2), "utf-8");
  writeFileSync("./data/stripe-invoices.json", JSON.stringify(invoices, null, 2), "utf-8");

  console.log("Data saved successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
