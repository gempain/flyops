import { NextRequest } from "next/server";
import { TranslatableError } from "@/lib/api/translatable-error";
import { privateEnv } from "@/lib/env/private-env";
import { role } from "@/lib/auth/role";
import { userServerSession } from "@/lib/auth/user-server-session";

export async function sessionGuard() {
  const session = await userServerSession();

  if (!session) {
    throw new TranslatableError("errors.unauthorized", undefined, 401);
  }

  return session;
}

export async function adminGuard() {
  const session = await sessionGuard();

  if (session.user.role !== role.enum.admin) {
    throw new TranslatableError("errors.forbidden", undefined, 403);
  }

  return session;
}

export async function sendcloudGuard(request: NextRequest): Promise<{ verified: boolean }> {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token || token !== privateEnv.SENDCLOUD_WEBHOOK_TOKEN) {
    throw new TranslatableError("errors.unauthorized", undefined, 401);
  }

  return { verified: true };
}
