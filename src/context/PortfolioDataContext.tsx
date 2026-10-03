import React, { createContext, useContext, useState, useEffect } from 'react';
import { personalInfo as defaultPersonalInfo, projects as defaultProjects } from '../data/portfolioData';
import { Project } from '../types';
import { getFile, setFile, deleteFile, triggerDownload } from '../utils/storage';
import { getSupabaseConfig, uploadFileToSupabase, saveSettingsToSupabase, loadSettingsFromSupabase } from '../lib/supabase';

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
  cvFileInfo: CvFileInfo | null;
  projects: Project[];
  isDownloading: boolean;
  downloadCv: () => Promise<boolean>;
  uploadCvFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  uploadPhotoFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  uploadProjectImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  addProject: (project: Omit<Project, 'id'>) => Promise<{ success: boolean; project?: Project; error?: string }>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<{ success: boolean; error?: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetProjects: () => Promise<void>;
  resetPhoto: () => Promise<void>;
  resetCvFile: () => Promise<void>;
  updatePersonalInfo: (data: Partial<typeof defaultPersonalInfo>) => Promise<void>;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

const CV_STORAGE_KEY = 'user_uploaded_cv_pdf';
const PHOTO_STORAGE_KEY = 'user_uploaded_photo';
const PROFILE_SETTINGS_KEY = 'ashraful_custom_profile_info';
const PROJECTS_STORAGE_KEY = 'ashraful_custom_projects';

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personalInfo, setPersonalInfo] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_SETTINGS_KEY);
      return stored ? { ...defaultPersonalInfo, ...JSON.parse(stored) } : defaultPersonalInfo;
    } catch {
      return defaultPersonalInfo;
    }
  });

  const [customPhoto, setCustomPhoto] = useState<string | null>(null);
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

  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize data from IndexedDB / Storage on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      // 1. Load Photo
      const photoDoc = await getFile(PHOTO_STORAGE_KEY);
      if (photoDoc && mounted) {
        setCustomPhoto(photoDoc.base64);
      } else {
        const legacyPhoto = localStorage.getItem('ashraful_custom_photo');
        if (legacyPhoto && mounted) {
          setCustomPhoto(legacyPhoto);
        }
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
              setPersonalInfo((prev: any) => ({ ...prev, ...data.personalInfo }));
            }
            if (data.adminPin) {
              try {
                localStorage.setItem('ashraful_admin_pin', data.adminPin);
              } catch (e) {}
            }
            if (data.photoUrl) {
              setCustomPhoto(data.photoUrl);
            }
            if (data.cvUrl) {
              setCvFileInfo((prev) => ({
                name: data.cvName || 'Md_Ashraful_Islam_CV.pdf',
                size: data.cvSize || 0,
                updatedAt: data.updatedAt || new Date().toISOString(),
                publicUrl: data.cvUrl,
              }));
            }
            if (Array.isArray(data.projects) && data.projects.length > 0) {
              setProjects(data.projects);
              localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(data.projects));
            }
          }
        }
      } catch (err) {
        console.warn('Supabase optional sync skipped:', err);
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
   * Upload and save custom photo
   */
  const uploadPhotoFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!file) return { success: false, error: 'No file provided' };
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'অনুগ্রহ করে একটি ছবি (Image: JPG, PNG, WEBP) নির্বাচন করুন।' };
    }

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      await setFile(PHOTO_STORAGE_KEY, {
        name: file.name,
        type: file.type || 'image/png',
        size: file.size,
        updatedAt: new Date().toISOString(),
        base64: base64Data,
      });

      try {
        localStorage.setItem('ashraful_custom_photo', base64Data);
      } catch (e) {}

      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        const remoteRes = await uploadFileToSupabase(file, `photos/${Date.now()}_${file.name}`);
        if (remoteRes.success && remoteRes.publicUrl) {
          await saveSettingsToSupabase({ photoUrl: remoteRes.publicUrl });
        }
      }

      setCustomPhoto(base64Data);
      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      console.error('Failed to save photo:', err);
      return { success: false, error: err?.message || 'Failed to save photo.' };
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
    const updated = { ...personalInfo, ...data };
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
   * Explicit sync with Supabase
   */
  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const pin = localStorage.getItem('ashraful_admin_pin') || '1234';
      const payload: Record<string, any> = {
        personalInfo,
        adminPin: pin,
        projects,
        updatedAt: new Date().toISOString(),
      };
      if (customPhoto) payload.photoUrl = customPhoto;
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
        cvFileInfo,
        projects,
        isDownloading,
        downloadCv,
        uploadCvFile,
        uploadPhotoFile,
        uploadProjectImage,
        addProject,
        updateProject,
        deleteProject,
        resetProjects,
        resetPhoto,
        resetCvFile,
        updatePersonalInfo,
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
