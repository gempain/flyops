import axios, { AxiosInstance } from "axios";
import { privateEnv } from "../env/private-env";

/**
 * @see https://api.sendcloud.dev/docs/sendcloud-public-api/shipping-options/operations/create-a-shipping-option
 */
export interface SendCloudShippingOption {
  code: string;
  name: string;
  carrier: {
    code: string;
    name: string;
  };
  product: {
    code: string;
    name: string;
  };
  functionalities: Record<string, unknown>;
  quotes?: Array<{
    price: {
      total: {
        value: string;
        currency: string;
      };
    };
    lead_time?: number;
  }>;
}

export interface SendCloudShippingOptionsRequest {
  from_country_code: string;
  to_country_code: string;
  from_postal_code?: string;
  to_postal_code: string;
  parcels: Array<{
    dimensions?: {
      length: string;
      width: string;
      height: string;
      unit: "cm" | "in";
    };
    weight: {
      value: string;
      unit: "kg" | "lb";
    };
  }>;
  carrier_code?: string;
  functionalities?: Record<string, unknown>;
  calculate_quotes: boolean;
}

export interface SendCloudShippingOptionsResponse {
  data: SendCloudShippingOption[];
}

export interface SendCloudAddress {
  name: string;
  company_name?: string;
  address_line_1: string;
  house_number?: string;
  address_line_2?: string;
  postal_code: string;
  city: string;
  po_box?: string | null;
  state_province_code?: string;
  country_code: string;
  email?: string;
  phone_number?: string;
}

export interface SendCloudOrderItem {
  sku?: string;
  name: string;
  quantity: number;
  total_price: {
    value: string;
    currency: string;
  };
  weight?: {
    value: string;
    unit: "kg" | "lb";
  };
  hs_code?: string;
  origin_country_code?: string;
  product_id?: string;
  properties?: Record<string, unknown>;
}

// https://api.sendcloud.dev/docs/sendcloud-public-api/orders/operations/create-a-order
export interface SendCloudOrder {
  order_id: string;
  order_number: string;
  order_details: {
    integration: {
      id: number;
    };
    status: {
      code: string;
    };
    order_created_at: string;
    order_updated_at?: string;
    order_items: SendCloudOrderItem[];
    notes?: string;
    tags?: string[];
  };
  payment_details: {
    is_cash_on_delivery?: boolean | null;
    total_price: {
      value: string;
      currency: string;
    };
    subtotal_price?: {
      value: string;
      currency: string;
    };
    estimated_shipping_price?: {
      value: string;
      currency: string;
    };
    estimated_tax_price?: {
      value: string;
      currency: string;
    };
    status: {
      code: string;
    };
    invoice_date?: string | null;
    discount_granted?: {
      value: string;
      currency: string;
    };
    insurance_costs?: {
      value: string;
      currency: string;
    };
    freight_costs?: {
      value: string;
      currency: string;
    };
    other_costs?: {
      value: string;
      currency: string;
    };
  };
  customs_details?: {
    commercial_invoice_number?: string;
    shipment_type?: "gift" | "commercial_goods" | "commercial_sample" | "returned_goods";
    export_type?: "private" | "commercial_b2c" | "commercial_b2b";
    tax_numbers?: Record<string, unknown> | null;
  } | null;
  customer_details: {
    name: string;
    phone_number?: string;
    email?: string;
    billing_address?: SendCloudAddress;
  };
  shipping_address: SendCloudAddress;
  shipping_details?: {
    is_local_pickup?: boolean | null;
    delivery_indicator?: string;
    measurement?: {
      weight?: {
        value: number;
        unit: "kg" | "lb";
      };
      dimension?: {
        length: number;
        width: number;
        height: number;
        unit: "cm" | "in";
      };
    };
    ship_with?: {
      type: "shipping_option_code" | "carrier_code" | "contract_id";
      properties: {
        shipping_option_code?: string;
        carrier_code?: string;
        contract_id?: number;
      };
    };
  };
  service_point_details?: {
    id: string;
    post_number?: string;
    latitude?: string;
    longitude?: string;
    type?: string;
    extra_data?: Record<string, unknown>;
  };
}

export interface SendCloudOrderResponse {
  data: Array<{
    id: number;
    order_id: string;
    order_number: string;
  }>;
}

export interface SendCloudOrderErrorResponse {
  errors?: Array<{
    detail?: string;
    source?: {
      pointer?: string;
    };
  }>;
}

class SendCloudSDK {
  private readonly baseURL_v3 = "https://panel.sendcloud.sc/api/v3";

  private readonly client_v3: AxiosInstance;

  constructor() {
    const auth = Buffer.from(`${privateEnv.SENDCLOUD_PUBLIC_KEY}:${privateEnv.SENDCLOUD_SECRET_KEY}`).toString(
      "base64",
    );

    const baseConfig = {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    };

    this.client_v3 = axios.create({
      ...baseConfig,
      baseURL: this.baseURL_v3,
    });

    const errorInterceptor = (error: unknown) => {
      const err = error as {
        response?: { status: number; statusText: string; data: unknown };
        request?: unknown;
        message?: string;
      };

      if (err.response) {
        console.error(`[SendCloud] API Error: ${err.response.status} ${err.response.statusText}`, err.response.data);
      } else if (err.request) {
        console.error("[SendCloud] No response received:", err.message);
      } else {
        console.error("[SendCloud] Request error:", err.message);
      }
      return Promise.reject(error);
    };

    this.client_v3.interceptors.response.use((response) => response, errorInterceptor);
  }

  async getShippingOptions(request: SendCloudShippingOptionsRequest): Promise<SendCloudShippingOption[]> {
    try {
      const response = await this.client_v3.post<SendCloudShippingOptionsResponse>("/shipping-options", request);

      return response.data.data || [];
    } catch (error) {
      console.error("[SendCloud] Error fetching shipping options:", error);
      return [];
    }
  }

  async createOrder(orderData: SendCloudOrder): Promise<SendCloudOrderResponse | null> {
    try {
      const response = await this.client_v3.post<SendCloudOrderResponse>("/orders", [orderData]);

      if (response.data.data && response.data.data.length > 0) {
        const order = response.data.data[0];
        console.log(`[SendCloud] Order created: ${order.id} - Order Number: ${order.order_number}`);
        return response.data;
      }

      return null;
    } catch (error) {
      const err = error as {
        response?: {
          status: number;
          data?: SendCloudOrderErrorResponse;
        };
      };

      console.error("[SendCloud] Order creation failed:", JSON.stringify(err.response?.data));
      console.log("payloadf was:", JSON.stringify(orderData));

      return null;
    }
  }

  async getTrackingInfo(trackingNumber: string): Promise<string | null> {
    try {
      const response = await this.client_v3.get<{
        data: {
          tracking_numbers: Array<{
            tracking_url?: string;
          }>;
        };
      }>(`/parcels/tracking/${encodeURIComponent(trackingNumber)}`);

      const trackingUrl = response.data.data.tracking_numbers?.[0]?.tracking_url;

      if (trackingUrl) {
        console.log(`[SendCloud] Retrieved tracking URL for ${trackingNumber}: ${trackingUrl}`);
        return trackingUrl;
      }

      console.warn(`[SendCloud] No tracking URL found for tracking number: ${trackingNumber}`);
      return null;
    } catch (error) {
      console.error(`[SendCloud] Error fetching tracking info for ${trackingNumber}:`, error);
      return null;
    }
  }
}

export const sendCloudSDK = new SendCloudSDK();
