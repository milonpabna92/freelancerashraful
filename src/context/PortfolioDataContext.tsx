import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  personalInfo as defaultPersonalInfo,
  projects as defaultProjects,
  defaultServices,
  defaultSkillBars,
  defaultPrepressChecklist,
  experiences as defaultExperiences,
  educationList as defaultEducationList,
  professionalQualifications as defaultQualifications,
  referencePerson as defaultReferencePerson,
} from '../data/portfolioData';
import {
  Project,
  ServiceItem,
  SkillBarItem,
  PrepressItem,
  Experience,
  Education,
  ReferencePerson,
} from '../types';
import { getFile, setFile, deleteFile, triggerDownload } from '../utils/storage';
import {
  getSupabaseConfig,
  uploadFileToSupabase,
  cleanupOldPhotosInSupabase,
  saveSettingsToSupabase,
  loadSettingsFromSupabase,
} from '../lib/supabase';

/**
 * Optimizes an image (File or Data URL or remote URL) into a crisp, lightweight WebP/PNG Data URL
 * so it can be stored in localStorage (<250KB) for 0ms instant rendering without any flash.
 */
async function optimizeImageToDataUrl(source: File | string, maxDimension = 950): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(typeof source === 'string' ? source : '');
            return;
          }
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Use image/webp to preserve transparent cutout backgrounds while keeping size small (~80-180KB)
          let dataUrl = canvas.toDataURL('image/webp', 0.88);
          if (!dataUrl || dataUrl === 'data:,') {
            dataUrl = canvas.toDataURL('image/png');
          }
          resolve(dataUrl);
        } catch {
          resolve(typeof source === 'string' ? source : '');
        }
      };
      img.onerror = () => {
        if (typeof source === 'string') {
          resolve(source);
        } else {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.onerror = () => resolve('');
          reader.readAsDataURL(source);
        }
      };

      if (typeof source === 'string') {
        img.src = source;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(source);
      }
    } catch {
      resolve(typeof source === 'string' ? source : '');
    }
  });
}

interface CvFileInfo {
  name: string;
  size: number;
  updatedAt: string;
  base64?: string;
  publicUrl?: string;
}

