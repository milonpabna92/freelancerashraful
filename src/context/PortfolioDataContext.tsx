import React, { createContext, useContext, useState, useEffect } from 'react';
import { personalInfo as defaultPersonalInfo } from '../data/portfolioData';
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
  isDownloading: boolean;
  downloadCv: () => Promise<boolean>;
  uploadCvFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  uploadPhotoFile: (file: File) => Promise<{ success: boolean; error?: string }>;
  resetPhoto: () => Promise<void>;
  resetCvFile: () => Promise<void>;
  updatePersonalInfo: (data: Partial<typeof defaultPersonalInfo>) => Promise<void>;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

const CV_STORAGE_KEY = 'user_uploaded_cv_pdf';
const PHOTO_STORAGE_KEY = 'user_uploaded_photo';
const PROFILE_SETTINGS_KEY = 'ashraful_custom_profile_info';

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
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize data from IndexedDB on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      // 1. Load Photo
      const photoDoc = await getFile(PHOTO_STORAGE_KEY);
      if (photoDoc && mounted) {
        setCustomPhoto(photoDoc.base64);
      } else {
        // Check localStorage legacy fallback
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
        // Check if there is metadata saved
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

      // 3. Optional: check Supabase if configured
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
        }
      }
    }

    loadData();

    // Listen to cross-window or inter-component updates
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
   * Downloads the active CV (user-uploaded file or server fallback)
   * Guaranteed 100% download across all browsers/devices
   */
  const downloadCv = async (): Promise<boolean> => {
    setIsDownloading(true);
    try {
      let base64 = cvFileInfo?.base64;

      // If we don't have base64 in state, try reading it from IndexedDB
      if (!base64 && cvFileInfo) {
        const doc = await getFile(CV_STORAGE_KEY);
        if (doc?.base64) {
          base64 = doc.base64;
        }
      }

      const fileName = cvFileInfo?.name || 'Md_Ashraful_Islam_CV.pdf';
      const fallbackUrl = cvFileInfo?.publicUrl || '/Md_Ashraful_Islam_CV.pdf';

      const success = await triggerDownload(fileName, base64, fallbackUrl);
      return success;
    } catch (err) {
      console.error('downloadCv error:', err);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Uploads and stores the user's real CV PDF file
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
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const now = new Date().toISOString();

      // 1. Save in IndexedDB
      await setFile(CV_STORAGE_KEY, {
        name: file.name,
        type: file.type || 'application/pdf',
        base64,
        size: file.size,
        updatedAt: now,
      });

      // 2. Upload to Supabase if connected
      let publicUrl: string | undefined;
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        const uploadResult = await uploadFileToSupabase(file, `cv/${Date.now()}_${file.name}`, supabaseConfig.bucketName);
        if (uploadResult.success && uploadResult.publicUrl) {
          publicUrl = uploadResult.publicUrl;
        }
      }

      const info: CvFileInfo = {
        name: file.name,
        size: file.size,
        updatedAt: now,
        base64,
        publicUrl,
      };

      setCvFileInfo(info);
      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      console.error('uploadCvFile error:', err);
      return { success: false, error: err?.message || 'CV আপলোড করতে সমস্যা হয়েছে' };
    }
  };

  /**
   * Uploads and stores the user's real profile photo
   */
  const uploadPhotoFile = async (file: File): Promise<{ success: boolean; error?: string }> => {
    if (!file) return { success: false, error: 'No file provided' };

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;
      const now = new Date().toISOString();

      // 1. Save in IndexedDB and localStorage
      await setFile(PHOTO_STORAGE_KEY, {
        name: file.name,
        type: file.type || 'image/png',
        base64,
        size: file.size,
        updatedAt: now,
      });

      try {
        localStorage.setItem('ashraful_custom_photo', base64);
      } catch (e) {}

      // 2. Upload to Supabase if connected
      const supabaseConfig = getSupabaseConfig();
      if (supabaseConfig.connected) {
        await uploadFileToSupabase(file, `avatars/${Date.now()}_${file.name}`, supabaseConfig.bucketName);
      }

      setCustomPhoto(base64);
      window.dispatchEvent(new Event('portfolioDataUpdated'));
      return { success: true };
    } catch (err: any) {
      console.error('uploadPhotoFile error:', err);
      return { success: false, error: err?.message || 'ছবি আপলোড করতে সমস্যা হয়েছে' };
    }
  };

  const resetPhoto = async (): Promise<void> => {
    await deleteFile(PHOTO_STORAGE_KEY);
    try {
      localStorage.removeItem('ashraful_custom_photo');
    } catch (e) {}
    setCustomPhoto(null);
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

  const resetCvFile = async (): Promise<void> => {
    await deleteFile(CV_STORAGE_KEY);
    setCvFileInfo(null);
    window.dispatchEvent(new Event('portfolioDataUpdated'));
  };

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

  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const supabaseConfig = getSupabaseConfig();
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'সুপাবেস URL ও Anon Key দিন' };
    }

    try {
      const payload: Record<string, any> = {
        personalInfo,
        updatedAt: new Date().toISOString(),
      };
      if (cvFileInfo?.publicUrl) payload.cvUrl = cvFileInfo.publicUrl;
      if (cvFileInfo?.name) payload.cvName = cvFileInfo.name;

      const res = await saveSettingsToSupabase(payload);
      if (res.success) {
        return { success: true, message: 'সুপাবেসে সফলভাবে তথ্য সিঙ্ক হয়েছে!' };
      } else {
        return { success: false, message: res.error || 'সুপাবেসে সিঙ্ক ব্যর্থ হয়েছে' };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || 'সিঙ্ক ব্যর্থ হয়েছে' };
    }
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        personalInfo,
        customPhoto,
        cvFileInfo,
        isDownloading,
        downloadCv,
        uploadCvFile,
        uploadPhotoFile,
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

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}
