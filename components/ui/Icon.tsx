import {
  // ————— film & production —————
  Clapperboard, Camera, Video, Film, Aperture, Focus, Mic, Music, Radio, Projector,
  Radar, Tv, MonitorPlay, Scissors, Layers, Play,
  // ————— design & brand —————
  Palette, Brush, PenTool, Figma, Shapes, Type, Image, Sparkles, Gem, Wand2, Frame,
  // ————— digital & marketing —————
  TrendingUp, Search, Megaphone, Target, MousePointerClick, BarChart3, LineChart,
  PieChart, Globe, Share2, Mail, Send, Rocket, Zap, Award, ThumbsUp, Eye,
  // ————— social —————
  Instagram, Youtube, Linkedin, Twitter, Facebook, MessageCircle,
  // ————— web & tech —————
  Monitor, Smartphone, Code2, Cpu, Database, Cloud, Settings, ShieldCheck, Lock, Gauge,
  // ————— strategy & process —————
  Lightbulb, Compass, Map, Route, ClipboardList, CheckCircle2, Workflow, Puzzle,
  Handshake, Users, UserCheck, Calendar, Clock, FileText, BookOpen, GraduationCap,
  // ————— industries —————
  Building2, Store, ShoppingBag, ShoppingCart, Stethoscope, HeartPulse, Car, Plane,
  Shirt, UtensilsCrossed, Coffee, Hotel, Landmark, Factory, Wheat, Dumbbell, Baby,
  Home, Wrench, Truck, Leaf, Sun, Droplets, Banknote, CreditCard, Briefcase,
  // ————— generic —————
  Box, Star, Heart, Flame, Crown, Trophy, Tag, Bookmark, Flag, Info,
  type LucideProps,
} from "lucide-react";

/**
 * Icons available to CMS-driven fields (services, industries, categories,
 * workflow steps, about-page values).
 *
 * Grouped only for readability here — any name works in any field. Adding an
 * icon means importing it above and adding it to its group; the admin dropdowns
 * and the icon reference page both read from ICON_GROUPS, so nothing else has
 * to be touched.
 */
export const ICON_GROUPS: { label: string; names: string[] }[] = [
  {
    label: "فیلم و پروداکشن",
    names: ["Clapperboard", "Camera", "Video", "Film", "Aperture", "Focus", "Mic", "Music", "Radio", "Projector", "Radar", "Tv", "MonitorPlay", "Scissors", "Layers", "Play"],
  },
  {
    label: "طراحی و برندینگ",
    names: ["Palette", "Brush", "PenTool", "Figma", "Shapes", "Type", "Image", "Sparkles", "Gem", "Wand2", "Frame"],
  },
  {
    label: "دیجیتال مارکتینگ",
    names: ["TrendingUp", "Search", "Megaphone", "Target", "MousePointerClick", "BarChart3", "LineChart", "PieChart", "Globe", "Share2", "Mail", "Send", "Rocket", "Zap", "Award", "ThumbsUp", "Eye"],
  },
  {
    label: "شبکه‌های اجتماعی",
    names: ["Instagram", "Youtube", "Linkedin", "Twitter", "Facebook", "MessageCircle"],
  },
  {
    label: "وب و تکنولوژی",
    names: ["Monitor", "Smartphone", "Code2", "Cpu", "Database", "Cloud", "Settings", "ShieldCheck", "Lock", "Gauge"],
  },
  {
    label: "استراتژی و فرایند",
    names: ["Lightbulb", "Compass", "Map", "Route", "ClipboardList", "CheckCircle2", "Workflow", "Puzzle", "Handshake", "Users", "UserCheck", "Calendar", "Clock", "FileText", "BookOpen", "GraduationCap"],
  },
  {
    label: "صنایع",
    names: ["Building2", "Store", "ShoppingBag", "ShoppingCart", "Stethoscope", "HeartPulse", "Car", "Plane", "Shirt", "UtensilsCrossed", "Coffee", "Hotel", "Landmark", "Factory", "Wheat", "Dumbbell", "Baby", "Home", "Wrench", "Truck", "Leaf", "Sun", "Droplets", "Banknote", "CreditCard", "Briefcase"],
  },
  {
    label: "عمومی",
    names: ["Box", "Star", "Heart", "Flame", "Crown", "Trophy", "Tag", "Bookmark", "Flag", "Info"],
  },
];

const MAP: Record<string, React.ComponentType<LucideProps>> = {
  Clapperboard, Camera, Video, Film, Aperture, Focus, Mic, Music, Radio, Projector,
  Radar, Tv, MonitorPlay, Scissors, Layers, Play,
  Palette, Brush, PenTool, Figma, Shapes, Type, Image, Sparkles, Gem, Wand2, Frame,
  TrendingUp, Search, Megaphone, Target, MousePointerClick, BarChart3, LineChart,
  PieChart, Globe, Share2, Mail, Send, Rocket, Zap, Award, ThumbsUp, Eye,
  Instagram, Youtube, Linkedin, Twitter, Facebook, MessageCircle,
  Monitor, Smartphone, Code2, Cpu, Database, Cloud, Settings, ShieldCheck, Lock, Gauge,
  Lightbulb, Compass, Map, Route, ClipboardList, CheckCircle2, Workflow, Puzzle,
  Handshake, Users, UserCheck, Calendar, Clock, FileText, BookOpen, GraduationCap,
  Building2, Store, ShoppingBag, ShoppingCart, Stethoscope, HeartPulse, Car, Plane,
  Shirt, UtensilsCrossed, Coffee, Hotel, Landmark, Factory, Wheat, Dumbbell, Baby,
  Home, Wrench, Truck, Leaf, Sun, Droplets, Banknote, CreditCard, Briefcase,
  Box, Star, Heart, Flame, Crown, Trophy, Tag, Bookmark, Flag, Info,
};

/** Flat, ordered list of every usable icon name — powers the admin dropdowns. */
export const ICON_NAMES: string[] = ICON_GROUPS.flatMap((g) => g.names);

/** True if `name` resolves to a real icon (rather than silently falling back). */
export const isKnownIcon = (name: string) => name in MAP;

/** Render a lucide icon by name (used for CMS-driven service/industry icons). */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = MAP[name] ?? Box;
  return <C {...props} />;
}
