import { z } from "zod";

const testWebhookSchema = z.object({
  action: z.literal("test_webhook"),
});

const parcelStatusChangedSchema = z.object({
  action: z.literal("parcel_status_changed"),
  timestamp: z.number(),
  carrier_status_change_timestamp: z.number().nullable(),
  parcel: z.object({
    id: z.number(),
    name: z.string(),
    company_name: z.string().optional(),
    address: z.string().optional(),
    address_divided: z.object({}).optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    telephone: z.string().optional(),
    email: z.email().optional(),
    date_created: z.string().optional(),
    tracking_number: z.string(),
    weight: z.string().optional(),
    label: z.object({}).optional(),
    customs_declaration: z.object({}).optional(),
    status: z.object({
      id: z.number(),
      message: z.string(),
    }),
    data: z.object({}).optional(),
    country: z.object({}).optional(),
    shipment: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
      })
      .optional(),
    order_number: z.string().optional(),
    shipment_uuid: z.string().optional(),
    external_order_id: z.string().optional(),
    external_shipment_id: z.string().optional(),
  }),
});

export const sendcloudWebhookSchema = z.discriminatedUnion("action", [testWebhookSchema, parcelStatusChangedSchema]);
