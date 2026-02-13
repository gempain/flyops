import Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";

interface LineItemWithProduct {
  product: Stripe.Product;
  quantity: number;
}

function extractProductFromLineItem(
  item: Stripe.LineItem | Stripe.InvoiceLineItem,
): string | Stripe.Product | Stripe.DeletedProduct | undefined {
  if ("price" in item && item.price?.product) {
    return item.price.product;
  } else if ("pricing" in item && item.pricing?.price_details?.product) {
    return item.pricing.price_details.product;
  }
  return undefined;
}

export async function mapLineItemsToProducts(
  lineItems: (Stripe.LineItem | Stripe.InvoiceLineItem)[],
): Promise<LineItemWithProduct[]> {
  const result: LineItemWithProduct[] = [];

  for (const item of lineItems) {
    const productOrId = extractProductFromLineItem(item);

    if (!productOrId) {
      continue;
    }

    const product = typeof productOrId === "string" ? await stripe.products.retrieve(productOrId) : productOrId;

    if (product.deleted) {
      continue;
    }

    result.push({
      product,
      quantity: item.quantity || 1,
    });
  }

  return result;
}
