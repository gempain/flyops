import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "./client";
import { TranslatableError } from "./translatable-error";
import { CheckoutRequest, CheckoutResponse, SessionStatusResponse } from "@/lib/schemas/checkout-schema";
import { CalculateShippingRequest, CalculateShippingResponse } from "@/lib/schemas/calculate-shipping-schema";
import { BillingPortalRequest, BillingPortalResponse } from "@/lib/schemas/billing-portal-schema";
import { OrdersResponse } from "@/lib/schemas/orders-schema";
import { ContactFormData, ContactResponse } from "@/lib/schemas/contact-schema";
import {
  NewsletterResponse,
  NewsletterSubscribeData,
  NewsletterUnsubscribeData,
} from "@/lib/schemas/newsletter-schema";
import {
  AdminOrdersQuery,
  AdminOrdersResponse,
  UpdateOrder,
  UpdateOrderResponse,
} from "@/lib/schemas/admin-orders-schema";
import { StockProductsResponse } from "@/lib/schemas/stock-schema";
import {
  ApplyInvoiceDiscountsResponse,
  InvoiceShippingOptionsResponse,
  UpdateInvoiceShippingRequest,
} from "@/lib/schemas/invoice-operations-schema";
import {
  CustomersQuery,
  CustomersResponse,
  UpdateCustomerRole,
  UpdateCustomerRoleResponse,
} from "@/lib/schemas/customer-role-schema";

export function useCreateCheckout(options?: UseMutationOptions<CheckoutResponse, TranslatableError, CheckoutRequest>) {
  return useMutation({
    mutationFn: (data: CheckoutRequest) => apiClient.checkout.create(data),
    ...options,
  });
}

export function useCheckoutSessionStatus(
  sessionId: string | null,
  options?: Omit<UseQueryOptions<SessionStatusResponse, TranslatableError>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["checkout-session-status", sessionId],
    queryFn: () => {
      if (!sessionId) {
        throw new TranslatableError("errors.sessionIdRequired");
      }
      return apiClient.checkout.getSessionStatus(sessionId);
    },
    enabled: !!sessionId,
    ...options,
  });
}

export function useCalculateShipping(
  options?: UseMutationOptions<CalculateShippingResponse, TranslatableError, CalculateShippingRequest>,
) {
  return useMutation({
    mutationFn: (data: CalculateShippingRequest) => apiClient.checkout.calculateShipping(data),
    ...options,
  });
}

export function useCreateBillingPortal(
  options?: UseMutationOptions<BillingPortalResponse, TranslatableError, BillingPortalRequest>,
) {
  return useMutation({
    mutationFn: (data: BillingPortalRequest) => apiClient.billingPortal.create(data),
    ...options,
  });
}

export function useOrders(options?: Omit<UseQueryOptions<OrdersResponse, TranslatableError>, "queryKey" | "queryFn">) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.orders.list(),
    ...options,
  });
}

export function useContactForm(options?: UseMutationOptions<ContactResponse, TranslatableError, ContactFormData>) {
  return useMutation({
    mutationFn: (data: ContactFormData) => apiClient.contact.submit(data),
    ...options,
  });
}

export function useNewsletterSubscribe(
  options?: UseMutationOptions<NewsletterResponse, TranslatableError, NewsletterSubscribeData>,
) {
  return useMutation({
    mutationFn: (data: NewsletterSubscribeData) => apiClient.newsletter.subscribe(data),
    ...options,
  });
}

export function useNewsletterUnsubscribe(
  options?: UseMutationOptions<NewsletterResponse, TranslatableError, NewsletterUnsubscribeData>,
) {
  return useMutation({
    mutationFn: (data: NewsletterUnsubscribeData) => apiClient.newsletter.unsubscribe(data),
    ...options,
  });
}

export function useNewsletterVerify(
  code: string | null,
  options?: Omit<UseQueryOptions<NewsletterResponse, TranslatableError>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["newsletter-verify", code],
    queryFn: () => {
      if (!code) {
        throw new TranslatableError("errors.verificationCodeRequired");
      }
      return apiClient.newsletter.verify(code);
    },
    enabled: !!code,
    ...options,
  });
}

export function useAdminOrders(
  params: AdminOrdersQuery,
  options?: Omit<UseQueryOptions<AdminOrdersResponse, TranslatableError>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => apiClient.orders.admin.list(params),
    ...options,
  });
}

export function useUpdateOrder(
  options?: UseMutationOptions<UpdateOrderResponse, TranslatableError, { orderId: string; data: UpdateOrder }>,
) {
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrder }) =>
      apiClient.orders.admin.update(orderId, data),
    ...options,
  });
}

export function useStockProducts(
  options?: Omit<UseQueryOptions<StockProductsResponse, TranslatableError>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["stock-products"],
    queryFn: () => apiClient.stock.list(),
    ...options,
  });
}

export function useUpdateStock(
  options?: UseMutationOptions<{ success: boolean }, TranslatableError, { productId: string; quantity: number }>,
) {
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiClient.stock.update(productId, quantity),
    ...options,
  });
}

export function useGetInvoiceShippingOptions(
  options?: UseMutationOptions<InvoiceShippingOptionsResponse, TranslatableError, string>,
) {
  return useMutation({
    mutationFn: (invoiceId: string) => apiClient.invoices.getShippingOptions(invoiceId),
    ...options,
  });
}

export function useUpdateInvoiceShipping(
  options?: UseMutationOptions<void, TranslatableError, { invoiceId: string; data: UpdateInvoiceShippingRequest }>,
) {
  return useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: string; data: UpdateInvoiceShippingRequest }) =>
      apiClient.invoices.updateShipping(invoiceId, data),
    ...options,
  });
}

export function useApplyInvoiceDiscounts(
  options?: UseMutationOptions<ApplyInvoiceDiscountsResponse, TranslatableError, string>,
) {
  return useMutation({
    mutationFn: (invoiceId: string) => apiClient.invoices.applyDiscounts(invoiceId),
    ...options,
  });
}

export function useDeleteInvoiceDiscounts(options?: UseMutationOptions<void, TranslatableError, string>) {
  return useMutation({
    mutationFn: (invoiceId: string) => apiClient.invoices.deleteDiscounts(invoiceId),
    ...options,
  });
}

export function useAdminCustomers(
  params: CustomersQuery,
  options?: Omit<UseQueryOptions<CustomersResponse, TranslatableError>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: ["admin-customers", params],
    queryFn: () => apiClient.customers.admin.list(params),
    ...options,
  });
}

export function useUpdateCustomerRole(
  options?: UseMutationOptions<
    UpdateCustomerRoleResponse,
    TranslatableError,
    { customerId: string; data: UpdateCustomerRole }
  >,
) {
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: UpdateCustomerRole }) =>
      apiClient.customers.admin.updateRole(customerId, data),
    ...options,
  });
}
