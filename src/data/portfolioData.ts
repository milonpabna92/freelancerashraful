import { Experience, Education, Project, SkillCategory, ReferencePerson, ServiceItem, SkillBarItem, PrepressItem } from '../types';

import userPhotoImg from '../assets/images/ashraful_executive_portrait_1790863444217.jpg';
import brandingImg from '../assets/images/showcase_branding_identity_1790861697455.jpg';
import signageImg from '../assets/images/showcase_outdoor_signage_1790861710495.jpg';
import packagingImg from '../assets/images/showcase_packaging_print_1790861723034.jpg';
import socialImg from '../assets/images/showcase_social_campaign_1790861737757.jpg';

export const personalInfo = {
  brandName: "Ashraful",
  greeting: "Hi, I'm",
  name: "Md. Ashraful Islam",
  role: "Senior Graphic Designer",
  footerSubtitle: "Pre-Press & Offset Printing Specialist",
  status: "Available for freelance & full-time roles",
  email: "milonpabna92@gmail.com",
  phone: "+880 1577 564 797",
  phoneRaw: "+8801577564797",
  whatsappUrl: "https://wa.me/8801577564797",
  presentAddress: "Banglabazar, Lanchghat, Pabna Sadar, Pabna, Bangladesh",
  permanentAddress: "Vill: Charkushakhali, P.O: Asutuspur, UP: Pabna Sadar, Dist: Pabna",
  studioAddress: "AR Digital Sign · Near to Boro Bridge, Pabna",
  behanceUrl: "https://www.behance.net/ashraful0709",
  behanceHandle: "ashraful0709",
  facebookUrl: "https://www.facebook.com/ashrafulislam0709",
  facebookHandle: "ashrafulislam0709",
  avatarImage: userPhotoImg,
  // Google Drive link for CV download
  googleDriveCvUrl: "https://drive.google.com/file/d/1B9p8Kx9_Ashraful_Islam_Graphic_Designer_CV/view?usp=sharing",
  careerObjective:
    "A passionate and results-driven Graphic Designer with experience in creating visually appealing designs for digital and print media. Skilled in developing creative concepts, maintaining brand identity, and delivering high-quality design solutions while continuously improving my skills in a professional environment.",
  summary:
    "Senior Graphic Designer with over 7 years of specialized expertise across brand identity architecture, precision pre-press offset printing setup, commercial signage, high-impact packaging, and social media creative campaigns. Proven track record at AR Digital Sign and Sunam Graph in Pabna.",
  aboutStory:
    "With a specialized journey through commercial printing houses and creative agencies in Pabna, Md. Ashraful Islam merges high-aesthetic vector design in Adobe Illustrator with the technical exactness needed for 4-color offset pre-press, die-cutting, spot finishes, and large-scale architectural digital signage.",
  declarationText:
    "I hereby declare that all the information provided in this CV is true, accurate, and complete to the best of my knowledge and belief. I take full responsibility for the authenticity of the information mentioned above and assure that I will perform my duties with sincerity, dedication, and professionalism.",
  badgeValue: "7+",
  badgeTitle: "Years Active",
  badgeSubtitle: "AR Digital Sign",
  heroStats: [
    { title: "8 Years Job", subtitle: "Experience" },
    { title: "650+ Projects", subtitle: "Completed" },
    { title: "Online 24/7", subtitle: "Client Support" },
  ],
  stats: [
    { label: "Years Experience", value: "7+" },
    { label: "Completed Projects", value: "650+" },
    { label: "Offset & Print Runs", value: "400+" },
    { label: "Client Satisfaction", value: "100%" },
  ],
  personalDetails: {
    fatherName: "Late Abdul Aziz",
    motherName: "Late Khadiza Begum",
    dob: "January 12, 1992",
    religion: "Islam",
    maritalStatus: "Married",
    nationality: "Bangladeshi (By Birth)",
    bloodGroup: "O+ve",
  },
  languages: [
    { name: "Bangla", level: "Native / First Language", proficiency: 100 },
    { name: "English", level: "Professional Working Proficiency", proficiency: 85 },
    { name: "Hindi", level: "Conversational", proficiency: 75 },
  ],
  hobbies: [
    { name: "Traveling", description: "Exploring heritage sites, local architecture, and vibrant urban textures across Bangladesh." },
    { name: "Graphic Design", description: "Experimenting with experimental typography, vector illustrations, and brand systems." },
    { name: "Photography", description: "Street photography, architectural framing, and documentary texture capture." },
    { name: "Cooking", description: "Traditional Bengali cuisine and culinary plating aesthetics." },
    { name: "Flute Playing", description: "Classical Indian bamboo flute melodies for creative meditation and mindfulness." },
    { name: "Cinema", description: "Analyzing cinematography, visual storytelling, and color grading in international films." },
  ],
};

