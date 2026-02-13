import { TranslatableError } from "@/lib/api/translatable-error";
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
