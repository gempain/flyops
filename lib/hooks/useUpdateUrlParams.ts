import { usePathname, useRouter } from "@/i18n/routing";
import { useCallback } from "react";

interface BaseFilters {
  page: number;
  limit: number;
  search?: string;
  [key: string]: string | number | undefined;
}

interface UpdateUrlParamsOptions {
  defaultLimit?: number;
}

export function useUpdateUrlParams<T extends BaseFilters>(options: UpdateUrlParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { defaultLimit = 10 } = options;

  const updateUrlParams = useCallback(
    (filters: T) => {
      const params = new URLSearchParams();

      if (filters.page > 1) {
        params.set("page", filters.page.toString());
      }

      if (filters.limit !== defaultLimit) {
        params.set("limit", filters.limit.toString());
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (key !== "page" && key !== "limit" && value) {
          params.set(key, value.toString());
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl);
    },
    [router, pathname, defaultLimit],
  );

  return updateUrlParams;
}
