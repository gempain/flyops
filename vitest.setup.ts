import "@testing-library/jest-dom";
import { vi } from "vitest";

process.env = {
  ...process.env,
  NODE_ENV: "test",
  SMTP_HOST: "localhost",
  SMTP_PORT: "1025",
  SMTP_USER: "",
  SMTP_PASSWORD: "",
  ADMIN_EMAIL: "admin@test.com",
  EMAIL_SIGNATURE: "Test Signature",
  ADMIN_EMAIL_LOCALE: "en",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/test_db",
  SMTP_FROM: "postmaster@test.com",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "stripePublicKey",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "betterAuthSecretbetterAuthSecretbetterAuthSecret",
  GOOGLE_RECAPTCHA_SECRET_KEY: "recaptchaSecretKey",
};

vi.mock("next-intl", async () => {
  return {
    useTranslations: () => (key: string) => key,
    useLocale: () => "en",
  };
});
