/**
 * WhatsApp Notification Utility
 *
 * This module opens a pre-filled WhatsApp message link.
 * For automated server-side sending, integrate Twilio WhatsApp API or 2Factor / Fast2SMS.
 *
 * To use Twilio: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM
 * in your .env.local and call the server-side function via an API route.
 */

export interface AppointmentNotification {
  patientName: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
}

/**
 * Builds the WhatsApp confirmation message text.
 */
export function buildConfirmationMessage(data: AppointmentNotification): string {
  return (
    `Dear ${data.patientName},\n\n` +
    `Your appointment at Shaurya Physiotherapy Clinic has been received.\n\n` +
    `Details:\n` +
    `Date: ${data.preferredDate}\n` +
    `Time: ${data.preferredTime}\n\n` +
    `Clinic Address: Patil Complex, Shop No-5, Sector-9, Khanda Colony, New Panvel (West), 410206\n` +
    `Contact: +91 9673855138\n\n` +
    `Please arrive 10 minutes prior to your appointment. If you need to reschedule, kindly contact us.\n\n` +
    `Thank you,\nShaurya Physiotherapy Clinic`
  );
}

/**
 * Opens a WhatsApp chat with a pre-filled message.
 * This is a client-side fallback when automated server-side sending is not configured.
 */
export function openWhatsAppMessage(data: AppointmentNotification): void {
  const message = buildConfirmationMessage(data);
  const phone = data.phone.replace(/\D/g, "");
  const normalizedPhone = phone.startsWith("91") ? phone : `91${phone}`;
  const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
}

/**
 * Server-side: Send WhatsApp message via Twilio (use in API route).
 * Uncomment and configure TWILIO env vars to enable.
 *
 * import twilio from 'twilio';
 * export async function sendWhatsAppViaTwilio(data: AppointmentNotification) {
 *   const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
 *   const message = buildConfirmationMessage(data);
 *   return client.messages.create({
 *     from: process.env.TWILIO_WHATSAPP_FROM,
 *     to: `whatsapp:+91${data.phone}`,
 *     body: message,
 *   });
 * }
 */
