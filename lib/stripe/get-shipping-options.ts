import { sendCloudSDK } from "@/lib/sendlcoud/sendcloud-sdk";
import { privateEnv } from "@/lib/env/private-env";
import Stripe from "stripe";
import { ShippingOptionsMetadata } from "@/lib/schemas/shipping-options-metadata";
import { calculateParcelInfoFromLineItems } from "@/lib/stripe/calculate-parcel-info";
import { qualifiesForFreeShipping } from "@/lib/stripe/qualifies-for-free-shipping";

export interface ShippingRate {
  id: string;
  amount: number;
  currency: string;
  display_name: string;
  carrier_name: string;
  sendcloud_code: string;
  lead_time: number;
  real_cost: number;
}

export interface GetShippingOptionsParams {
  to_country_code: string;
  to_postal_code: string;
  orderedItems: (Stripe.LineItem | Stripe.InvoiceLineItem)[];
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null;
}

export async function getShippingOptions(params: GetShippingOptionsParams): Promise<ShippingRate[]> {
  const { to_country_code, to_postal_code, customer, orderedItems } = params;

  const parcelInfo = await calculateParcelInfoFromLineItems(orderedItems);
  const freeShipping = await qualifiesForFreeShipping(customer, orderedItems);

  console.log("parcelInfo", parcelInfo);

  const shippingOptions = await sendCloudSDK.getShippingOptions({
    from_country_code: privateEnv.SENDCLOUD_FROM_COUNTRY,
    to_country_code,
    from_postal_code: privateEnv.SENDCLOUD_FROM_POSTAL,
    to_postal_code,
    parcels: [
      {
        weight: {
          value: (parcelInfo.totalWeightGrams / 1000).toFixed(2),
          unit: "kg",
        },
        ...(parcelInfo.dimensions && {
          dimensions: {
            length: parcelInfo.dimensions.maxLength.toString(),
            width: parcelInfo.dimensions.maxWidth.toString(),
            height: parcelInfo.dimensions.totalHeight.toString(),
            unit: "cm",
          },
        }),
      },
    ],
    calculate_quotes: true,
    functionalities: {
      form_factor: "parcel",
      tracked: true,
      returns: false,
      b2c: true,
      dangerous_goods: false,
      last_mile: "home_delivery",
      signature: true,
    },
  });

  return shippingOptions
    .filter((option) => option.quotes && option.quotes.length > 0)
    .map((option) => {
      const quote = option.quotes![0];
      const price = parseFloat(quote.price.total.value);
      const currency = quote.price.total.currency.toLowerCase();
      const leadTime = quote.lead_time || 72;
      const realCost = Math.round(price * 100);

      return {
        id: option.code,
        amount: freeShipping ? 0 : realCost,
        currency,
        display_name: option.name,
        carrier_name: option.carrier.name,
        sendcloud_code: option.code,
        lead_time: leadTime,
        real_cost: realCost,
      };
    })
    .sort((a, b) => a.lead_time - b.lead_time);
}

export function mapShippingRatesToStripeOptions(
  rate: ShippingRate,
): Stripe.Checkout.SessionUpdateParams.ShippingOption | Stripe.InvoiceUpdateParams.ShippingCost {
  return {
    shipping_rate_data: {
      type: "fixed_amount",
      tax_behavior: "unspecified",
      tax_code: "txcd_92010001",
      fixed_amount: {
        amount: rate.amount,
        currency: rate.currency,
      },
      display_name: rate.display_name,
      delivery_estimate: {
        minimum: {
          unit: "hour",
          value: rate.lead_time,
        },
        maximum: {
          unit: "hour",
          value: rate.lead_time + 24,
        },
      },
      metadata: {
        sendcloud_code: rate.sendcloud_code,
        real_cost: rate.real_cost.toString(),
      } satisfies ShippingOptionsMetadata,
    },
  };
}
