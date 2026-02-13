import { TranslatableError } from "@/lib/api/translatable-error";

export function getTranslatedError(
  error: TranslatableError,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  if (error.code) {
    return t(error.code, error.params);
  }

  return t("errors.generic");
}
