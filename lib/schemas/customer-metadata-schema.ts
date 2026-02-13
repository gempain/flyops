import { z } from "zod";

export const $customerRoleEnum = z.union([z.literal("revendeur"), z.literal("particulier")]);

export type CustomerRoleEnum = z.infer<typeof $customerRoleEnum>;

export const $customerRole = z.union([$customerRoleEnum, z.string()]).optional();
