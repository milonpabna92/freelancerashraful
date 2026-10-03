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

export interface Experience {
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
