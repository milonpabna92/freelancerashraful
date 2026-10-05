export interface Project {
  id: string;
  title: string;
  category: 'branding' | 'print' | 'packaging' | 'social' | 'retouching' | string;
  categoryLabel: string;
  year?: string;
  client?: string;
  location?: string;
  image: string;
  summary: string; // Project Description (supports Markdown & plain links)
  linkUrl?: string; // Direct Hyperlink URL (e.g., Behance, Live Demo)
  linkLabel?: string; // Hyperlink button label (e.g., "View on Behance")
  challenge?: string;
  solution?: string;
  deliverables?: string[];
  tools?: string[];
  colorProfile?: string;
  aspectRatio?: 'wide' | 'standard' | 'tall';
  featured?: boolean;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  tools: string;
  iconName: 'PenTool' | 'Printer' | 'Megaphone' | 'Sparkles' | 'Palette' | 'Layers' | 'Image' | 'Monitor';
  colorTheme: 'purple' | 'amber' | 'orange' | 'teal' | 'blue' | 'rose';
}

export interface SkillBarItem {
  id: string;
  name: string;
  percentage: number;
}

export interface PrepressItem {
  id: string;
  title: string;
  desc: string;
}

export interface HeroStatItem {
  title: string;
  subtitle: string;
}

export interface LanguageItem {
  name: string;
  level: string;
  proficiency: number;
}

export interface HobbyItem {
  name: string;
  description: string;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  type: string;
  achievements: string[];
  toolsUsed: string[];
}

export interface Education {
  id?: string;
  degree: string;
  institute: string;
  board: string;
  group: string;
  result: string;
  passingYear: string;
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: string; // e.g. "Expert", "Advanced"
    percentage: number;
    description: string;
  }[];
}

export interface ReferencePerson {
  name: string;
  role: string;
  phone: string;
  location: string;
  relationship: string;
}

