import nodemailer from "nodemailer";
import { privateEnv } from "@/lib/env/private-env";

export const emailClient = nodemailer.createTransport({
  host: privateEnv.SMTP_HOST,
  port: privateEnv.SMTP_PORT,
  secure: privateEnv.SMTP_PORT === 465,
  from: privateEnv.SMTP_FROM,
  auth:
    privateEnv.SMTP_USER && privateEnv.SMTP_PASSWORD
      ? {
          user: privateEnv.SMTP_USER,
          pass: privateEnv.SMTP_PASSWORD,
        }
      : undefined,
});
