import { sendCloudSDK } from "@/lib/sendlcoud/sendcloud-sdk";
import { stripe } from "@/lib/stripe/client";
import { privateEnv } from "@/lib/env/private-env";
import Stripe from "stripe";
import { calculateParcelInfoFromLineItems } from "@/lib/stripe/calculate-parcel-info";
import { validateShippingRateMetadata } from "@/lib/schemas/shipping-options-metadata";
import { TranslatableError } from "@/lib/api/translatable-error";

export async function createSendcloudOrder(
  invoice: Stripe.Invoice,
): Promise<{ orderId: string; carrierName: string } | null> {
  try {
    const parcelInfo = await calculateParcelInfoFromLineItems(invoice.lines.data);
    const shippingAddress = invoice.shipping_details?.address || invoice.customer_address;

    if (!shippingAddress) {
      console.warn(`No shipping address found for invoice: ${invoice.id}`);
      return null;
    }

    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postal_code || !shippingAddress.country) {
      console.warn(`Invalid shipping address for invoice: ${invoice.id}, ${JSON.stringify(shippingAddress)}`);
      return null;
    }

    if (!invoice.shipping_cost?.shipping_rate) {
      throw new TranslatableError("errors.missingShippingRate", { invoiceId: invoice.id });
    }

    const shippingRate =
      typeof invoice.shipping_cost.shipping_rate === "string"
        ? await stripe.shippingRates.retrieve(invoice.shipping_cost.shipping_rate)
        : invoice.shipping_cost.shipping_rate;

    const shippingOptionMetadata = validateShippingRateMetadata(shippingRate);

    const orderResponse = await sendCloudSDK.createOrder({
      order_id: invoice.id,
      order_number: invoice.number || invoice.id,
      order_details: {
        integration: {
          id: privateEnv.SENDCLOUD_INTEGRATION_ID,
        },
        status: {
          code: "paid",
        },
        order_created_at: new Date(invoice.status_transitions.paid_at! * 1000).toISOString(),
        order_items: invoice.lines.data.map((item) => {
          const quantity = item.quantity || 1;
          return {
            name: item.description || "Product",
            quantity: quantity,
            total_price: {
              value: ((quantity * item.amount) / 100).toFixed(2),
              currency: item.currency.toUpperCase(),
            },
          };
        }),
      },
      payment_details: {
        total_price: {
          value: (invoice.amount_paid / 100).toFixed(2),
          currency: invoice.currency.toUpperCase(),
        },
        status: {
          code: "paid",
        },
      },
      customer_details: {
        name: invoice.customer_name || "Customer",
        email: invoice.customer_email || undefined,
      },
      shipping_address: {
        name: invoice.customer_name || "Customer",
        address_line_1: shippingAddress.line1,
        address_line_2: shippingAddress.line2 || undefined,
        city: shippingAddress.city,
        postal_code: shippingAddress.postal_code,
        country_code: shippingAddress.country,
        email: invoice.customer_email || undefined,
      },
      shipping_details: {
        measurement: parcelInfo.dimensions
          ? {
              weight: {
                value: Math.round(parcelInfo.totalWeightGrams / 1000),
                unit: "kg",
              },
              dimension: {
                unit: "cm",
                width: parcelInfo.dimensions.maxWidth,
                height: parcelInfo.dimensions.totalHeight,
                length: parcelInfo.dimensions.maxLength,
              },
            }
          : {
              weight: {
                value: Math.round(parcelInfo.totalWeightGrams / 1000),
                unit: "kg",
              },
            },
        ship_with: {
          type: "shipping_option_code",
          properties: {
            shipping_option_code: shippingOptionMetadata.sendcloud_code,
          },
        },
      },
    });

    if (!orderResponse || orderResponse.data.length <= 0) {
      console.error("[Webhook] SendCloud order creation returned no data for invoice:", invoice.id);
      return null;
    }

    return {
      orderId: orderResponse.data[0].id.toString(),
      carrierName: shippingRate ? shippingRate.display_name || "Unknown Carrier" : "",
    };
  } catch (sendcloudError) {
    console.error("[Webhook] Failed to create SendCloud order:", sendcloudError);
    return null;
  }
}
