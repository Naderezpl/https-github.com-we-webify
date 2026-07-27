import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const WEBIFY_WHATSAPP_NUMBER = "96181193419";
export const WEBIFY_WHATSAPP_DISPLAY = "+961 81 193 419";

export function buildWhatsAppLink(
  lines: string | string[],
  number: string = WEBIFY_WHATSAPP_NUMBER
) {
  const body = Array.isArray(lines) ? lines.join("\n") : lines;
  return `https://wa.me/${number}?text=${encodeURIComponent(body)}`;
}

export function buildQuoteLink(context?: string) {
  const intro = context
    ? [
        `*New webify quote request — ${context}*`,
        ``,
        `Hi webify team, I'd like a quote for a website.`,
      ]
    : [
        `*New webify quote request*`,
        ``,
        `Hi webify team, I'd like a quote for a website.`,
      ];

  return buildWhatsAppLink([
    ...intro,
    ``,
    `Name:`,
    `Business / project name:`,
    `Preferred timeline:`,
    `Notes:`,
  ]);
}
