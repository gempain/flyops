"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { publicEnv } from "@/lib/env/public-env";

interface RecaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  onErrored?: () => void;
}

export const Recaptcha = forwardRef<ReCAPTCHA, RecaptchaProps>(({ onChange, onExpired, onErrored }, ref) => {
  return (
    <div className="flex justify-center">
      <ReCAPTCHA
        ref={ref}
        sitekey={publicEnv.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
        onChange={onChange}
        onExpired={onExpired}
        onErrored={onErrored}
      />
    </div>
  );
});

Recaptcha.displayName = "Recaptcha";
