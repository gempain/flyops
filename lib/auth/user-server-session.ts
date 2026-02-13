import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";

export async function userServerSession() {
  const hdrs = await headers();

  return auth.api.getSession({ headers: hdrs });
}
