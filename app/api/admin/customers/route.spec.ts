import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { stripe } from "@/lib/stripe/client";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/stripe/client", () => ({
  stripe: {
    customers: {
      search: vi.fn(),
    },
  },
}));

function makeRequest(query: Record<string, string>) {
  const searchParams = new URLSearchParams(query);
  return {
    json: async () => ({}),
    nextUrl: { searchParams },
  } as unknown as NextRequest;
}

describe("GET /api/admin/customers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns customers for admin", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user_1", role: "admin" },
    } as any);

    vi.mocked(stripe.customers.search).mockResolvedValue({
      data: [
        {
          id: "cus_1",
          name: "John Doe",
          email: "john@example.com",
          created: 1234567890,
          metadata: { role: "user" },
        },
      ],
      total_count: 1,
    } as any);

    const req = makeRequest({ page: "1", limit: "10" });
    const res = await GET(req, {} as any);
    const json = await res.json();

    expect(json.customers).toBeDefined();
    expect(json.customers[0]).toMatchObject({
      id: "cus_1",
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("searches customers by name", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user_1", role: "admin" },
    } as any);

    vi.mocked(stripe.customers.search).mockResolvedValue({
      data: [],
      total_count: 0,
    } as any);

    const req = makeRequest({ page: "1", limit: "10", search: "John" });
    await GET(req, {} as any);

    expect(stripe.customers.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining('name ~"John"'),
      }),
    );
  });

  it("filters customers by role", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user_1", role: "admin" },
    } as any);

    vi.mocked(stripe.customers.search).mockResolvedValue({
      data: [],
      total_count: 0,
    } as any);

    const req = makeRequest({ page: "1", limit: "10", role: "revendeur" });
    await GET(req, {} as any);

    expect(stripe.customers.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringContaining("metadata['role']: 'revendeur'"),
      }),
    );
  });

  it("requires admin role", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: "user_1", role: "user" },
    } as any);

    const req = makeRequest({ page: "1", limit: "10" });
    const res = await GET(req, {} as any);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.code).toBe("errors.forbidden");
  });
});
