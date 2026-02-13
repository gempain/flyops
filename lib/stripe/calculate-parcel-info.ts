import Stripe from "stripe";
import { validateProductMetadata } from "@/lib/schemas/product-metadata-schema";
import { mapLineItemsToProducts } from "@/lib/stripe/map-line-items-to-products";
import { round } from "@/lib/utils";

export async function calculateParcelInfoFromLineItems(lineItems: (Stripe.LineItem | Stripe.InvoiceLineItem)[]) {
  const itemsWithProducts = await mapLineItemsToProducts(lineItems);

  let totalWeightGrams = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const item of itemsWithProducts) {
    const metadata = validateProductMetadata(item.product);

    totalWeightGrams += metadata.weight_g * item.quantity;

    const dimensions = {
      length: metadata.length_cm,
      width: metadata.width_cm,
      height: metadata.height_cm,
    };
    maxLength = Math.max(maxLength, dimensions.length);
    maxWidth = Math.max(maxWidth, dimensions.width);
    totalHeight += dimensions.height * item.quantity;
  }

  return {
    totalWeightGrams: round(totalWeightGrams, 2),
    dimensions: {
      maxLength: round(maxLength, 2),
      maxWidth: round(maxWidth, 2),
      totalHeight: round(totalHeight, 2),
    },
  };
}
