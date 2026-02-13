import { NextRequest, NextResponse } from "next/server";
import { ApiError, TranslatableError } from "./translatable-error";
import { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";

type Context = Parameters<AppRouteHandlerFn>[1];

export type ApiHandler = (request: NextRequest, context: Context) => Promise<Response>;

export type FlexibleApiHandler<T = unknown> = (request: NextRequest, context: Context) => Promise<T | Response | void>;

export function asyncHandler<T = unknown>(handler: FlexibleApiHandler<T>): ApiHandler {
  return async (request: NextRequest, context: Context) => {
    try {
      const result = await handler(request, context);

      if (result instanceof Response) {
        return result;
      }

      if (result === undefined) {
        return new Response(null, { status: 204 });
      }

      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof TranslatableError) {
        console.log("error", error.code, JSON.stringify(error.params), error);

        return NextResponse.json(
          {
            code: error.code,
            params: error.params,
          } satisfies ApiError,
          { status: error.status },
        );
      }

      console.error("[API Error]", error);

      return NextResponse.json(
        {
          code: "errors.generic",
        } satisfies ApiError,
        { status: 500 },
      );
    }
  };
}
