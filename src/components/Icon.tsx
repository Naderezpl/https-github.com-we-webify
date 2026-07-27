import {
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Layers,
  Building2,
  Globe,
  Lightbulb,
  Palmtree,
  Music,
  PartyPopper,
  Sparkle,
  Gem,
  ShieldCheck,
  Puzzle,
  WandSparkles,
  Flame,
  Star,
  Target,
  Mountain,
  Box,
  ShoppingBag,
  Users,
  Radar,
  Radio,
  Check,
  BookOpen,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ICON_REGISTRY: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Layers,
  Building2,
  Globe,
  Lightbulb,
  Palmtree,
  Music,
  PartyPopper,
  Sparkle,
  Gem,
  ShieldCheck,
  Puzzle,
  WandSparkles,
  Flame,
  Star,
  Target,
  Mountain,
  Box,
  ShoppingBag,
  Users,
  Radar,
  Radio,
  Check,
  BookOpen,
  ArrowRight,
  ChevronDown,
};

export const AVAILABLE_ICON_NAMES = Object.keys(ICON_REGISTRY).sort();

export type IconName = keyof typeof ICON_REGISTRY;

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
  fallback?: string;
};

export function Icon({ name, fallback = "Check", ...rest }: IconProps) {
  const Comp = ICON_REGISTRY[name] ?? ICON_REGISTRY[fallback] ?? Check;
  return <Comp {...rest} />;
}
