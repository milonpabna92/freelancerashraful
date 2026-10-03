import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  saveSettingsToSupabase,
  SUPABASE_SETUP_SQL
} from '../lib/supabase';
import {
  X,
  Lock,
  FileText,
  Image,
  User,
  Database,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Save,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const {
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
  } = usePortfolioData();

  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [storedPin, setStoredPin] = useState(() => {
    return localStorage.getItem('ashraful_admin_pin') || '1234';
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<'cv' | 'photo' | 'info' | 'supabase' | 'security'>('cv');

  // CV & Photo upload status state
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const cvFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Form edit state for personal info
  const [formData, setFormData] = useState({
    name: personalInfo.name,
    role: personalInfo.role,
    phone: personalInfo.phone,
    email: personalInfo.email,
    presentAddress: personalInfo.presentAddress,
    facebookHandle: personalInfo.facebookHandle,
    facebookUrl: personalInfo.facebookUrl,
    behanceHandle: personalInfo.behanceHandle,
    behanceUrl: personalInfo.behanceUrl,
    whatsappUrl: personalInfo.whatsappUrl,
    careerObjective: personalInfo.careerObjective,
  });
  const [infoSaved, setInfoSaved] = useState(false);

  // Supabase settings state
  const [supabaseConfigState, setSupabaseConfigState] = useState(getSupabaseConfig());
  const [supabaseTesting, setSupabaseTesting] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // PIN Change State
  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinMessage, setPinMessage] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  // Refresh stored PIN on modal open
  useEffect(() => {
    if (isOpen) {
      const pin = localStorage.getItem('ashraful_admin_pin') || '1234';
      setStoredPin(pin);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === storedPin.trim()) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ type: 'loading', message: 'সিভি ফাইল আপলোড হচ্ছে...' });
    const res = await uploadCvFile(file);
    if (res.success) {
      setUploadStatus({ type: 'success', message: `"${file.name}" সফলভাবে সিভির আসল ফাইল হিসেবে সেট করা হয়েছে!` });
      setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 4000);
    } else {
      setUploadStatus({ type: 'error', message: res.error || 'আপলোড ব্যর্থ হয়েছে।' });
    }
    if (cvFileInputRef.current) cvFileInputRef.current.value = '';
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus({ type: 'loading', message: 'ছবি আপলোড হচ্ছে...' });
    const res = await uploadPhotoFile(file);
    if (res.success) {
      setUploadStatus({ type: 'success', message: 'আপনার নতুন প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!' });
      setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 4000);
    } else {
      setUploadStatus({ type: 'error', message: res.error || 'আপলোড ব্যর্থ হয়েছে।' });
    }
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersonalInfo(formData);
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 3000);
  };

  const handleTestSupabase = async () => {
    setSupabaseTesting(true);
    setSupabaseStatus(null);
    const res = await testSupabaseConnection(supabaseConfigState.url, supabaseConfigState.anonKey);
    setSupabaseStatus(res);
    setSupabaseTesting(false);
    if (res.success) {
      const updated = { ...supabaseConfigState, connected: true };
      setSupabaseConfigState(updated);
      saveSupabaseConfig(updated);
    }
  };

  const handleSaveSupabaseConfig = () => {
    saveSupabaseConfig(supabaseConfigState);
    setSupabaseStatus({ success: true, message: 'সুপাবেস কনফিগারেশন সংরক্ষণ করা হয়েছে!' });
    setTimeout(() => setSupabaseStatus(null), 3000);
  };

  const handleSyncSupabase = async () => {
    setSyncing(true);
    const res = await syncWithSupabase();
    setSupabaseStatus({ success: res.success, message: res.message });
    setSyncing(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  // PIN Change Handler
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage({ type: 'idle', text: '' });

    if (pinForm.currentPin.trim() !== storedPin.trim()) {
      setPinMessage({ type: 'error', text: 'বর্তমান পিনটি সঠিক নয়! দয়া করে সঠিক পিন দিন।' });
      return;
    }

    if (!pinForm.newPin || pinForm.newPin.trim().length < 4) {
      setPinMessage({ type: 'error', text: 'নতুন পিন কমপক্ষে ৪ সংখ্যার হতে হবে!' });
      return;
    }

    if (pinForm.newPin.trim() !== pinForm.confirmPin.trim()) {
      setPinMessage({ type: 'error', text: 'নতুন পিন এবং কনফার্ম পিন মেলেনি!' });
      return;
    }

    const updatedPin = pinForm.newPin.trim();
    setStoredPin(updatedPin);
    try {
      localStorage.setItem('ashraful_admin_pin', updatedPin);
    } catch (e) {}

    // Save to Supabase if connected
    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ adminPin: updatedPin });
    }

    setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
    setPinMessage({
      type: 'success',
      text: `আপনার নতুন পিন (${updatedPin}) সফলভাবে সেট করা হয়েছে! পরবর্তী লগইনে এই পিন ব্যবহার করুন।`,
    });
    setTimeout(() => setPinMessage({ type: 'idle', text: '' }), 5000);
  };

  // Reset PIN to 1234
  const handleResetPin = async () => {
    setStoredPin('1234');
    try {
      localStorage.setItem('ashraful_admin_pin', '1234');
    } catch (e) {}

    const supabaseConfig = getSupabaseConfig();
    if (supabaseConfig.connected) {
      await saveSettingsToSupabase({ adminPin: '1234' });
    }

    setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
    setPinMessage({
      type: 'success',
      text: 'পিন রিসেট করে ডিফল্ট পিন (1234) হিসেবে সেট করা হয়েছে।',
    });
    setTimeout(() => setPinMessage({ type: 'idle', text: '' }), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cvFileInputRef}
        onChange={handleCvUpload}
        accept=".pdf,application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={photoFileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1C1A18] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800 bg-[#FFF9F6] dark:bg-[#141210]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                গোপন অ্যাডমিন কন্ট্রোল প্যানেল (Hidden Admin Panel)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                সিভি পিডিএফ আপলোড, ছবি আপডেট, তথ্য এডিটিং, পিন পরিবর্তন ও সুপাবেস
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if Not Authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41] flex items-center justify-center mb-5 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-2">
              অ্যাডমিন অ্যাক্সেস লক করা
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mb-6">
              {storedPin === '1234' ? (
                <>
                  প্যানেলে প্রবেশ করতে আপনার অ্যাডমিন পিন দিন। ডিফল্ট পিন: <code className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41] font-mono font-bold">1234</code>
                </>
              ) : (
                'প্যানেলে প্রবেশ করতে আপনার ব্যক্তিগত সিক্রেট অ্যাডমিন পিন দিন।'
              )}
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={16}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="পিন লিখুন..."
                autoFocus
                className="w-full px-4 py-3 text-center text-lg font-bold tracking-widest rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
              />

              {pinError && (
                <div className="text-xs text-rose-500 font-semibold space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>ভুল পিন! দয়া করে সঠিক পিন চেষ্টা করুন।</span>
                  </p>
                  {storedPin !== '1234' && (
                    <button
                      type="button"
                      onClick={handleResetPin}
                      className="text-neutral-500 hover:text-[#FD6F41] underline cursor-pointer text-[11px]"
                    >
                      পিন ভুলে গেছেন? ডিফল্ট পিন (1234) এ রিসেট করতে ক্লিক করুন
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer font-['Archivo',sans-serif]"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-neutral-200/80 dark:border-neutral-800 bg-[#FFF9F6]/60 dark:bg-[#141210]/60 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('cv')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'cv'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>সিভি পিডিএফ (CV File)</span>
              </button>

              <button
                onClick={() => setActiveTab('photo')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'photo'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>প্রোফাইল ছবি (Photo)</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'info'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>তথ্য এডিটিং (Bio Info)</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'security'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>পিন পরিবর্তন (Change PIN)</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'supabase'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>সুপাবেস (Supabase)</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-5 sm:p-8 overflow-y-auto">
              {/* Feedback toast / alert banner */}
              {uploadStatus.message && (
                <div
                  className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-semibold flex items-center gap-3 ${
                    uploadStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : uploadStatus.type === 'error'
                      ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-orange-50 text-[#FD6F41] dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800'
                  }`}
                >
                  {uploadStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  {uploadStatus.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
                  {uploadStatus.type === 'loading' && <RefreshCw className="w-5 h-5 animate-spin shrink-0" />}
                  <span>{uploadStatus.message}</span>
                </div>
              )}

              {/* TAB 1: CV PDF UPLOAD & DOWNLOAD */}
              {activeTab === 'cv' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                      আপনার নিজস্ব সিভি পিডিএফ ফাইল আপলোড করুন
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      আপনার ডিভাইসের আসল সিভি পিডিএফ ফাইলটি আপলোড করুন। যেকোনো ভিজিটর "Download CV" বাটনে ক্লিক করলে ঠিক এই আপলোডকৃত ফাইলটিই ডাউনলোড হবে।
                    </p>
                  </div>

                  {/* Current Active CV Status Card */}
                  <div className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100/80 dark:border-neutral-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 font-['Archivo',sans-serif]">
                      বর্তমানে সক্রিয় সিভি স্ট্যাটাস:
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41] flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                              {cvFileInfo?.name || 'Md_Ashraful_Islam_CV.pdf'}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              {cvFileInfo ? 'কাস্টম আপলোডকৃত' : 'ডিফল্ট সিস্টেম সিভি'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {cvFileInfo?.size
                              ? `${Math.round(cvFileInfo.size / 1024)} KB`
                              : 'অফিশিয়াল ২-পৃষ্ঠার ভেক্টর প্রি-প্রেস সিভি'}
                            {cvFileInfo?.updatedAt && ` · ${new Date(cvFileInfo.updatedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>

                      {/* Download Test Button */}
                      <button
                        onClick={downloadCv}
                        disabled={isDownloading}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer font-['Archivo',sans-serif]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isDownloading ? 'ডাউনলোড হচ্ছে...' : 'এখনই ডাউনলোড পরীক্ষা করুন'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload Dropzone */}
                  <div
                    onClick={() => cvFileInputRef.current?.click()}
                    className="border-2 border-dashed border-orange-200 dark:border-neutral-700 hover:border-[#FD6F41] rounded-3xl p-8 text-center bg-white dark:bg-[#1E1B18] transition-colors cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FD6F41] group-hover:scale-110 transition-transform duration-200 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                      নতুন সিভি ফাইল নির্বাচন করতে এখানে ক্লিক করুন
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
                      আপনার কম্পিউটার বা ফোন থেকে আপনার মূল <strong className="text-[#FD6F41]">.pdf</strong> ফাইলটি বাছাই করুন
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#FD6F41] bg-orange-50 dark:bg-orange-950/40 rounded-full font-['Archivo',sans-serif]">
                      PDF ফাইল নির্বাচন করুন
                    </span>
                  </div>

                  {cvFileInfo && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={resetCvFile}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>আপলোডকৃত সিভি ডিলিট করে ডিফল্ট ফাইলে ফেরত যান</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PROFILE PHOTO */}
              {activeTab === 'photo' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                      প্রোফাইল ছবি পরিবর্তন ও আপডেট
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      আপনার আপলোড করা আসল ছবি (<code className="text-[#FD6F41]">ChatGPT Image Sep 16, 2026, 12_11_00 PM.png</code>) বা যেকোনো নতুন ছবি সেট করুন।
                    </p>
                  </div>

                  {/* Photo Preview Card */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100/80 dark:border-neutral-800">
                    <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-t-full bg-gradient-to-t from-[#FD6F41] to-[#FFA07A] overflow-hidden shadow-lg shrink-0 flex items-end justify-center">
                      <img
                        src={customPhoto || '/user-photo.png'}
                        alt="Profile Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="space-y-3 text-center sm:text-left">
                      <div>
                        <h4 className="text-base font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                          {customPhoto ? 'কাস্টম ছবি সক্রিয় রয়েছে' : 'ডিফল্ট ছবি সক্রিয়'}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          এই ছবিটি হিরো সেকশন, সিভি ডকুমেন্ট ও সমস্ত কার্ডে প্রদর্শিত হবে।
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <button
                          onClick={() => photoFileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer font-['Archivo',sans-serif]"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>নতুন ছবি আপলোড করুন</span>
                        </button>

                        {customPhoto && (
                          <button
                            onClick={resetPhoto}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>রিসেট</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PERSONAL INFORMATION */}
              {activeTab === 'info' && (
                <form onSubmit={handleSaveInfo} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                        ব্যক্তিগত ও যোগাযোগের তথ্য আপডেট
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        এখানে তথ্য পরিবর্তন করলে সাইটের সমস্ত কার্ড ও যোগাযোগের বাটনে আপডেট হয়ে যাবে।
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer font-['Archivo',sans-serif]"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{infoSaved ? 'সংরক্ষিত হয়েছে!' : 'তথ্য সেভ করুন'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        পূর্ণ নাম (Full Name)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        পদবী (Role / Title)
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        মোবাইল নম্বর (Phone)
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        ইমেইল (Email)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        ফেসবুক প্রোফাইল URL
                      </label>
                      <input
                        type="url"
                        value={formData.facebookUrl}
                        onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        বিহ্যান্স (Behance) URL
                      </label>
                      <input
                        type="url"
                        value={formData.behanceUrl}
                        onChange={(e) => setFormData({ ...formData, behanceUrl: e.target.value })}
                        className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                      ঠিকানা (Present Address)
                    </label>
                    <input
                      type="text"
                      value={formData.presentAddress}
                      onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                      className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                      ক্যারিয়ার অবজেক্টিভ (Career Objective)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.careerObjective}
                      onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
                      className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                    />
                  </div>
                </form>
              )}

              {/* TAB 4: PIN CHANGE & SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                      অ্যাডমিন পিন পরিবর্তন ও সিকিউরিটি
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      ডিফল্ট পিন (1234) এর বদলে আপনার পছন্দমত যেকোনো ৪ বা ততোধিক সংখ্যার নতুন সিক্রেট পিন সেট করুন।
                    </p>
                  </div>

                  {/* Current PIN Status Banner */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41] flex items-center justify-center shrink-0">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-['Archivo',sans-serif] block">
                          বর্তমান স্ট্যাটাস
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                            {storedPin === '1234' ? 'ডিফল্ট পিন (1234) সক্রিয়' : 'আপনার কাস্টম পিন সক্রিয়'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                            সুরক্ষিত
                          </span>
                        </div>
                      </div>
                    </div>

                    {storedPin !== '1234' && (
                      <button
                        type="button"
                        onClick={handleResetPin}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer font-['Archivo',sans-serif]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>ডিফল্ট পিনে (1234) রিসেট করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Feedback Message */}
                  {pinMessage.text && (
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
                        pinMessage.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {pinMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                      <span>{pinMessage.text}</span>
                    </div>
                  )}

                  {/* PIN Change Form */}
                  <form onSubmit={handleChangePin} className="p-6 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 space-y-4 max-w-lg">
                    {/* Current PIN */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                        বর্তমান পিন (Current PIN) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPin ? 'text' : 'password'}
                          required
                          value={pinForm.currentPin}
                          onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value })}
                          placeholder="বর্তমান পিনটি লিখুন (ডিফল্ট: 1234)"
                          className="w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPin(!showCurrentPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        >
                          {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New PIN */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                        নতুন পছন্দমতো পিন (New PIN) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPin ? 'text' : 'password'}
                          required
                          value={pinForm.newPin}
                          onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                          placeholder="কমপক্ষে ৪ সংখ্যার নতুন পিন (e.g. 7890)"
                          className="w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPin(!showNewPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        >
                          {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New PIN */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                        নতুন পিন নিশ্চিত করুন (Confirm New PIN) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPin ? 'text' : 'password'}
                          required
                          value={pinForm.confirmPin}
                          onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                          placeholder="নতুন পিনটি পুনরায় লিখুন"
                          className="w-full px-4 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPin(!showConfirmPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        >
                          {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer font-['Archivo',sans-serif]"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>নতুন পিন সেভ করুন</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: SUPABASE CONNECTION */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                      সুপাবেস (Supabase) ডেটাবেস ও স্টোরেজ সংযোগ
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                      আপনার নিজস্ব Supabase প্রজেক্ট কানেক্ট করে সিভি ও পোর্টফোলিওর ডেটা ক্লাউডে স্থায়ীভাবে সংরক্ষণ করুন।
                    </p>
                  </div>

                  {/* Supabase inputs */}
                  <div className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100/80 dark:border-neutral-800 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        Supabase Project URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-project-id.supabase.co"
                        value={supabaseConfigState.url}
                        onChange={(e) => setSupabaseConfigState({ ...supabaseConfigState, url: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1 font-['Archivo',sans-serif]">
                        Supabase Anon Public API Key
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={supabaseConfigState.anonKey}
                        onChange={(e) => setSupabaseConfigState({ ...supabaseConfigState, anonKey: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                      />
                    </div>

                    {/* Supabase status display */}
                    {supabaseStatus && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          supabaseStatus.success
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {supabaseStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{supabaseStatus.message}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleTestSupabase}
                        disabled={supabaseTesting || !supabaseConfigState.url}
                        className="px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer font-['Archivo',sans-serif]"
                      >
                        {supabaseTesting ? 'পরীক্ষা করা হচ্ছে...' : 'কানেকশন টেস্ট করুন'}
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveSupabaseConfig}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-colors cursor-pointer font-['Archivo',sans-serif]"
                      >
                        কনফিগারেশন সেভ করুন
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncSupabase}
                        disabled={syncing || !supabaseConfigState.url}
                        className="px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-full transition-colors cursor-pointer font-['Archivo',sans-serif]"
                      >
                        {syncing ? 'সিঙ্ক হচ্ছে...' : 'সুপাবেসে সিঙ্ক করুন'}
                      </button>
                    </div>
                  </div>

                  {/* One-Click SQL Setup Guide */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-['Archivo',sans-serif]">
                          Supabase SQL সেটআপ স্ক্রিপ্ট (১-ক্লিক কপি)
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          আপনার Supabase ড্যাশবোর্ডের <strong>SQL Editor</strong> এ গিয়ে নিচের কোডটি পেস্ট করে Run দিন:
                        </p>
                      </div>

                      <button
                        onClick={handleCopySql}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FD6F41] bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 rounded-full transition-colors cursor-pointer font-['Archivo',sans-serif]"
                      >
                        {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{sqlCopied ? 'কপি হয়েছে!' : 'SQL কপি করুন'}</span>
                      </button>
                    </div>

                    <pre className="p-3 rounded-xl bg-neutral-900 text-neutral-300 font-mono text-[11px] overflow-x-auto max-h-48">
                      {SUPABASE_SETUP_SQL}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
