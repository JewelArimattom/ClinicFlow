import {
  Stethoscope,
  Baby,
  Smile,
  ScanFace,
  Bone,
  Eye,
  Ear,
  HeartPulse,
  Brain,
  Syringe,
  Activity,
  Thermometer,
  Microscope,
  Pill,
  type LucideIcon,
} from "lucide-react";

// Maps specialty slugs/names to distinct Lucide icons
const SPECIALTY_ICON_MAP: Record<string, LucideIcon> = {
  // Slugs
  "general-medicine": Stethoscope,
  "general-physician": Stethoscope,
  "pediatrics": Baby,
  "paediatrics": Baby,
  "dentistry": Smile,
  "dental": Smile,
  "dermatology": ScanFace,
  "skin": ScanFace,
  "orthopedics": Bone,
  "orthopaedics": Bone,
  "ophthalmology": Eye,
  "eye-care": Eye,
  "ent": Ear,
  "ear-nose-throat": Ear,
  "cardiology": HeartPulse,
  "heart": HeartPulse,
  "neurology": Brain,
  "gynecology": Activity,
  "gynaecology": Activity,
  "obstetrics": Activity,
  "ob-gyn": Activity,
  "vaccination": Syringe,
  "immunology": Syringe,
  "internal-medicine": Thermometer,
  "pathology": Microscope,
  "diagnostics": Microscope,
  "pharmacy": Pill,
};

// Maps display names (case-insensitive)
const SPECIALTY_NAME_MAP: Record<string, LucideIcon> = {
  "general medicine": Stethoscope,
  "general physician": Stethoscope,
  "pediatrics": Baby,
  "paediatrics": Baby,
  "dentistry": Smile,
  "dental care": Smile,
  "dermatology": ScanFace,
  "orthopedics": Bone,
  "orthopaedics": Bone,
  "ophthalmology": Eye,
  "eye care": Eye,
  "ent": Ear,
  "cardiology": HeartPulse,
  "neurology": Brain,
  "gynecology": Activity,
  "gynaecology": Activity,
  "obstetrics & gynecology": Activity,
  "vaccination": Syringe,
  "internal medicine": Thermometer,
  "pathology": Microscope,
  "diagnostics": Microscope,
};

interface SpecialtyIconProps {
  slug?: string;
  name?: string;
  className?: string;
  strokeWidth?: number;
}

export function SpecialtyIcon({ slug, name, className = "w-6 h-6", strokeWidth = 1.75 }: SpecialtyIconProps) {
  let IconComponent: LucideIcon = Stethoscope; // fallback

  if (slug && SPECIALTY_ICON_MAP[slug]) {
    IconComponent = SPECIALTY_ICON_MAP[slug];
  } else if (name) {
    const normalized = name.toLowerCase().trim();
    if (SPECIALTY_NAME_MAP[normalized]) {
      IconComponent = SPECIALTY_NAME_MAP[normalized];
    }
  }

  return <IconComponent className={className} strokeWidth={strokeWidth} />;
}

export function getSpecialtyIcon(slug?: string, name?: string): LucideIcon {
  if (slug && SPECIALTY_ICON_MAP[slug]) {
    return SPECIALTY_ICON_MAP[slug];
  }
  if (name) {
    const normalized = name.toLowerCase().trim();
    if (SPECIALTY_NAME_MAP[normalized]) {
      return SPECIALTY_NAME_MAP[normalized];
    }
  }
  return Stethoscope;
}
