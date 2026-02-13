import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "./client";
import { TranslatableError } from "./translatable-error";
import {
  CustomersQuery,
  CustomersResponse,
  UpdateCustomerRole,
  UpdateCustomerRoleResponse,
} from "@/lib/schemas/customer-role-schema";
import { ContactFormData, ContactResponse } from "@/lib/schemas/contact-schema";

export function useContactForm(options?: UseMutationOptions<ContactResponse, TranslatableError, ContactFormData>) {
  return useMutation({
    mutationFn: (data: ContactFormData) => apiClient.contact.submit(data),
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
