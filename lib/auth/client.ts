import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { publicEnv } from "@/lib/env/public-env";
import type { auth } from "@/lib/auth/auth";

const authClient = createAuthClient({
  baseURL: publicEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  verifyEmail,
  sendVerificationEmail,
  resetPassword,
  requestPasswordReset,
} = authClient;
