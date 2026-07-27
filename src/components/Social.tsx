import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  Twitter,
  Youtube,
} from "lucide-react";
import type { SocialLink } from "@/store/siteContent";

// eslint-disable-next-line react-refresh/only-export-components
export const SOCIAL_LABELS: Record<SocialLink["platform"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter / X",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

export function SocialIcon({
  platform,
  className = "h-5 w-5",
}: {
  platform: SocialLink["platform"];
  className?: string;
}) {
  switch (platform) {
    case "instagram":
      return <Instagram className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "twitter":
      return <Twitter className={className} />;
    case "tiktok":
      return <Music2 className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "whatsapp":
      return <MessageCircle className={className} />;
  }
}
