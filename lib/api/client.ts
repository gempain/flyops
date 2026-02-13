import { z } from "zod";
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { apiError, TranslatableError } from "./translatable-error";
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
