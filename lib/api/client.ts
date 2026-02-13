import { z } from "zod";
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { apiError, TranslatableError } from "./translatable-error";
import {
  type CheckoutRequest,
  type CheckoutResponse,
  checkoutResponseSchema,
  type SessionStatusResponse,
  sessionStatusResponseSchema,
} from "@/lib/schemas/checkout-schema";
import {
  type BillingPortalRequest,
  type BillingPortalResponse,
  billingPortalResponseSchema,
} from "@/lib/schemas/billing-portal-schema";
import {
  type CalculateShippingRequest,
  type CalculateShippingResponse,
  calculateShippingResponseSchema,
} from "@/lib/schemas/calculate-shipping-schema";
import { type ContactFormData, type ContactResponse, contactResponseSchema } from "@/lib/schemas/contact-schema";
import {
  type NewsletterResponse,
  newsletterResponseSchema,
  type NewsletterSubscribeData,
  type NewsletterUnsubscribeData,
} from "@/lib/schemas/newsletter-schema";
import { type OrdersResponse, ordersResponseSchema } from "@/lib/schemas/orders-schema";
import {
  type AdminOrdersQuery,
  type AdminOrdersResponse,
  adminOrdersResponseSchema,
  type UpdateOrder,
  type UpdateOrderResponse,
  updateOrderResponseSchema,
} from "@/lib/schemas/admin-orders-schema";
import { type StockProductsResponse, stockProductsResponseSchema } from "@/lib/schemas/stock-schema";
import {
  type ApplyInvoiceDiscountsResponse,
  applyInvoiceDiscountsResponseSchema,
  type InvoiceShippingOptionsResponse,
  invoiceShippingOptionsResponseSchema,
  type UpdateInvoiceShippingRequest,
} from "@/lib/schemas/invoice-operations-schema";
import {
  type CustomersQuery,
  type CustomersResponse,
  customersResponseSchema,
  type UpdateCustomerRole,
  type UpdateCustomerRoleResponse,
  updateCustomerRoleResponseSchema,
} from "@/lib/schemas/customer-role-schema";

interface ApiClientConfig {
  baseUrl?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseUrl || "",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async request<TResponse>(
    endpoint: string,
    options: AxiosRequestConfig = {},
    responseSchema?: z.ZodSchema<TResponse>,
  ): Promise<TResponse> {
    let data: TResponse;
    try {
      ({ data } = await this.client.request<TResponse>({
        url: endpoint,
        ...options,
      }));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = apiError.safeParse(error.response?.data);

        if (!errorData.success) {
          throw new TranslatableError("errors.generic");
        }

        throw new TranslatableError(errorData.data.code, errorData.data.params, error.response.status);
      }

      throw new TranslatableError("errors.generic");
    }

    if (!responseSchema) {
      return data;
    }

