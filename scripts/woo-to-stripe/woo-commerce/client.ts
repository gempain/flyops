import axios from "axios";
import { env } from "@/scripts/woo-to-stripe/env";

export const woocommerce = axios.create({
  baseURL: "https://v1.noatec.eu/wp-json/wc/v3",
  headers: {
    // Woocommerce: Woocommerce > Settings > Advanced > REST API
    Authorization: `Basic ${Buffer.from(`${env.WOOCOMMERCE_PUBLIC_KEY}:${env.WOOCOMMERCE_SECRET_KEY}`).toString(
      "base64",
    )}`,
  },
});