interface PortfolioDataContextType {
  personalInfo: typeof defaultPersonalInfo;
  customPhoto: string | null;
  isPhotoReady: boolean;
  cvFileInfo: CvFileInfo | null;
  projects: Project[];
  services: ServiceItem[];
  skillBars: SkillBarItem[];
  prepressChecklist: PrepressItem[];
  experiences: Experience[];
  educationList: Education[];
  professionalQualifications: string[];
  referencePerson: ReferencePerson;
  isDownloading: boolean;
  downloadCv: () => Promise<boolean>;
  uploadCvFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  uploadPhotoFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  purgeOldPhotosAndSyncCurrent: () => Promise<{ success: boolean; message: string }>;
  uploadProjectImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  addProject: (project: Omit<Project, 'id'>) => Promise<{ success: boolean; project?: Project; error?: string }>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetProjects: () => Promise<void>;
  resetPhoto: () => Promise<void>;
  resetCvFile: () => Promise<void>;
  updatePersonalInfo: (data: Partial<typeof defaultPersonalInfo>) => Promise<void>;
  updateServices: (newServices: ServiceItem[]) => Promise<void>;
  resetServices: () => Promise<void>;
  updateSkillBars: (newSkills: SkillBarItem[]) => Promise<void>;
  resetSkillBars: () => Promise<void>;
  updatePrepressChecklist: (newItems: PrepressItem[]) => Promise<void>;
  resetPrepressChecklist: () => Promise<void>;
  updateExperiences: (newExps: Experience[]) => Promise<void>;
  resetExperiences: () => Promise<void>;
  updateEducationList: (newEdus: Education[]) => Promise<void>;
  resetEducationList: () => Promise<void>;
  updateQualifications: (newQuals: string[]) => Promise<void>;
  resetQualifications: () => Promise<void>;
  updateReferencePerson: (newRef: ReferencePerson) => Promise<void>;
  resetReferencePerson: () => Promise<void>;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

const CV_STORAGE_KEY = 'user_uploaded_cv_pdf';
const PHOTO_STORAGE_KEY = 'user_uploaded_photo';
const PROFILE_SETTINGS_KEY = 'ashraful_custom_profile_info';
const PROJECTS_STORAGE_KEY = 'ashraful_custom_projects';
const SERVICES_STORAGE_KEY = 'ashraful_custom_services';
const SKILLS_STORAGE_KEY = 'ashraful_custom_skills';
const PREPRESS_STORAGE_KEY = 'ashraful_custom_prepress';
const EXPERIENCES_STORAGE_KEY = 'ashraful_custom_experiences';
const EDUCATION_STORAGE_KEY = 'ashraful_custom_education';
const QUALIFICATIONS_STORAGE_KEY = 'ashraful_custom_qualifications';
const REFERENCE_STORAGE_KEY = 'ashraful_custom_reference';

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultPersonalInfo,
          ...parsed,
          personalDetails: {
            ...defaultPersonalInfo.personalDetails,
            ...(parsed.personalDetails || {}),
          },
          heroStats: Array.isArray(parsed.heroStats) && parsed.heroStats.length > 0 ? parsed.heroStats : defaultPersonalInfo.heroStats,
          languages: Array.isArray(parsed.languages) && parsed.languages.length > 0 ? parsed.languages : defaultPersonalInfo.languages,
          hobbies: Array.isArray(parsed.hobbies) && parsed.hobbies.length > 0 ? parsed.hobbies : defaultPersonalInfo.hobbies,
        };
      }
      return defaultPersonalInfo;
    } catch {
      return defaultPersonalInfo;
    }
  });

  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      const cached = localStorage.getItem('ashraful_custom_photo');
      if (cached) return cached;
    } catch (e) {}
    return null;
  });
  const [isPhotoReady, setIsPhotoReady] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('ashraful_custom_photo'));
    } catch (e) {
      return false;
    }
  });
  const [cvFileInfo, setCvFileInfo] = useState<CvFileInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return defaultProjects;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const stored = localStorage.getItem(SERVICES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultServices;
  });

  const [skillBars, setSkillBars] = useState<SkillBarItem[]>(() => {
    try {
      const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultSkillBars;
  });

  const [prepressChecklist, setPrepressChecklist] = useState<PrepressItem[]>(() => {
    try {
      const stored = localStorage.getItem(PREPRESS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultPrepressChecklist;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    try {
      const stored = localStorage.getItem(EXPERIENCES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultExperiences;
  });

  const [educationList, setEducationList] = useState<Education[]>(() => {
    try {
      const stored = localStorage.getItem(EDUCATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultEducationList;
  });

  const [professionalQualifications, setProfessionalQualifications] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(QUALIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultQualifications;
  });

  const [referencePerson, setReferencePerson] = useState<ReferencePerson>(() => {
    try {
      const stored = localStorage.getItem(REFERENCE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {}
    return defaultReferencePerson;
  });

  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize data from IndexedDB / Storage on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      let localPhoto: string | null = null;
      let localPhotoUpdatedAt = 0;

      // 1. Load Photo from IndexedDB / LocalStorage
      try {
        const photoDoc = await getFile(PHOTO_STORAGE_KEY);
        if (photoDoc && photoDoc.base64) {
          localPhoto = photoDoc.base64;
          localPhotoUpdatedAt = photoDoc.updatedAt ? new Date(photoDoc.updatedAt).getTime() : 0;
        } else {
          const legacyPhoto = localStorage.getItem('ashraful_custom_photo');
          if (legacyPhoto) {
            localPhoto = legacyPhoto;
          }
        }
      } catch (e) {}

      // If we already have a local photo and no Supabase override is pending, show it right away
      if (localPhoto && mounted) {
        setCustomPhoto(localPhoto);
        // Ensure localStorage has a compact cached copy so next reload is 0ms instant
        try {
          if (!localStorage.getItem('ashraful_custom_photo')) {
            const compact = await optimizeImageToDataUrl(localPhoto, 950);
            if (compact) {
              localStorage.setItem('ashraful_custom_photo', compact);
            }
          }
        } catch (e) {}
      }

      // 2. Load CV File Info
      const cvDoc = await getFile(CV_STORAGE_KEY);
      if (cvDoc && mounted) {
        setCvFileInfo({
          name: cvDoc.name,
          size: cvDoc.size,
          updatedAt: cvDoc.updatedAt,
          base64: cvDoc.base64,
        });
      } else {
        const metaRaw = localStorage.getItem(`meta_${CV_STORAGE_KEY}`);
        if (metaRaw && mounted) {
          try {
            const meta = JSON.parse(metaRaw);
            setCvFileInfo({
              name: meta.name || 'Md_Ashraful_Islam_CV.pdf',
              size: meta.size || 0,
              updatedAt: meta.updatedAt || new Date().toISOString(),
            });
          } catch (e) {}
        }
      }

      // 3. Load Projects from LocalStorage
      try {
        const localProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
        if (localProjects && mounted) {
          const parsed = JSON.parse(localProjects);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        }
      } catch (e) {}

      // 4. Optional: check Supabase if configured
      try {
        const supabaseConfig = getSupabaseConfig();
        if (supabaseConfig.connected && supabaseConfig.url) {
          const { success, data } = await loadSettingsFromSupabase();
          if (success && data && mounted) {
            if (data.personalInfo) {
              setPersonalInfo((prev: any) => ({
                ...prev,
                ...data.personalInfo,
                personalDetails: {
                  ...prev.personalDetails,
                  ...(data.personalInfo.personalDetails || {}),
                },
              }));
              try {
                localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(data.personalInfo));
              } catch (e) {}
            }
            if (data.adminPin) {
              try {
                localStorage.setItem('ashraful_admin_pin', data.adminPin);
              } catch (e) {}
            }
            if (data.photoUrl) {
              const remoteUpdatedAt = data.photoUpdatedAt ? new Date(data.photoUpdatedAt).getTime() : 0;
              // Use Supabase photo if we don't have a newer local upload
              if (!localPhoto || remoteUpdatedAt >= localPhotoUpdatedAt) {
                setCustomPhoto(data.photoUrl);
                // Convert/cache in localStorage & IndexedDB so future loads are 0ms instant without flashing
                optimizeImageToDataUrl(data.photoUrl, 950).then(async (compact) => {
                  const toStore = compact || data.photoUrl;
                  try {
                    localStorage.setItem('ashraful_custom_photo', toStore);
                  } catch (e) {}
                  try {
                    await setFile(PHOTO_STORAGE_KEY, {
                      name: 'profile_photo.webp',
                      type: 'image/webp',
                      size: toStore.length,
                      updatedAt: data.photoUpdatedAt || new Date().toISOString(),
                      base64: toStore,
                    });
                  } catch (e) {}
                });
              } else if (localPhoto && localPhotoUpdatedAt > remoteUpdatedAt) {
                // Local photo is newer than Supabase's old photo -> auto-update Supabase with the newer local photo!
                optimizeImageToDataUrl(localPhoto, 950).then(async (compact) => {
                  await saveSettingsToSupabase({
                    photoUrl: compact || localPhoto,
                    photoUpdatedAt: new Date(localPhotoUpdatedAt).toISOString(),
                  });
                });
              }
            } else if (localPhoto) {
              // Supabase has no photoUrl yet, but local browser has user's uploaded photo -> sync to Supabase
              optimizeImageToDataUrl(localPhoto, 950).then(async (compact) => {
                await saveSettingsToSupabase({
                  photoUrl: compact || localPhoto,
                  photoUpdatedAt: new Date(localPhotoUpdatedAt || Date.now()).toISOString(),
                });
              });
            }
            if (data.cvUrl) {
              setCvFileInfo({
                name: data.cvName || 'Md_Ashraful_Islam_CV.pdf',
                size: data.cvSize || 0,
                updatedAt: data.updatedAt || new Date().toISOString(),
                publicUrl: data.cvUrl,
              });
            }
            if (Array.isArray(data.projects) && data.projects.length > 0) {
              setProjects(data.projects);
              localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(data.projects));
            }
            if (Array.isArray(data.services) && data.services.length > 0) {
              setServices(data.services);
              localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(data.services));
            }
            if (Array.isArray(data.skillBars) && data.skillBars.length > 0) {
              setSkillBars(data.skillBars);
              localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(data.skillBars));
            }
            if (Array.isArray(data.prepressChecklist) && data.prepressChecklist.length > 0) {
              setPrepressChecklist(data.prepressChecklist);
              localStorage.setItem(PREPRESS_STORAGE_KEY, JSON.stringify(data.prepressChecklist));
            }
            if (Array.isArray(data.experiences) && data.experiences.length > 0) {
              setExperiences(data.experiences);
              localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(data.experiences));
            }
            if (Array.isArray(data.educationList) && data.educationList.length > 0) {
              setEducationList(data.educationList);
              localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(data.educationList));
            }
            if (Array.isArray(data.professionalQualifications) && data.professionalQualifications.length > 0) {
              setProfessionalQualifications(data.professionalQualifications);
              localStorage.setItem(QUALIFICATIONS_STORAGE_KEY, JSON.stringify(data.professionalQualifications));
            }
            if (data.referencePerson && data.referencePerson.name) {
              setReferencePerson(data.referencePerson);
              localStorage.setItem(REFERENCE_STORAGE_KEY, JSON.stringify(data.referencePerson));
            }
          }
        }
      } catch (err) {
        console.warn('Supabase optional sync skipped:', err);
      } finally {
        if (mounted) {
          setIsPhotoReady(true);
        }
      }
    }

    loadData();

    const handleGlobalUpdate = () => {
      loadData();
    };
    window.addEventListener('portfolioDataUpdated', handleGlobalUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('portfolioDataUpdated', handleGlobalUpdate);
    };
  }, []);

  /**
   * Downloads the active CV
   */
  const downloadCv = async (): Promise<boolean> => {
    setIsDownloading(true);
    try {
      let base64 = cvFileInfo?.base64;
      if (!base64 && cvFileInfo) {
        const doc = await getFile(CV_STORAGE_KEY);
        if (doc?.base64) {
          base64 = doc.base64;
        }
      }

      const fileName = cvFileInfo?.name || 'Md_Ashraful_Islam_CV.pdf';
      const fallbackUrl = cvFileInfo?.publicUrl || '/Md_Ashraful_Islam_CV.pdf';
      return await triggerDownload(fileName, base64, fallbackUrl);
    } catch (err) {
      console.error('downloadCv error:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Upload and save a custom PDF file
   */
  const uploadCvFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!file) return { success: false, error: 'No file provided' };
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return { success: false, error: 'অনুগ্রহ করে শুধুমাত্র PDF (.pdf) ফাইল নির্বাচন করুন।' };
    }

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const fileInfo: CvFileInfo = {
        name: file.name,
        size: file.size,
        updatedAt: new Date().toISOString(),
        base64: base64Data,
      };

      await setFile(CV_STORAGE_KEY, {
        name: fileInfo.name,
        type: file.type || 'application/pdf',
        size: fileInfo.size,
        updatedAt: fileInfo.updatedAt,
        base64: fileInfo.base64 || '',
      });
      localStorage.setItem(`meta_${CV_STORAGE_KEY}`, JSON.stringify({
        name: fileInfo.name,
        size: fileInfo.size,
        updatedAt: fileInfo.updatedAt,
      }));

      // Try uploading to Supabase Storage if configured
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        const remoteRes = await uploadFileToSupabase(file, `cv/${Date.now()}_${file.name}`);
        if (remoteRes.success && remoteRes.publicUrl) {
          fileInfo.publicUrl = remoteRes.publicUrl;
          await saveSettingsToSupabase({
            cvUrl: remoteRes.publicUrl,
            cvName: file.name,
            cvSize: file.size,
            updatedAt: fileInfo.updatedAt,
          });
        }
      }

      setCvFileInfo(fileInfo);
      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      console.error('Failed to save CV:', err);
      return { success: false, error: err?.message || 'Failed to upload CV file.' };
    }
  };

  /**
   * Upload and save custom photo (with instant localStorage caching + old Supabase file cleanup)
   */
  const uploadPhotoFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!file) return { success: false, error: 'No file provided' };
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'অনুগ্রহ করে একটি ছবি (Image: JPG, PNG, WEBP) নির্বাচন করুন।' };
    }

    try {
      const nowIso = new Date().toISOString();
      const optimizedBase64 = await optimizeImageToDataUrl(file, 950);
      if (!optimizedBase64) {
        return { success: false, error: 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।' };
      }

      await setFile(PHOTO_STORAGE_KEY, {
        name: file.name,
        type: 'image/webp',
        size: optimizedBase64.length,
        updatedAt: nowIso,
        base64: optimizedBase64,
      });

      try {
        localStorage.setItem('ashraful_custom_photo', optimizedBase64);
      } catch (e) {}

      setCustomPhoto(optimizedBase64);
      setIsPhotoReady(true);

      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        const cleanExt = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
        const storagePath = `photos/profile_${Date.now()}.${cleanExt}`;
        const remoteRes = await uploadFileToSupabase(file, storagePath);

        if (remoteRes.success && remoteRes.publicUrl) {
          await cleanupOldPhotosInSupabase(remoteRes.publicUrl);
          await saveSettingsToSupabase({
            photoUrl: optimizedBase64,
            photoStorageUrl: remoteRes.publicUrl,
            photoUpdatedAt: nowIso,
          });
        } else {
          await saveSettingsToSupabase({
            photoUrl: optimizedBase64,
            photoUpdatedAt: nowIso,
          });
        }
      }

      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      console.error('Failed to save photo:', err);
      return { success: false, error: err?.message || 'Failed to save photo.' };
    }
  };

  /**
   * Purges any old profile photos from Supabase Storage & locks the currently active photo
   * into LocalStorage, IndexedDB, and Supabase Database for 0ms instant loading.
   */
  const purgeOldPhotosAndSyncCurrent = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const current = customPhoto;
      if (!current) {
        return {
          success: false,
          message: 'বর্তমানে কোনো কাস্টম ছবি আপলোড করা নেই। প্রথমে নতুন ছবি আপলোড করুন।',
        };
      }

      const nowIso = new Date().toISOString();
      const compactDataUrl = await optimizeImageToDataUrl(current, 950);
      const finalPhoto = compactDataUrl || current;

      // 1. Save to LocalStorage (for 0ms synchronous startup)
      try {
        localStorage.setItem('ashraful_custom_photo', finalPhoto);
      } catch (e) {}

      // 2. Save to IndexedDB
      await setFile(PHOTO_STORAGE_KEY, {
        name: 'profile_photo.webp',
        type: 'image/webp',
        size: finalPhoto.length,
        updatedAt: nowIso,
        base64: finalPhoto,
      });

      setCustomPhoto(finalPhoto);
      setIsPhotoReady(true);

      // 3. Clean up old files in Supabase Storage & overwrite photoUrl in Supabase Database
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        await cleanupOldPhotosInSupabase();
        const saveRes = await saveSettingsToSupabase({
          photoUrl: finalPhoto,
          photoUpdatedAt: nowIso,
        });
        if (!saveRes.success) {
          return {
            success: false,
            message: `লোকাল ক্যাশ আপডেট হয়েছে, কিন্তু সুপাবেসে সেভ করতে সমস্যা হয়েছে: ${saveRes.error}`,
          };
        }
      }

      return {
        success: true,
        message: 'পুরাতন ছবির সমস্ত ক্যাশ ও ডাটা মুছে ফেলা হয়েছে! এখন সাইট লোড দিলেই সরাসরি আপনার এই ছবিটি আসবে।',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'পুরাতন ডাটা পরিষ্কার করতে সমস্যা হয়েছে।',
      };
    }
  };

  /**
   * Upload an image for a project
   */
  const uploadProjectImage = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!file) return { success: false, error: 'No file provided' };
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'অনুগ্রহ করে ছবি ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।' };
    }

    try {
      // Check if Supabase storage is available
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        const remoteRes = await uploadFileToSupabase(file, `projects/${Date.now()}_${file.name}`);
        if (remoteRes.success && remoteRes.publicUrl) {
          return { success: true, url: remoteRes.publicUrl };
        }
      }

      // Convert to compressed base64 Data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      return { success: true, url: base64Data };
    } catch (err: any) {
      return { success: false, error: err?.message || 'ছবি প্রসেস করতে ব্যর্থ হয়েছে।' };
    }
  };

  /**
   * Add a new project
   */
  const addProject = async (newProjData: Omit<Project, 'id'>): Promise<{ success: boolean; project?: Project; error?: string }> => {
    try {
      const newId = `proj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newProject: Project = {
        ...newProjData,
        id: newId,
        createdAt: new Date().toISOString(),
      };

      const updated = [newProject, ...projects];
      setProjects(updated);
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      // Supabase sync
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        await saveSettingsToSupabase({ projects: updated });
      }

      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true, project: newProject };
    } catch (err: any) {
      return { success: false, error: err?.message || 'প্রোজেক্ট যোগ করতে ব্যর্থ হয়েছে।' };
    }
  };

  /**
   * Update an existing project
   */
  const updateProject = async (id: string, updatedData: Partial<Project>): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated = projects.map((p) => (p.id === id ? { ...p, ...updatedData } : p));
      setProjects(updated);
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        await saveSettingsToSupabase({ projects: updated });
      }

      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'প্রোজেক্ট আপডেট করতে ব্যর্থ হয়েছে।' };
    }
  };

  /**
   * Delete a project
   */
  const deleteProject = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}

      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        await saveSettingsToSupabase({ projects: updated });
      }

      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'প্রোজেক্ট মুছতে ব্যর্থ হয়েছে।' };
    }
  };

  /**
   * Reset projects to default original showcase
   */
  const resetProjects = async (): Promise<void> => {
    setProjects(defaultProjects);
    try {
      localStorage.removeItem(PROJECTS_STORAGE_KEY);
    } catch (e) {}

    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ projects: defaultProjects });
    }

    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Reset photo to default
   */
  const resetPhoto = async (): Promise<void> => {
    await deleteFile(PHOTO_STORAGE_KEY);
    try {
      localStorage.removeItem('ashraful_custom_photo');
    } catch (e) {}
    setCustomPhoto(null);
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Reset CV to default
   */
  const resetCvFile = async (): Promise<void> => {
    await deleteFile(CV_STORAGE_KEY);
    try {
      localStorage.removeItem(`meta_${CV_STORAGE_KEY}`);
    } catch (e) {}
    setCvFileInfo(null);
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Update personal bio information
   */
  const updatePersonalInfo = async (data: Partial<typeof defaultPersonalInfo>): Promise<void> => {
    const updated = {
      ...personalInfo,
      ...data,
      personalDetails: {
        ...personalInfo.personalDetails,
        ...(data.personalDetails || {}),
      },
    };
    setPersonalInfo(updated);
    try {
      localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {}

    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ personalInfo: updated });
    }

    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Services Management
   */
  const updateServices = async (newServices: ServiceItem[]): Promise<void> => {
    setServices(newServices);
    try {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(newServices));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ services: newServices });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetServices = async (): Promise<void> => {
    setServices(defaultServices);
    try {
      localStorage.removeItem(SERVICES_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ services: defaultServices });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Skills Management
   */
  const updateSkillBars = async (newSkills: SkillBarItem[]): Promise<void> => {
    setSkillBars(newSkills);
    try {
      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(newSkills));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ skillBars: newSkills });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetSkillBars = async (): Promise<void> => {
    setSkillBars(defaultSkillBars);
    try {
      localStorage.removeItem(SKILLS_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ skillBars: defaultSkillBars });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Pre-press Checklist Management
   */
  const updatePrepressChecklist = async (newItems: PrepressItem[]): Promise<void> => {
    setPrepressChecklist(newItems);
    try {
      localStorage.setItem(PREPRESS_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ prepressChecklist: newItems });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetPrepressChecklist = async (): Promise<void> => {
    setPrepressChecklist(defaultPrepressChecklist);
    try {
      localStorage.removeItem(PREPRESS_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ prepressChecklist: defaultPrepressChecklist });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Work Experiences Management
   */
  const updateExperiences = async (newExps: Experience[]): Promise<void> => {
    setExperiences(newExps);
    try {
      localStorage.setItem(EXPERIENCES_STORAGE_KEY, JSON.stringify(newExps));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ experiences: newExps });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetExperiences = async (): Promise<void> => {
    setExperiences(defaultExperiences);
    try {
      localStorage.removeItem(EXPERIENCES_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ experiences: defaultExperiences });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Education Management
   */
  const updateEducationList = async (newEdus: Education[]): Promise<void> => {
    setEducationList(newEdus);
    try {
      localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(newEdus));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ educationList: newEdus });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetEducationList = async (): Promise<void> => {
    setEducationList(defaultEducationList);
    try {
      localStorage.removeItem(EDUCATION_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ educationList: defaultEducationList });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Professional Qualifications Management
   */
  const updateQualifications = async (newQuals: string[]): Promise<void> => {
    setProfessionalQualifications(newQuals);
    try {
      localStorage.setItem(QUALIFICATIONS_STORAGE_KEY, JSON.stringify(newQuals));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ professionalQualifications: newQuals });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetQualifications = async (): Promise<void> => {
    setProfessionalQualifications(defaultQualifications);
    try {
      localStorage.removeItem(QUALIFICATIONS_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ professionalQualifications: defaultQualifications });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Reference Person Management
   */
  const updateReferencePerson = async (newRef: ReferencePerson): Promise<void> => {
    setReferencePerson(newRef);
    try {
      localStorage.setItem(REFERENCE_STORAGE_KEY, JSON.stringify(newRef));
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ referencePerson: newRef });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetReferencePerson = async (): Promise<void> => {
    setReferencePerson(defaultReferencePerson);
    try {
      localStorage.removeItem(REFERENCE_STORAGE_KEY);
    } catch (e) {}
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ referencePerson: defaultReferencePerson });
    }
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  /**
   * Explicit sync with Supabase
   */
  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const pin = localStorage.getItem('ashraful_admin_pin') || '1234';
      const payload: Record<string, any> = {
        personalInfo,
        adminPin: pin,
        projects,
        services,
        skillBars,
        prepressChecklist,
        experiences,
        educationList,
        professionalQualifications,
        referencePerson,
        updatedAt: new Date().toISOString(),
      };
      if (customPhoto) {
        const compact = await optimizeImageToDataUrl(customPhoto, 950);
        payload.photoUrl = compact || customPhoto;
        payload.photoUpdatedAt = new Date().toISOString();
      }
      if (cvFileInfo?.publicUrl) payload.cvUrl = cvFileInfo.publicUrl;

      const res = await saveSettingsToSupabase(payload);
      if (res.success) {
        return { success: true, message: 'পোর্টফোলিও ও প্রোজেক্টের সমস্ত ডেটা সুপাবেস ক্লাউডে সফলভাবে সিঙ্ক হয়েছে!' };
      } else {
        return { success: false, message: res.error || 'সুপাবেসে ডেটা সিঙ্ক ব্যর্থ হয়েছে।' };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'Sync failed' };
    }
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        personalInfo,
        customPhoto,
        isPhotoReady,
        cvFileInfo,
        projects,
        services,
        skillBars,
        prepressChecklist,
        experiences,
        educationList,
        professionalQualifications,
        referencePerson,
        isDownloading,
        downloadCv,
        uploadCvFile,
        uploadPhotoFile,
        purgeOldPhotosAndSyncCurrent,
        uploadProjectImage,
        addProject,
        updateProject,
        deleteProject,
        resetProjects,
        resetPhoto,
        resetCvFile,
        updatePersonalInfo,
        updateServices,
        resetServices,
        updateSkillBars,
        resetSkillBars,
        updatePrepressChecklist,
        resetPrepressChecklist,
        updateExperiences,
        resetExperiences,
        updateEducationList,
        resetEducationList,
        updateQualifications,
        resetQualifications,
        updateReferencePerson,
        resetReferencePerson,
        syncWithSupabase,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
