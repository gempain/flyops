import { z } from "zod";
import { NextRequest } from "next/server";
import { TranslatableError } from "@/lib/api/translatable-error";
import { ApiHandler, asyncHandler } from "@/lib/api/handler-helpers";

type HandlerParams<Body, Params, Query, Auth> = {
  auth: Auth;
  body: Body;
  params: Params;
  query: Query;
  request: NextRequest;
};

type GuardFunction<T> = (request: NextRequest) => Promise<T>;

interface RouteOptions<Body, Params, Query, Resp, Auth> {
  auth?: GuardFunction<Auth>;
  validators?: {
    body?: z.ZodSchema<Body>;
    params?: z.ZodSchema<Params>;
    query?: z.ZodSchema<Query>;
    response?: z.ZodSchema<Resp>;
  };
  handler: (data: HandlerParams<Body, Params, Query, Auth>) => Promise<Resp>;
}

export function createRoute<Body = unknown, Params = unknown, Query = unknown, Resp = unknown, GuardResult = null>({
  auth,
  handler,
  validators,
}: RouteOptions<Body, Params, Query, Resp, GuardResult>): ApiHandler {
  return asyncHandler<Resp>(async (request: NextRequest, context) => {
    let authResult: GuardResult = null as GuardResult;
    if (auth) {
      authResult = await auth(request);
    }

    let body: Body = undefined as Body;
    if (validators?.body) {
      const payload = await request.json();
      const validatedBody = validators.body.safeParse(payload, {
        reportInput: true,
      });
      if (!validatedBody.success) {
        throw new TranslatableError("errors.invalidRequestBody", { validation: validatedBody.error.issues }, 400);
      }
      body = validatedBody.data;
    }

    let params: Params = undefined as Params;
    if (validators?.params && context?.params) {
      const resolvedParams = await context.params;
      const validatedParams = validators.params.safeParse(resolvedParams, {
        reportInput: true,
      });
      if (!validatedParams.success) {
        throw new TranslatableError("errors.invalidRequestParams", { validation: validatedParams.error.issues }, 400);
      }
      params = validatedParams.data;
    }

    let query: Query = undefined as Query;
    if (validators?.query) {
      const searchParams = request.nextUrl.searchParams;
      const queryObject: Record<string, string> = {};
      searchParams.forEach((value: string, key: string) => {
        queryObject[key] = value;
      });
      const validatedQuery = validators.query.safeParse(queryObject, {
        reportInput: true,
      });
      if (!validatedQuery.success) {
        throw new TranslatableError("errors.invalidQueryParameters", { validation: validatedQuery.error.issues }, 400);
      }
      query = validatedQuery.data;
    }

    return handler({
      auth: authResult,
      body,
      params,
      query,
      request,
    });
  });
}
