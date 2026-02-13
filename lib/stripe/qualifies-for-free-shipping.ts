import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { validateCustomerMetadata } from "@/lib/schemas/customer-metadata-schema";
import { mapLineItemsToProducts } from "@/lib/stripe/map-line-items-to-products";
import { validateProductMetadata } from "@/lib/schemas/product-metadata-schema";

export async function qualifiesForFreeShipping(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
  orderedItems: (Stripe.LineItem | Stripe.InvoiceLineItem)[],
): Promise<boolean> {
  const cus = typeof customer === "string" ? await stripe.customers.retrieve(customer) : customer;
  if (!cus || cus.deleted) {
    return false;
  }

  const { role } = validateCustomerMetadata(cus);

  const itemsWithProducts = await mapLineItemsToProducts(orderedItems);

  const cushionCount =
    itemsWithProducts
      .filter(({ product }) => {
        const { category } = validateProductMetadata(product);
        return category === "cushion";
      })
      .reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return role === "revendeur" && cushionCount >= 6;
}
