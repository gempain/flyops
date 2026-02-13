import "source-map-support/register";
import * as process from "node:process";
import { mkdirSync } from "fs";
import { writeFileSync } from "node:fs";
import { getCustomerOrders } from "@/scripts/woo-to-stripe/woo-commerce/get-customer-orders";
import { paginateCustomers } from "@/scripts/woo-to-stripe/woo-commerce/paginate-customers";

async function main() {
  const allCustomers = [];
  for await (const { customers } of paginateCustomers()) {
    allCustomers.push(...customers);
  }

  const wooOrders = await getCustomerOrders();

  await mkdirSync("./data", { recursive: true });
  await writeFileSync("./data/woo-customers.json", JSON.stringify(allCustomers, null, 2), "utf-8");
  await writeFileSync("./data/woo-orders.json", JSON.stringify(wooOrders, null, 2), "utf-8");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
