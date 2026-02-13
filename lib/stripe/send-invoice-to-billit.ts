import { privateEnv } from "@/lib/env/private-env";
import { emailClient } from "@/lib/email/email-client";

export async function sendInvoiceToBillit(pdfUrl: string) {
  if (!privateEnv.BILLIT_EMAIL) {
    console.warn(`[Webhook] BILLIT_EMAIL is not configured. Skipping sending pdf ${pdfUrl} to Billit.`);
    return;
  }

  const response = await fetch(pdfUrl);
  if (!response.ok) {
    console.error("[Webhook] Failed to download invoice PDF:", response.statusText);
    return;
  }

  const arrayBuffer = await response.arrayBuffer();
  const pdfBuffer = Buffer.from(arrayBuffer);

  await emailClient.sendMail({
    from: privateEnv.SMTP_FROM,
    to: privateEnv.BILLIT_EMAIL,
    subject: "New invoice",
    text: "Please find the invoice attached.",
    attachments: [
      {
        filename: `file.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
