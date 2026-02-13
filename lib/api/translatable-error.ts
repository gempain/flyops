import { z } from "zod";

const $ErrorPafams = z.any().optional();

type ErrorParams = z.infer<typeof $ErrorPafams>;

export class TranslatableError extends Error {
  constructor(
    public code: string,
    public params?: ErrorParams,
    public status: number = 500,
  ) {
    super(code);
  }
}

export const apiError = z.object({
  code: z.string(),
  params: $ErrorPafams,
});

export type ApiError = z.infer<typeof apiError>;
