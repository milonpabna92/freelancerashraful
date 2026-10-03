export interface Project {
  id: string;
  title: string;
  category: 'branding' | 'print' | 'packaging' | 'social' | 'retouching';
  categoryLabel: string;
  year: string;
  client: string;
  location?: string;
  image: string;
  summary: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  tools: string[];
  colorProfile: 'CMYK (FOGRA39)' | 'RGB (sRGB)' | 'Pantone + CMYK';
  aspectRatio?: 'wide' | 'standard' | 'tall';
  featured?: boolean;
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
