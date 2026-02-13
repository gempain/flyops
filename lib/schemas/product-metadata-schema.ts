import { z } from "zod";
import { TranslatableError } from "@/lib/api/translatable-error";
import Stripe from "stripe";
import { Locale } from "@/lib/locale";

const $productCategory = z.union([z.literal("cushion"), z.literal("cover"), z.literal("spare"), z.literal("other")]);

export type ProductCategory = z.infer<typeof $productCategory>;

const productMetadataSchema = z.object({
  color_hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color code"),
  length_cm: z.coerce.number().min(0),
  width_cm: z.coerce.number().min(0),
  height_cm: z.coerce.number().min(0),
  weight_g: z.coerce.number().min(0),
  images: z.string().transform((str) => str.split(",")),
  stock_quantity: z.coerce.number().optional().default(0),
  category: $productCategory.optional().default("other"),
  name_en: z.string().optional(),
  name_fr: z.string().optional(),
  name_de: z.string().optional(),
  name_nl: z.string().optional(),
  description_en: z.string().optional(),
  description_fr: z.string().optional(),
  description_de: z.string().optional(),
  description_nl: z.string().optional(),
});

export type ProductMetadata = z.infer<typeof productMetadataSchema>;

export function validateProductMetadata(product: Stripe.Product): ProductMetadata {
  const { data, success, error } = productMetadataSchema.safeParse(product.metadata);

  if (!success) {
    throw new TranslatableError("errors.invalidMetadata", {
      type: "product",
      id: product.id,
      validation: error.issues.map((i) => `${i.path}: ${i.message}`).join("\n"),
    });
  }

  return data;
}

export function getTranslatedProductName(product: Stripe.Product, metadata: ProductMetadata, locale: Locale): string {
  const translationKey = `name_${locale}` as keyof ProductMetadata;
  const translation = metadata[translationKey];

  if (translation && typeof translation === "string") {
    return translation;
  }

  return product.name;
}

export function getTranslatedProductDescription(
  product: Stripe.Product,
  metadata: ProductMetadata,
  locale: Locale,
): string {
  const translationKey = `description_${locale}` as keyof ProductMetadata;
  const translation = metadata[translationKey];

  if (translation && typeof translation === "string") {
    return translation;
  }

  return product.description || "";
}