export const defaultServices: ServiceItem[] = [
  {
    id: "srv-branding",
    title: "Brand Identity & Logo",
    desc: "Distinctive vector monograms, typography hierarchy, comprehensive brand guidelines, stationery, and corporate identity systems.",
    tools: "Adobe Illustrator",
    iconName: "PenTool",
    colorTheme: "purple",
  },
  {
    id: "srv-prepress",
    title: "Pre-Press & Offset Setup",
    desc: "4-color CMYK process separation, Pantone spot inks, die-cut packaging cartons, trapping, overprint control, and plate exposure files.",
    tools: "Pre-press & Packaging",
    iconName: "Printer",
    colorTheme: "amber",
  },
  {
    id: "srv-signage",
    title: "Outdoor Signage & Flex",
    desc: "Large-format outdoor billboards, architectural digital signs, acrylic 3D letters, backlit flex banners, and vinyl plot production.",
    tools: "AR Digital Sign",
    iconName: "Megaphone",
    colorTheme: "orange",
  },
  {
    id: "srv-social",
    title: "Social Media & Ad Creatives",
    desc: "High-conversion Facebook & Instagram banners, carousel storytelling, digital promotional campaigns, and photo retouching.",
    tools: "Adobe Photoshop",
    iconName: "Sparkles",
    colorTheme: "teal",
  },
];

export const defaultSkillBars: SkillBarItem[] = [
  { id: "sk-1", name: "Adobe Illustrator (Expert)", percentage: 98 },
  { id: "sk-2", name: "Adobe Photoshop (Expert)", percentage: 95 },
  { id: "sk-3", name: "Graphic Design & Brand Identity", percentage: 96 },
  { id: "sk-4", name: "Social Media Creative Design", percentage: 93 },
  { id: "sk-5", name: "Offset Printing Setup & Die-lines", percentage: 95 },
  { id: "sk-6", name: "Color Knowledge & CMYK Separation", percentage: 96 },
  { id: "sk-7", name: "Commercial Signage & Billboards", percentage: 92 },
  { id: "sk-8", name: "Photo Editing & High-End Retouching", percentage: 90 },
];

export const defaultPrepressChecklist: PrepressItem[] = [
  {
    id: "pp-1",
    title: "CMYK Separation & Ink Limits",
    desc: "Raster & vector artwork converted to CMYK (FOGRA39 / GRACoL) with total ink limit (TIC) kept under 300% to prevent press smearing.",
  },
  {
    id: "pp-2",
    title: "Bleed (3mm–5mm) & Safe Margins",
    desc: "Standard 3mm–5mm bleed past trim boundaries to eliminate white edges during precision guillotining, safety margins >= 4mm.",
  },
  {
    id: "pp-3",
    title: "Packaging Die-Lines & Creases",
    desc: "Dedicated spot color vector layers marked as 'Non-Printing' with clear separation between cut lines, creases, and perforations.",
  },
  {
    id: "pp-4",
    title: "Overprint & Micro-Trapping",
    desc: "Enforcing 100% K overprint on fine body typography and setting 0.25pt traps on contrasting color intersections.",
  },
  {
    id: "pp-5",
    title: "Spot UV & Foil Stamping Blocks",
    desc: "Isolated 100% solid vector separation plates for gold/silver foil stamping dies and spot gloss varnish finishes.",
  },
  {
    id: "pp-6",
    title: "Billboard & Signage Scaling",
    desc: "Calibrated raster DPI and 1:1 vector paths for large-format outdoor billboards, backlit acrylic, and flex installations at AR Digital Sign.",
  },
];

