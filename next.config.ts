import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPlausibleProxy } from "next-plausible";
import { z } from "zod";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const env = z
  .object({
    PLAUSIBLE_ANALYTICS_SERVER: z.url().optional(),
  })
  .parse(process.env);

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.hbs": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.hbs$/,
      type: "asset/source",
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.stripe.com",
      },
    ],
  },
};

export default withPlausibleProxy({
  subdirectory: "obs",
  scriptName: "script",
  customDomain: env.PLAUSIBLE_ANALYTICS_SERVER,
})(withNextIntl(nextConfig));
