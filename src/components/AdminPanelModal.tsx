import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Project } from '../types';
import { FormattedDescription } from './FormattedDescription';
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
  Image as ImageIcon,
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
  RotateCcw,
  Briefcase,
  Plus,
  Edit2,
  ExternalLink,
  Link as LinkIcon,
  Layers,
  Sparkles
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
  } = usePortfolioData();

  // Authentication PIN state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [storedPin, setStoredPin] = useState(() => {
    return localStorage.getItem('ashraful_admin_pin') || '1234';
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<'projects' | 'cv' | 'photo' | 'info' | 'security' | 'supabase'>('projects');

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

  // Project Management State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'print',
    categoryLabel: 'Signage & Outdoor',
    year: new Date().getFullYear().toString(),
    client: '',
    image: '',
    summary: '',
    linkUrl: '',
    linkLabel: 'View on Behance',
    tools: 'Adobe Illustrator, Adobe Photoshop',
  });

  // Hyperlink Helper Modal State for Description
  const [isLinkHelperOpen, setIsLinkHelperOpen] = useState(false);
  const [linkInputUrl, setLinkInputUrl] = useState('');
  const [linkInputText, setLinkInputText] = useState('');

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

  // -------------------------------------------------------------
  // Project Management Handlers
  // -------------------------------------------------------------

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'print',
      categoryLabel: 'Signage & Outdoor',
      year: new Date().getFullYear().toString(),
      client: '',
      image: '',
      summary: '',
      linkUrl: '',
      linkLabel: 'View on Behance',
      tools: 'Adobe Illustrator, Adobe Photoshop',
    });
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      category: proj.category || 'print',
      categoryLabel: proj.categoryLabel || 'Signage & Outdoor',
      year: proj.year || new Date().getFullYear().toString(),
      client: proj.client || '',
      image: proj.image || '',
      summary: proj.summary || '',
      linkUrl: proj.linkUrl || '',
      linkLabel: proj.linkLabel || 'View on Behance',
      tools: proj.tools ? proj.tools.join(', ') : 'Adobe Illustrator, Adobe Photoshop',
    });
    setIsProjectFormOpen(true);
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProjectImageUploading(true);
    const res = await uploadProjectImage(file);
    if (res.success && res.url) {
      setProjectForm((prev) => ({ ...prev, image: res.url! }));
    } else {
      alert(res.error || 'ছবি আপলোড করতে ব্যর্থ হয়েছে।');
    }
    setProjectImageUploading(false);
    if (projectImageInputRef.current) projectImageInputRef.current.value = '';
  };

  const handleInsertHyperlink = () => {
    if (!linkInputUrl) {
      alert('দয়া করে হাইপারলিংকের URL দিন (যেমন: https://behance.net/...)');
      return;
    }

    let url = linkInputUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    const label = linkInputText.trim() || 'প্রোজেক্ট লিংক দেখুন';
    const markdownLink = `[${label}](${url})`;

    // Insert into textarea at current cursor or append
    const textarea = descriptionTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentText = projectForm.summary;
      const updated = currentText.substring(0, start) + markdownLink + currentText.substring(end);
      setProjectForm({ ...projectForm, summary: updated });
    } else {
      setProjectForm((prev) => ({
        ...prev,
        summary: prev.summary ? `${prev.summary} ${markdownLink}` : markdownLink,
      }));
    }

    setLinkInputUrl('');
    setLinkInputText('');
    setIsLinkHelperOpen(false);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectForm.title.trim()) {
      alert('প্রোজেক্টের শিরোনাম (Title) দিন');
      return;
    }

    if (!projectForm.image) {
      alert('প্রোজেক্টের জন্য একটি ছবি নির্বাচন বা আপলোড করুন');
      return;
    }

    // Determine category label
    let catLabel = projectForm.categoryLabel;
    if (projectForm.category === 'print') catLabel = 'Signage & Outdoor';
    else if (projectForm.category === 'branding') catLabel = 'Brand Identity';
    else if (projectForm.category === 'packaging') catLabel = 'Packaging & Offset';
    else if (projectForm.category === 'social') catLabel = 'Social Media & Ads';
    else if (projectForm.category === 'retouching') catLabel = 'Photo Retouching';

    const toolsArray = projectForm.tools
      ? projectForm.tools.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Adobe Illustrator', 'Adobe Photoshop'];

    if (editingProjectId) {
      // Update existing
      const res = await updateProject(editingProjectId, {
        title: projectForm.title.trim(),
        category: projectForm.category,
        categoryLabel: catLabel,
        year: projectForm.year.trim(),
        client: projectForm.client.trim(),
        image: projectForm.image,
        summary: projectForm.summary.trim(),
        linkUrl: projectForm.linkUrl.trim(),
        linkLabel: projectForm.linkLabel.trim() || 'View Project',
        tools: toolsArray,
      });

      if (res.success) {
        setIsProjectFormOpen(false);
        setEditingProjectId(null);
        setUploadStatus({ type: 'success', message: 'প্রোজেক্ট সফলভাবে আপডেট করা হয়েছে!' });
        setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 3000);
      } else {
        alert(res.error || 'আপডেট করতে ব্যর্থ হয়েছে।');
      }
    } else {
      // Add new
      const res = await addProject({
        title: projectForm.title.trim(),
        category: projectForm.category,
        categoryLabel: catLabel,
        year: projectForm.year.trim(),
        client: projectForm.client.trim() || 'Commercial Client',
        image: projectForm.image,
        summary: projectForm.summary.trim() || 'Creative graphic design & pre-press project by Md. Ashraful Islam.',
        linkUrl: projectForm.linkUrl.trim(),
        linkLabel: projectForm.linkLabel.trim() || 'View Project',
        tools: toolsArray,
        challenge: 'Commercial production challenge addressing brand visibility and print precision.',
        solution: 'Executed high-precision vector artwork and print calibrations for offset reproduction.',
        deliverables: ['Production artwork vector file', 'High-res print output', 'Client approval showcase'],
        colorProfile: 'CMYK (FOGRA39)',
        aspectRatio: 'standard',
        featured: true,
      });

      if (res.success) {
        setIsProjectFormOpen(false);
        setUploadStatus({ type: 'success', message: 'নতুন প্রোজেক্ট সফলভাবে আপলোড করা হয়েছে!' });
        setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 3000);
      } else {
        alert(res.error || 'প্রোজেক্ট যোগ করতে ব্যর্থ হয়েছে।');
      }
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে "${title}" প্রোজেক্টটি মুছে ফেলতে চান?`)) {
      const res = await deleteProject(id);
      if (res.success) {
        setUploadStatus({ type: 'success', message: `"${title}" প্রোজেক্টটি মুছে ফেলা হয়েছে।` });
        setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 3000);
      } else {
        alert(res.error || 'মুছে ফেলতে ব্যর্থ হয়েছে।');
      }
    }
  };

  const handleResetToDefaultProjects = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সমস্ত কাস্টম প্রোজেক্ট মুছে ডিফল্ট অরিজিনাল শোকেস প্রোজেক্টগুলোতে ফিরে যেতে চান?')) {
      await resetProjects();
      setUploadStatus({ type: 'success', message: 'প্রোজেক্ট তালিকা ডিফল্ট অরিজিনাল শোকেসে রিসেট করা হয়েছে।' });
      setTimeout(() => setUploadStatus({ type: 'idle', message: '' }), 3000);
    }
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
      <input
        type="file"
        ref={projectImageInputRef}
        onChange={handleProjectImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="relative w-full max-w-5xl bg-white dark:bg-[#1C1A18] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
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
                প্রোজেক্ট আপলোড ও ডিলিট, সিভি পিডিএফ, ছবি, তথ্য, পিন পরিবর্তন ও সুপাবেস
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
              {/* NEW TAB: My Amazing Works / Projects */}
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setIsProjectFormOpen(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer font-['Archivo',sans-serif] ${
                  activeTab === 'projects'
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-orange-100/50 dark:hover:bg-neutral-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>প্রোজেক্ট (My Works)</span>
              </button>

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
                <ImageIcon className="w-4 h-4" />
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

              {/* TAB: PROJECTS (MY AMAZING WORKS) */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] flex items-center gap-2">
                        <span>My Amazing Works — প্রোজেক্ট ম্যানেজমেন্ট</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#FD6F41] text-xs font-bold font-mono">
                          {projects.length} টি প্রোজেক্ট
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                        ছবি, হেডিং, ডিসক্রিপশন ও হাইপারলিংক দিয়ে নতুন প্রোজেক্ট আপলোড করুন অথবা ডিলিট করুন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isProjectFormOpen ? (
                        <button
                          type="button"
                          onClick={handleOpenAddProject}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer font-['Archivo',sans-serif]"
                        >
                          <Plus className="w-4 h-4" />
                          <span>নতুন প্রোজেক্ট আপলোড করুন</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsProjectFormOpen(false)}
                          className="px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                        >
                          বাতিল / বন্ধ করুন
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PROJECT ADD / EDIT FORM */}
                  {isProjectFormOpen && (
                    <form onSubmit={handleSaveProject} className="p-6 rounded-3xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-700 shadow-md space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-orange-100 dark:border-neutral-800">
                        <h4 className="text-sm sm:text-base font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#FD6F41]" />
                          <span>{editingProjectId ? 'প্রোজেক্ট সম্পাদনা (Edit Project)' : 'নতুন প্রোজেক্ট আপলোড (Add New Project)'}</span>
                        </h4>
                        <span className="text-xs text-neutral-500">সব তথ্য ফ্রন্টএন্ডে অবিলম্বে প্রদর্শিত হবে</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Heading / Title */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                            প্রোজেক্টের হেডিং / শিরোনাম (Title) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: Metropolitan Architectural Billboard Signage"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-['Archivo',sans-serif] font-bold focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                            ক্যাটাগরি (Category)
                          </label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                          >
                            <option value="print">Signage & Outdoor (বিলবোর্ড ও আউটডোর)</option>
                            <option value="branding">Brand Identity (ব্র্যান্ডিং ও লোগো)</option>
                            <option value="packaging">Packaging & Offset (প্যাকেজিং ও বক্স)</option>
                            <option value="social">Social Media & Ads (সোশ্যাল ডিজাইন)</option>
                            <option value="retouching">Photo Retouching (ফটো এডিটিং)</option>
                            <option value="other">অন্যান্য / কাস্টম</option>
                          </select>
                        </div>

                        {/* Year & Client */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                              সাল (Year)
                            </label>
                            <input
                              type="text"
                              value={projectForm.year}
                              onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                              placeholder="2024"
                              className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                              ক্লায়েন্ট (Client)
                            </label>
                            <input
                              type="text"
                              value={projectForm.client}
                              onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                              placeholder="AR Digital Sign"
                              className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                            />
                          </div>
                        </div>

                        {/* Image Upload / URL */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                            প্রোজেক্টের ছবি (Project Image) <span className="text-rose-500">*</span>
                          </label>

                          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                            {/* Image Preview Box */}
                            <div className="w-32 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
                              {projectForm.image ? (
                                <img
                                  src={projectForm.image}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-2">
                                  <ImageIcon className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                                  <span className="text-[10px] text-neutral-400">ছবি নেই</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 w-full space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => projectImageInputRef.current?.click()}
                                  disabled={projectImageUploading}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-xl shadow-xs transition-colors cursor-pointer font-['Archivo',sans-serif]"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{projectImageUploading ? 'ছবি আপলোড হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড করুন'}</span>
                                </button>
                                <span className="text-xs text-neutral-400">বা সরাসরি ইমেজ লিংক পেস্ট করুন:</span>
                              </div>

                              <input
                                type="url"
                                placeholder="https://images.unsplash.com/... বা অন্য কোনো ছবির লিংক"
                                value={projectForm.image.startsWith('data:') ? '(কাস্টম আপলোডকৃত ছবি সংরক্ষিত রয়েছে)' : projectForm.image}
                                onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FD6F41]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description with Hyperlink Toolbar */}
                        <div className="sm:col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 font-['Archivo',sans-serif]">
                              প্রোজেক্ট ডিসক্রিপশন (Description) <span className="text-rose-500">*</span>
                            </label>

                            {/* Hyperlink Helper Trigger */}
                            <button
                              type="button"
                              onClick={() => setIsLinkHelperOpen(true)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FD6F41] hover:text-[#E55B2F] bg-orange-100 dark:bg-orange-950/60 px-3 py-1 rounded-full cursor-pointer transition-colors"
                              title="ডিসক্রিপশনে যেকোনো ওয়েবসাইটের ক্লিকযোগ্য হাইপার লিংক যোগ করুন"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                              <span>[ 🔗 হাইপার লিংক যোগ করুন ]</span>
                            </button>
                          </div>

                          <textarea
                            ref={descriptionTextareaRef}
                            required
                            rows={4}
                            placeholder="প্রোজেক্টের বিস্তারিত বিবরণ লিখুন। চাইলে লিংক যোগ করতে [লিংকের নাম](https://website.com) লিখতে পারেন..."
                            value={projectForm.summary}
                            onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                            className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] leading-relaxed"
                          />

                          {/* Live Hyperlink Preview Box */}
                          {projectForm.summary && (
                            <div className="mt-2 p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FD6F41] block mb-1">
                                লাইভ প্রিভিউ (ভিজিটরদের যেভাবে লিংক ও লেখা দেখাবে):
                              </span>
                              <div className="text-neutral-700 dark:text-neutral-300">
                                <FormattedDescription text={projectForm.summary} />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Direct Project External Link (Optional) */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                            সরাসরি প্রজেক্ট লিংক (Project Link URL - Optional)
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.behance.net/gallery/..."
                            value={projectForm.linkUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, linkUrl: e.target.value })}
                            className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FD6F41]"
                          />
                        </div>

                        {/* Link Button Label */}
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                            লিংক বাটনের নাম (Button Label - Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: View on Behance বা Live Website"
                            value={projectForm.linkLabel}
                            onChange={(e) => setProjectForm({ ...projectForm, linkLabel: e.target.value })}
                            className="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FD6F41]"
                          />
                        </div>
                      </div>

                      {/* Submit & Cancel Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-orange-100 dark:border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setIsProjectFormOpen(false)}
                          className="px-5 py-2.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>

                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/25 transition-all cursor-pointer font-['Archivo',sans-serif]"
                        >
                          <Save className="w-4 h-4" />
                          <span>{editingProjectId ? 'আপডেট সংরক্ষণ করুন' : 'প্রোজেক্টটি সেভ ও পাবলিশ করুন'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Hyperlink Inserter Dialog Modal */}
                  {isLinkHelperOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
                      <div className="bg-white dark:bg-[#1C1A18] border border-neutral-300 dark:border-neutral-700 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 font-['Archivo',sans-serif]">
                            <LinkIcon className="w-4 h-4 text-[#FD6F41]" />
                            <span>হাইপার লিংক যুক্ত করুন</span>
                          </h4>
                          <button
                            onClick={() => setIsLinkHelperOpen(false)}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            ওয়েবসাইট বা প্রজেক্টের লিংক (URL) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://www.behance.net/..."
                            value={linkInputUrl}
                            onChange={(e) => setLinkInputUrl(e.target.value)}
                            autoFocus
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                            ডিসপ্লে টেক্সট / যে লেখায় ক্লিক করবে (Display Text)
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: বিহ্যান্স প্রজেক্ট দেখুন"
                            value={linkInputText}
                            onChange={(e) => setLinkInputText(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41]"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsLinkHelperOpen(false)}
                            className="px-4 py-2 text-xs font-bold text-neutral-500 hover:bg-neutral-100 rounded-xl"
                          >
                            বাতিল
                          </button>
                          <button
                            type="button"
                            onClick={handleInsertHyperlink}
                            className="px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-xl shadow-xs"
                          >
                            লিংক ইনসার্ট করুন
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE PROJECTS LIST */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold px-1">
                      <span>বর্তমানে ওয়েবসাইটে সক্রিয় সমস্ত প্রোজেক্ট:</span>
                      <button
                        type="button"
                        onClick={handleResetToDefaultProjects}
                        className="text-neutral-400 hover:text-rose-500 underline cursor-pointer"
                      >
                        ডিফল্ট শোকেসে রিসেট করুন
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {projects.map((proj, idx) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                        >
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            {/* Thumbnail */}
                            <div className="w-18 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200 dark:border-neutral-700">
                              <img
                                src={proj.image}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-[#FD6F41] text-[10px] font-bold">
                                  {proj.categoryLabel || proj.category}
                                </span>
                                {proj.year && (
                                  <span className="text-[10px] text-neutral-400">· {proj.year}</span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-[#111827] dark:text-white truncate font-['Archivo',sans-serif]">
                                {proj.title}
                              </h4>

                              <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-lg mt-0.5">
                                <FormattedDescription text={proj.summary} showIcon={false} />
                              </div>

                              {proj.linkUrl && (
                                <a
                                  href={proj.linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] text-[#FD6F41] hover:underline font-semibold mt-1"
                                >
                                  <span>{proj.linkLabel || 'প্রোজেক্ট লিংক'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProject(proj)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-orange-100 hover:text-[#FD6F41] rounded-xl transition-colors cursor-pointer"
                              title="এডিট করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>এডিট</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                              title="প্রোজেক্ট মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CV PDF UPLOAD & DOWNLOAD */}
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

              {/* TAB: PROFILE PHOTO */}
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

              {/* TAB: PERSONAL INFORMATION */}
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

              {/* TAB: PIN CHANGE & SECURITY */}
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

              {/* TAB: SUPABASE CONNECTION */}
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
