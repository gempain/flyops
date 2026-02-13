import dotenv from "dotenv";
import Stripe from "stripe";
import { z } from "zod";
import { validateProductMetadata } from "@/lib/schemas/product-metadata-schema";

dotenv.config({
  // path: ".env.test",
  // path: ".env.preview",
  path: ".env.prod",
});

const env = z
  .object({
    STRIPE_SECRET_KEY: z.string(),
  })
  .parse(process.env);

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-11-17.clover" });

(async () => {
  const products = await stripe.products.list({ limit: 100 });

  for (const product of products.data) {
    await validateProductMetadata(product);

    await stripe.products.update(product.id, {
      metadata: {
        // dimensions_cm: "",
        // color_name: "",
        // original_url: "",
        // stock_status: "",
        // weight_kg: "",
        // image_oblique: "",
        // image_face: "",
        // image_profile: "",
        color: "",
      },
    });
  }

  console.log("done");
})();