export const experiences: Experience[] = [
  {
    role: "Senior Graphic Designer",
    company: "AR Digital Sign",
    location: "Near to Boro Bridge, Abdul Hamid Road, Pabna",
    period: "2022 — Present",
    current: true,
    type: "Full-Time",
    achievements: [
      "Lead all visual creative output for large-scale outdoor signage, corporate billboards, architectural wayfinding, and digital LED display backdrops.",
      "Manage end-to-end pre-press workflows, color separation (CMYK/Pantone), raster image processor (RIP) calibration, and vinyl plot cutting.",
      "Collaborate directly with enterprise clients, local businesses, and municipal projects to deliver impactful visual branding under tight deadlines.",
      "Supervise print quality control, material selection (flex, vinyl, acrylic, backlit fabric), and large-format installation alignments."
    ],
    toolsUsed: ["Adobe Illustrator", "Adobe Photoshop", "Large Format RIP Software", "Offset Pre-press", "CMYK Separation"]
  },
  {
    role: "Graphic Designer",
    company: "Sunam Graph",
    location: "Maksuda Mahal, Abdul Hamid Road, Pabna",
    period: "2019 — 2022",
    current: false,
    type: "Full-Time",
    achievements: [
      "Crafted cohesive corporate brand identities including logos, stationery packages, official publications, brochures, and commercial flyers.",
      "Specialized in offset printing setups: film output preparation, trapping, bleed calibration, die-line design, and spot UV mask creation.",
      "Retouched and color-corrected commercial product photos for catalogue printing and digital distribution.",
      "Maintained strict brand guidelines and delivered visual marketing assets for over 150+ regional business clients."
    ],
    toolsUsed: ["Adobe Illustrator", "Adobe Photoshop", "Offset Plate Planning", "Vector Art", "Typography"]
  }
];

export const educationList: Education[] = [
  {
    degree: "Higher Secondary Certificate (HSC)",
    institute: "Islamia Digri College Pabna",
    board: "Rajshahi",
    group: "Commerce",
    result: "GPA 3.50 (Out of 5.00)",
    passingYear: "2009"
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institute: "Gopal Chandra Institution Pabna",
    board: "Rajshahi",
    group: "Commerce",
    result: "GPA 2.50 (Out of 5.00)",
    passingYear: "2007"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Software & Core Tools",
    skills: [
      {
        name: "Adobe Illustrator",
        level: "Expert",
        percentage: 98,
        description: "Vector illustration, logo systems, brand guidelines, complex path manipulation, typographic hierarchy, die-cut vector templates."
      },
      {
        name: "Adobe Photoshop",
        level: "Expert",
        percentage: 95,
        description: "High-end photo retouching, color grading, frequency separation, complex composites, digital mockups, digital ads."
      },
      {
        name: "Microsoft Office Applications",
        level: "Proficient",
        percentage: 88,
        description: "Word document formatting, PowerPoint pitch decks, Excel data sheets for project budgeting and asset manifests."
      }
    ]
  },
  {
    title: "Print Production & Pre-Press",
    skills: [
      {
        name: "Color Knowledge & Offset Printing Setup",
        level: "Specialist",
        percentage: 96,
        description: "Deep mastery of 4-color process CMYK separation, spot colors (Pantone PMS), ink limit control, trapping, overprint fill, and plate exposure."
      },
      {
        name: "Offset Printing Setup & Die-lines",
        level: "Expert",
        percentage: 94,
        description: "Packaging cartons, folding cartons, embossing blocks, foil stamping matrices, registration marks, bleed margins, and sheet imposition."
      },
      {
        name: "Large Format & Signage Production",
        level: "Expert",
        percentage: 92,
        description: "Backlit flex banners, frosted vinyl, acrylic 3D lettering, billboard scaling, outdoor durability specifications."
      }
    ]
  },
  {
    title: "Design Disciplines",
    skills: [
      {
        name: "Graphic Design & Branding",
        level: "Expert",
        percentage: 96,
        description: "Comprehensive visual identity systems, corporate brand marks, typography selection, color psychology, and brand guideline manuals."
      },
      {
        name: "Digital & Social Media Creative Design",
        level: "Expert",
        percentage: 93,
        description: "High-conversion Facebook and Instagram ad creatives, carousel storytelling, web banners, promotional campaign assets."
      },
      {
        name: "Photo Editing & Retouching",
        level: "Advanced",
        percentage: 92,
        description: "Commercial product clipping, skin texture retouching, lighting restoration, clipping paths, and background manipulation."
      }
    ]
  }
];

