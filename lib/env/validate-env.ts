import { ZodSchema } from "zod";

export function validateEnv<T>(schema: ZodSchema<T>, source: unknown): T {
  const { success, data, error } = schema.safeParse(source);

  if (success) {
    return data;
  }

  const errorMessages = error.issues.map((err) => {
    return `${err.path.join(".")}: ${err.message}`;
  });

  throw new Error(`Environment validation failed:\n${errorMessages.join("\n")}`);
}
