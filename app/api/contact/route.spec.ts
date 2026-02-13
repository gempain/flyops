import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { verifyRecaptcha } from "@/lib/captcha/verify-recaptcha";
import { sendAdminNotification } from "@/lib/email/templates/admin-notification/admin-notification";
import { sendUserConfirmation } from "@/lib/email/templates/user-confirmation/user-confirmation";

vi.mock("@/lib/email/templates/admin-notification/admin-notification", () => ({
  sendAdminNotification: vi.fn(),
}));

vi.mock("@/lib/email/templates/user-confirmation/user-confirmation", () => ({
  sendUserConfirmation: vi.fn(),
}));

vi.mock("@/lib/captcha/verify-recaptcha", () => ({
  verifyRecaptcha: vi.fn(),
}));

vi.mock("@/lib/env/private-env", async (importOriginal) => {
  const originalModule = (await importOriginal()) as any;
  return {
    ...originalModule,
    privateEnv: {
      ...originalModule.privateEnv,
      ADMIN_EMAIL: "admin@test.com",
      ADMIN_EMAIL_LOCALE: "en",
    },
  };
});

function makeRequest(body: unknown) {
  return {
    json: async () => body,
    nextUrl: { searchParams: new URLSearchParams() },
  } as unknown as NextRequest;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends contact form emails successfully with valid captcha", async () => {
    vi.mocked(verifyRecaptcha).mockResolvedValue(true);

    const body = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      subject: "Test Subject",
      message: "Test message",
      locale: "en",
      captchaToken: "valid-token",
    };

    const req = makeRequest(body);
    const res = await POST(req, {} as any);
    const json = await res.json();

    expect(verifyRecaptcha).toHaveBeenCalledWith("valid-token");
    expect(sendAdminNotification).toHaveBeenCalledWith({
      to: "admin@test.com",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      subject: "Test Subject",
      message: "Test message",
      locale: "en",
    });
    expect(sendUserConfirmation).toHaveBeenCalledWith({
      to: "john@example.com",
      name: "John Doe",
      message: "Test message",
      locale: "en",
    });
    expect(json).toEqual({ success: true, message: "Email sent successfully" });
  });

  it("returns error when captcha is invalid", async () => {
    vi.mocked(verifyRecaptcha).mockResolvedValue(false);

    const body = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      subject: "Test Subject",
      message: "Test message",
      locale: "en",
      captchaToken: "invalid-token",
    };

    const req = makeRequest(body);
    const res = await POST(req, {} as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe("errors.invalidCaptcha");
  });

  it("validates required fields", async () => {
    const invalidBody = {
      name: "John Doe",
      email: "invalid-email",
      locale: "en",
    };

    const req = makeRequest(invalidBody);
    const res = await POST(req, {} as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.code).toBe("errors.invalidRequestBody");
  });
});