export const projects: Project[] = [
  {
    id: "ar-digital-signage",
    title: "Metropolitan Architectural & Outdoor Billboard Signage",
    category: "print",
    categoryLabel: "Signage & Print",
    year: "2024",
    client: "AR Digital Sign Commercial Showcase",
    location: "Abdul Hamid Road, Pabna",
    image: signageImg,
    summary: "Large-format outdoor billboard display and structural signage engineered for maximum street-level legibility, contrast, and high-resolution illumination.",
    challenge: "Developing a massive outdoor display asset that maintains crisp typographic legibility from both high-speed vehicular traffic and pedestrian distances while surviving weather conditions and day-night lighting shifts.",
    solution: "Engineered high-contrast vector assets in Adobe Illustrator, calibrated exact CMYK ink saturation limits for heavy outdoor vinyl substrates, and planned precision tiling seams to ensure seamless on-site mounting.",
    deliverables: [
      "Large-format billboard master vector artwork (48ft x 14ft)",
      "High-resolution RIP pre-flight print files",
      "Nighttime illumination simulation mockup",
      "Mounting spec sheet with seam alignment guides"
    ],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "RIP Print Calibrator"],
    colorProfile: "CMYK (FOGRA39)",
    aspectRatio: "wide",
    featured: true
  },
  {
    id: "apex-brand-identity",
    title: "Apex Corporate Brand Identity & Stationery System",
    category: "branding",
    categoryLabel: "Brand Identity",
    year: "2023",
    client: "Corporate Ventures Group",
    location: "Pabna & Dhaka",
    image: brandingImg,
    summary: "Full visual identity suite encompassing minimal geometric logo mark, embossed stationery, letterheads, corporate collateral, and brand standard book.",
    challenge: "The client needed a timeless, authoritative corporate identity that could bridge traditional offset corporate stationery with modern high-resolution digital screens.",
    solution: "Created a pure geometric monogram anchored by custom typography. Designed dual color palettes featuring deep corporate slate paired with warm warm-gold foil accents, specifying exact Pantone PMS and CMYK values.",
    deliverables: [
      "Primary monogram & wordmark variations",
      "Complete stationery suite (business card, letterhead, envelope)",
      "32-page corporate brand guideline manual",
      "Die-cut presentation folder with spot UV varnish setup"
    ],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "InDesign Setup"],
    colorProfile: "Pantone + CMYK",
    aspectRatio: "standard",
    featured: true
  },
  {
    id: "luxury-packaging-carton",
    title: "Artisanal Retail Packaging & Gold Foil Die-Cut Box",
    category: "packaging",
    categoryLabel: "Packaging & Offset",
    year: "2023",
    client: "Sunam Graph Client Project",
    location: "Pabna",
    image: packagingImg,
    summary: "Luxury retail packaging carton featuring custom die-line geometry, gold foil hot stamping layers, soft-touch matte lamination, and structural fold locking.",
    challenge: "Ensuring zero paper cracking along structural folds on 350 GSM duplex board while aligning micro-registered gold foil stamping with offset printed graphics.",
    solution: "Drafted custom 1:1 vector die-lines with crease and cut layer differentiation. Added 3mm bleed margin across all flaps, adjusted ink traps at interior corners, and created isolated separation plates for the gold foil stamping block.",
    deliverables: [
      "1:1 vector die-cut and crease layout file",
      "Hot foil stamping vector die plate file",
      "3D packaging mockup for client approval",
      "Offset print press check sheet"
    ],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Pre-Press Tools"],
    colorProfile: "CMYK (FOGRA39)",
    aspectRatio: "standard",
    featured: true
  },
  {
    id: "social-media-campaign",
    title: "Urban Taste Multi-Channel Social Marketing Suite",
    category: "social",
    categoryLabel: "Social Media & Ads",
    year: "2024",
    client: "Urban Gourmet & Lifestyle",
    location: "Digital Campaign",
    image: socialImg,
    summary: "High-conversion social media banner campaign and dynamic promotional grid designed for Facebook, Instagram, and web display networks.",
    challenge: "Cutting through busy social media feeds with bold visual hierarchy, mouth-watering product treatments, and clear promotional value propositions within mobile viewports.",
    solution: "Crafted modular banner templates combining high-energy food typography, dynamic drop shadows, and vibrant saturated accents. Optimized visual assets for mobile thumb-stopping power.",
    deliverables: [
      "12 Instagram feed square graphics (1080x1080px)",
      "6 Vertical story & reel promo layouts (1080x1920px)",
      "Facebook cover and carousel promotional cards",
      "Editable design asset templates"
    ],
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    colorProfile: "RGB (sRGB)",
    aspectRatio: "standard",
    featured: true
  }
];

export const referencePerson: ReferencePerson = {
  name: "Md. Khairul Islam Noion",
  role: "UI/UX Designer",
  phone: "01744-132221",
  location: "Banglabazar, Lanchghat, Pabna Sadar, Pabna",
  relationship: "Professional Colleague & Design Collaborator"
};

export const professionalQualifications = [
  "Expertise in Adobe Illustrator and Adobe Photoshop for professional design projects.",
  "Skilled in creating logos, branding materials, social media designs, banners, brochures, and marketing assets.",
  "Strong understanding of typography, color theory, composition, and visual communication.",
  "Experience in preparing designs for both digital platforms and print production.",
  "Ability to develop creative concepts and deliver high-quality design solutions within deadlines.",
  "Good knowledge of image editing, photo retouching, and layout design techniques."
];
