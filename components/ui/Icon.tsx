import {
  Clapperboard,
  Camera,
  Box,
  Monitor,
  Palette,
  Figma,
  TrendingUp,
  Search,
  Instagram,
  Target,
  Stethoscope,
  Car,
  Shirt,
  Rocket,
  Building2,
  UtensilsCrossed,
  Sparkles,
  Cpu,
  Landmark,
  Plane,
  GraduationCap,
  ShoppingBag,
  type LucideProps,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  Clapperboard,
  Camera,
  Box,
  Monitor,
  Palette,
  Figma,
  TrendingUp,
  Search,
  Instagram,
  Target,
  Stethoscope,
  Car,
  Shirt,
  Rocket,
  Building2,
  UtensilsCrossed,
  Sparkles,
  Cpu,
  Landmark,
  Plane,
  GraduationCap,
  ShoppingBag,
};

/** Render a lucide icon by name (used for CMS-driven service/industry icons). */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = MAP[name] ?? Box;
  return <C {...props} />;
}
