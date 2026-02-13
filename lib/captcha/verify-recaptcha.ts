import { privateEnv } from "@/lib/env/private-env";

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: privateEnv.GOOGLE_RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaResponse = await response.json();
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
