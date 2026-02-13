import Stripe from "stripe";
import dotenv from "dotenv";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { ProductMetadata } from "@/lib/schemas/product-metadata-schema";

const $env = z.object({
  STRIPE_SECRET_KEY: z.string(),
});

dotenv.config({ path: ".env.test", override: true });
const srcEnv = $env.parse(process.env);

const stripe = new Stripe(srcEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

interface ProductTranslations {
  title: {
    fr: string;
    en: string;
    de: string;
    nl: string;
  };
  description: {
    fr: string;
    en: string;
    de: string;
    nl: string;
  };
}

(async () => {
  const translationsData = JSON.parse(readFileSync("tmp2.json", "utf-8")) as Record<string, ProductTranslations>;

  for (const [productId, translations] of Object.entries(translationsData)) {
    try {
      console.log(`\nUpdating product ${productId}...`);

      await stripe.products.update(productId, {
        metadata: {
          name_en: translations.title.en,
          name_fr: translations.title.fr,
          name_de: translations.title.de,
          name_nl: translations.title.nl,
          description_en: translations.description.en,
          description_fr: translations.description.fr,
          description_de: translations.description.de,
          description_nl: translations.description.nl,
        } satisfies Partial<ProductMetadata>,
      });

      console.log(`✅ Successfully updated ${productId}`);
    } catch (error) {
      console.error(`❌ Failed to update ${productId}:`, error);
    }
  }

  console.log("\n🎉 All products updated!");
})();