    const body = responseSchema.safeParse(data);
    if (!body.success) {
      console.error("invalid api response", body.error);
      throw new TranslatableError("errors.invalidApiResponse");
    }
    return body.data;
  }

  checkout = {
    create: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      return this.request<CheckoutResponse>(
        "/api/checkout",
        {
          method: "POST",
          data,
        },
        checkoutResponseSchema,
      );
    },

    getSessionStatus: async (sessionId: string): Promise<SessionStatusResponse> => {
      return this.request<SessionStatusResponse>(
        `/api/checkout/session-status?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: "GET",
        },
        sessionStatusResponseSchema,
      );
    },

    calculateShipping: async (data: CalculateShippingRequest): Promise<CalculateShippingResponse> => {
      return this.request<CalculateShippingResponse>(
        "/api/checkout/calculate-shipping",
        {
          method: "POST",
          data,
        },
        calculateShippingResponseSchema,
      );
    },
  };

  billingPortal = {
    create: async (data: BillingPortalRequest): Promise<BillingPortalResponse> => {
      return this.request<BillingPortalResponse>(
        "/api/billing-portal",
        {
          method: "POST",
          data,
        },
        billingPortalResponseSchema,
      );
    },
  };

  orders = {
    list: async (): Promise<OrdersResponse> => {
      return this.request<OrdersResponse>(
        "/api/orders",
        {
          method: "GET",
        },
        ordersResponseSchema,
      );
    },

    admin: {
      list: async (params: AdminOrdersQuery): Promise<AdminOrdersResponse> => {
        return this.request<AdminOrdersResponse>(
          `/api/admin/orders`,
          {
            method: "GET",
            params,
          },
          adminOrdersResponseSchema,
        );
      },

      update: async (orderId: string, data: UpdateOrder): Promise<UpdateOrderResponse> => {
        return this.request<UpdateOrderResponse>(
          `/api/admin/orders/${orderId}`,
          {
            method: "PATCH",
            data,
          },
          updateOrderResponseSchema,
        );
      },
    },
  };

  contact = {
    submit: async (data: ContactFormData): Promise<ContactResponse> => {
      return this.request<ContactResponse>(
        "/api/contact",
        {
          method: "POST",
          data,
        },
        contactResponseSchema,
      );
    },
  };

  newsletter = {
    subscribe: async (data: NewsletterSubscribeData): Promise<NewsletterResponse> => {
      return this.request<NewsletterResponse>(
        "/api/newsletter/subscribe",
        {
          method: "POST",
          data,
        },
        newsletterResponseSchema,
      );
    },

    unsubscribe: async (data: NewsletterUnsubscribeData): Promise<NewsletterResponse> => {
      return this.request<NewsletterResponse>(
        "/api/newsletter/unsubscribe",
        {
          method: "POST",
          data,
        },
        newsletterResponseSchema,
      );
    },

    verify: async (code: string): Promise<NewsletterResponse> => {
      return this.request<NewsletterResponse>(
        `/api/newsletter/verify?code=${encodeURIComponent(code)}`,
        {
          method: "GET",
        },
        newsletterResponseSchema,
      );
    },
  };

  stock = {
    list: async () => {
      return this.request<StockProductsResponse>(
        "/api/admin/stock",
        {
          method: "GET",
        },
        stockProductsResponseSchema,
      );
    },

    update: async (productId: string, quantity: number): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>(`/api/admin/stock/${productId}`, {
        method: "PATCH",
        data: { quantity },
      });
    },
  };

  invoices = {
    getShippingOptions: async (invoiceId: string): Promise<InvoiceShippingOptionsResponse> => {
      return this.request<InvoiceShippingOptionsResponse>(
        `/api/admin/invoices/${invoiceId}/shipping-options`,
        {
          method: "GET",
        },
        invoiceShippingOptionsResponseSchema,
      );
    },

    updateShipping: async (invoiceId: string, data: UpdateInvoiceShippingRequest): Promise<void> => {
      await this.request(`/api/admin/invoices/${invoiceId}/update-shipping`, {
        method: "POST",
        data,
      });
    },

    applyDiscounts: async (invoiceId: string): Promise<ApplyInvoiceDiscountsResponse> => {
      return this.request<ApplyInvoiceDiscountsResponse>(
        `/api/admin/invoices/${invoiceId}/apply-discounts`,
        {
          method: "POST",
        },
        applyInvoiceDiscountsResponseSchema,
      );
    },

    deleteDiscounts: async (invoiceId: string): Promise<void> => {
      await this.request(`/api/admin/invoices/${invoiceId}/delete-discounts`, {
        method: "POST",
      });
    },
  };

  customers = {
    admin: {
      list: async (params: CustomersQuery): Promise<CustomersResponse> => {
        return this.request<CustomersResponse>(
          `/api/admin/customers`,
          {
            method: "GET",
            params,
          },
          customersResponseSchema,
        );
      },

      updateRole: async (customerId: string, data: UpdateCustomerRole): Promise<UpdateCustomerRoleResponse> => {
        return this.request<UpdateCustomerRoleResponse>(
          `/api/admin/customers/${customerId}`,
          {
            method: "PATCH",
            data,
          },
          updateCustomerRoleResponseSchema,
        );
      },
    },
  };
}

export const apiClient = new ApiClient();
