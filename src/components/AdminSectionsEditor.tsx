import React, { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ServiceItem, SkillBarItem, PrepressItem, Experience, Education } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Printer,
  Globe,
  Heart,
  UserCheck,
  User,
} from 'lucide-react';

interface AdminSectionsEditorProps {
  activeTab: 'services' | 'skills' | 'experience' | 'about';
  onStatusMessage: (type: 'success' | 'error', message: string) => void;
}

export const AdminSectionsEditor: React.FC<AdminSectionsEditorProps> = ({ activeTab, onStatusMessage }) => {
  const {
    personalInfo,
    services,
    skillBars,
    prepressChecklist,
    experiences,
    educationList,
    professionalQualifications,
    referencePerson,
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
  } = usePortfolioData();

  // --- 1. SERVICES STATE ---
  const [editingServiceIdx, setEditingServiceIdx] = useState<number | null>(null);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    id: '',
    title: '',
    desc: '',
    tools: 'Adobe Illustrator',
    iconName: 'PenTool',
    colorTheme: 'orange',
  });

  // --- 2. SKILLS & PREPRESS STATE ---
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPercent, setNewSkillPercent] = useState(90);
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);

  const [isPrepressFormOpen, setIsPrepressFormOpen] = useState(false);
  const [editingPrepressIdx, setEditingPrepressIdx] = useState<number | null>(null);
  const [prepressForm, setPrepressForm] = useState<PrepressItem>({ id: '', title: '', desc: '' });

  // --- 3. EXPERIENCE & EDUCATION STATE ---
  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    location: '',
    period: '',
    current: false,
    type: 'Full-Time',
    achievementsText: '',
    toolsText: '',
  });

  const [isEduFormOpen, setIsEduFormOpen] = useState(false);
  const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<Education>({
    degree: '',
    institute: '',
    board: 'Rajshahi',
    group: 'Commerce',
    result: '',
    passingYear: '',
  });

  // --- 4. ABOUT, DETAILS, QUALIFICATIONS, LANGUAGES, HOBBIES, REFERENCE STATE ---
  const [detailsForm, setDetailsForm] = useState({
    fatherName: personalInfo.personalDetails.fatherName,
    motherName: personalInfo.personalDetails.motherName,
    dob: personalInfo.personalDetails.dob,
    religion: personalInfo.personalDetails.religion,
    maritalStatus: personalInfo.personalDetails.maritalStatus,
    nationality: personalInfo.personalDetails.nationality,
    bloodGroup: personalInfo.personalDetails.bloodGroup,
    permanentAddress: personalInfo.permanentAddress,
    aboutStory: personalInfo.aboutStory || '',
    declarationText: personalInfo.declarationText || '',
  });

  const [newQualification, setNewQualification] = useState('');
  const [newLang, setNewLang] = useState({ name: '', level: 'Fluent', proficiency: 85 });
  const [newHobby, setNewHobby] = useState({ name: '', description: '' });
  const [refForm, setRefForm] = useState(referencePerson);

  // ================= SERVICES HANDLERS =================
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title.trim()) return;
    const item: ServiceItem = {
      ...serviceForm,
      id: serviceForm.id || `srv-${Date.now()}`,
    };
    const updated =
      editingServiceIdx !== null
        ? services.map((s, i) => (i === editingServiceIdx ? item : s))
        : [...services, item];
    await updateServices(updated);
    setIsServiceFormOpen(false);
    setEditingServiceIdx(null);
    onStatusMessage('success', 'সার্ভিস কার্ড সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleDeleteService = async (idx: number) => {
    const updated = services.filter((_, i) => i !== idx);
    await updateServices(updated);
    onStatusMessage('success', 'সার্ভিস মুছে ফেলা হয়েছে।');
  };

  // ================= SKILLS & PREPRESS HANDLERS =================
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const item: SkillBarItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      percentage: Math.min(100, Math.max(10, Number(newSkillPercent) || 90)),
    };
    const updated =
      editingSkillIdx !== null
        ? skillBars.map((s, i) => (i === editingSkillIdx ? { ...item, id: s.id } : s))
        : [...skillBars, item];
    await updateSkillBars(updated);
    setNewSkillName('');
    setNewSkillPercent(90);
    setEditingSkillIdx(null);
    onStatusMessage('success', 'স্কিল বার আপডেট করা হয়েছে!');
  };

  const handleDeleteSkill = async (idx: number) => {
    await updateSkillBars(skillBars.filter((_, i) => i !== idx));
    onStatusMessage('success', 'স্কিল মুছে ফেলা হয়েছে।');
  };

  const handleSavePrepress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prepressForm.title.trim()) return;
    const item: PrepressItem = {
      id: prepressForm.id || `pp-${Date.now()}`,
      title: prepressForm.title.trim(),
      desc: prepressForm.desc.trim(),
    };
    const updated =
      editingPrepressIdx !== null
        ? prepressChecklist.map((p, i) => (i === editingPrepressIdx ? item : p))
        : [...prepressChecklist, item];
    await updatePrepressChecklist(updated);
    setIsPrepressFormOpen(false);
    setEditingPrepressIdx(null);
    onStatusMessage('success', 'প্রি-প্রেস স্ট্যান্ডার্ড আইটেম সেভ করা হয়েছে!');
  };

  // ================= EXPERIENCE & EDUCATION HANDLERS =================
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.role.trim() || !expForm.company.trim()) return;
    const newExp: Experience = {
      role: expForm.role.trim(),
      company: expForm.company.trim(),
      location: expForm.location.trim(),
      period: expForm.period.trim(),
      current: expForm.current,
      type: expForm.type.trim() || 'Full-Time',
      achievements: expForm.achievementsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      toolsUsed: expForm.toolsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const updated =
      editingExpIdx !== null
        ? experiences.map((ex, i) => (i === editingExpIdx ? newExp : ex))
        : [newExp, ...experiences];
    await updateExperiences(updated);
    setIsExpFormOpen(false);
    setEditingExpIdx(null);
    onStatusMessage('success', 'কাজের অভিজ্ঞতা (Work Experience) সংরক্ষিত হয়েছে!');
  };

  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institute.trim()) return;
    const updated =
      editingEduIdx !== null
        ? educationList.map((ed, i) => (i === editingEduIdx ? eduForm : ed))
        : [...educationList, eduForm];
    await updateEducationList(updated);
    setIsEduFormOpen(false);
    setEditingEduIdx(null);
    onStatusMessage('success', 'শিক্ষাগত যোগ্যতা (Education) সংরক্ষিত হয়েছে!');
  };

  // ================= ABOUT & CV DETAILS HANDLERS =================
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePersonalInfo({
      permanentAddress: detailsForm.permanentAddress,
      aboutStory: detailsForm.aboutStory,
      declarationText: detailsForm.declarationText,
      personalDetails: {
        fatherName: detailsForm.fatherName,
        motherName: detailsForm.motherName,
        dob: detailsForm.dob,
        religion: detailsForm.religion,
        maritalStatus: detailsForm.maritalStatus,
        nationality: detailsForm.nationality,
        bloodGroup: detailsForm.bloodGroup,
      },
    });
    onStatusMessage('success', 'সিভির ব্যক্তিগত বিবরণ ও অঙ্গীকারনামা আপডেট হয়েছে!');
  };

  const handleAddQualification = async () => {
    if (!newQualification.trim()) return;
    await updateQualifications([...professionalQualifications, newQualification.trim()]);
    setNewQualification('');
    onStatusMessage('success', 'নতুন যোগ্যতা যুক্ত হয়েছে!');
  };

  const handleAddLanguage = async () => {
    if (!newLang.name.trim()) return;
    const updated = [...personalInfo.languages, { ...newLang, proficiency: Number(newLang.proficiency) || 85 }];
    await updatePersonalInfo({ languages: updated });
    setNewLang({ name: '', level: 'Fluent', proficiency: 85 });
    onStatusMessage('success', 'ভাষা যুক্ত হয়েছে!');
  };

  const handleRemoveLanguage = async (idx: number) => {
    const updated = personalInfo.languages.filter((_, i) => i !== idx);
    await updatePersonalInfo({ languages: updated });
  };

  const handleAddHobby = async () => {
    if (!newHobby.name.trim()) return;
    const updated = [...personalInfo.hobbies, newHobby];
    await updatePersonalInfo({ hobbies: updated });
    setNewHobby({ name: '', description: '' });
    onStatusMessage('success', 'শখ (Hobby) যুক্ত হয়েছে!');
  };

  const handleRemoveHobby = async (idx: number) => {
    const updated = personalInfo.hobbies.filter((_, i) => i !== idx);
    await updatePersonalInfo({ hobbies: updated });
  };

  const handleSaveReference = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateReferencePerson(refForm);
    onStatusMessage('success', 'রেফারেন্স ব্যক্তির তথ্য আপডেট করা হয়েছে!');
  };

  return (
    <div className="space-y-8">
      {/* ================= TAB: SERVICES ================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FD6F41]" />
                <span>সার্ভিস সমূহ (Creative Services)</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                আপনার প্রদত্ত সার্ভিস কার্ডগুলো ইচ্ছামত যোগ, এডিট বা ডিলিট করুন।
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingServiceIdx(null);
                  setServiceForm({
                    id: '',
                    title: '',
                    desc: '',
                    tools: 'Adobe Illustrator',
                    iconName: 'PenTool',
                    colorTheme: 'orange',
                  });
                  setIsServiceFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সার্ভিস যোগ করুন</span>
              </button>
              <button
                type="button"
                onClick={resetServices}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-rose-500 rounded-full cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            </div>
          </div>

          {isServiceFormOpen && (
            <form onSubmit={handleSaveService} className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-700 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">সার্ভিসের নাম (Title) *</label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    placeholder="Brand Identity & Logo"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">টুলস / সাব-লেবেল (Tools)</label>
                  <input
                    type="text"
                    value={serviceForm.tools}
                    onChange={(e) => setServiceForm({ ...serviceForm, tools: e.target.value })}
                    placeholder="Adobe Illustrator"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">আইকন (Icon)</label>
                  <select
                    value={serviceForm.iconName}
                    onChange={(e) => setServiceForm({ ...serviceForm, iconName: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  >
                    <option value="PenTool">PenTool (ভেক্টর/লোগো)</option>
                    <option value="Printer">Printer (অফসেট/প্রিন্ট)</option>
                    <option value="Megaphone">Megaphone (সাইনবোর্ড/মার্কেটিং)</option>
                    <option value="Sparkles">Sparkles (সোশ্যাল মিডিয়া/ক্রিয়েটিভ)</option>
                    <option value="Palette">Palette (কালার/ডিজাইন)</option>
                    <option value="Layers">Layers (লেআউট/প্যাকেজিং)</option>
                    <option value="Image">Image (ফটো এডিটিং)</option>
                    <option value="Monitor">Monitor (ডিজিটাল মিডিয়া)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">কার্ড থিম কালার (Color)</label>
                  <select
                    value={serviceForm.colorTheme}
                    onChange={(e) => setServiceForm({ ...serviceForm, colorTheme: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  >
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="amber">Amber</option>
                    <option value="teal">Teal</option>
                    <option value="blue">Blue</option>
                    <option value="rose">Rose</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">বিবরণ (Description) *</label>
                  <textarea
                    rows={3}
                    required
                    value={serviceForm.desc}
                    onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-500 rounded-full"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] rounded-full"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((srv, idx) => (
              <div key={srv.id || idx} className="p-4 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-[#111827] dark:text-white">{srv.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-[#FD6F41] font-bold">
                      {srv.tools}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{srv.desc}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingServiceIdx(idx);
                      setServiceForm(srv);
                      setIsServiceFormOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:text-[#FD6F41] rounded-lg cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>এডিট</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteService(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: SKILLS & PREPRESS ================= */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Skill Progress Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                  স্কিল ও দক্ষতা বার (My Experience Area)
                </h3>
                <p className="text-xs text-neutral-500">স্কিলের নাম এবং পার্সেন্টেজ (%) যোগ, এডিট বা ডিলিট করুন।</p>
              </div>
              <button
                type="button"
                onClick={resetSkillBars}
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-rose-500 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="p-4 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-800 flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold mb-1">স্কিলের নাম (Skill Name)</label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="যেমন: Adobe Illustrator (Expert)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-xs font-bold mb-1">পার্সেন্টেজ ({newSkillPercent}%)</label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={newSkillPercent}
                  onChange={(e) => setNewSkillPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-xl cursor-pointer shrink-0"
              >
                {editingSkillIdx !== null ? 'আপডেট করুন' : '+ যোগ করুন'}
              </button>
              {editingSkillIdx !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillIdx(null);
                    setNewSkillName('');
                    setNewSkillPercent(90);
                  }}
                  className="px-3 py-2 text-xs text-neutral-500"
                >
                  বাতিল
                </button>
              )}
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skillBars.map((sk, idx) => (
                <div key={sk.id || idx} className="p-3 rounded-xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111827] dark:text-white truncate">{sk.name}</p>
                    <span className="text-[11px] font-mono text-[#FD6F41] font-bold">{sk.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkillIdx(idx);
                        setNewSkillName(sk.name);
                        setNewSkillPercent(sk.percentage);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-[#FD6F41] rounded-lg cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Press Checklist */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                  <Printer className="w-4 h-4 text-[#FD6F41]" />
                  <span>অফসেট ও প্রি-প্রেস স্ট্যান্ডার্ড চেকলিস্ট</span>
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPrepressIdx(null);
                    setPrepressForm({ id: '', title: '', desc: '' });
                    setIsPrepressFormOpen(true);
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-full cursor-pointer"
                >
                  + নতুন পয়েন্ট যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={resetPrepressChecklist}
                  className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer"
                >
                  রিসেট
                </button>
              </div>
            </div>

            {isPrepressFormOpen && (
              <form onSubmit={handleSavePrepress} className="p-4 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-700 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="শিরোনাম (যেমন: CMYK Separation & Ink Limits)"
                  value={prepressForm.title}
                  onChange={(e) => setPrepressForm({ ...prepressForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="বিবরণ লিখুন..."
                  value={prepressForm.desc}
                  onChange={(e) => setPrepressForm({ ...prepressForm, desc: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsPrepressFormOpen(false)} className="px-3 py-1.5 text-xs text-neutral-500">
                    বাতিল
                  </button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-full">
                    সেভ করুন
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prepressChecklist.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 rounded-xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-[#111827] dark:text-white mb-1">{item.title}</h5>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPrepressIdx(idx);
                        setPrepressForm(item);
                        setIsPrepressFormOpen(true);
                      }}
                      className="text-xs text-[#FD6F41] font-bold hover:underline cursor-pointer"
                    >
                      এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePrepressChecklist(prepressChecklist.filter((_, i) => i !== idx))}
                      className="text-xs text-rose-500 font-bold hover:underline cursor-pointer ml-2"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: EXPERIENCE & EDUCATION ================= */}
      {activeTab === 'experience' && (
        <div className="space-y-8">
          {/* Work Experience */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                  <Briefcase className="w-5 h-5 text-[#FD6F41]" />
                  <span>কাজের অভিজ্ঞতা (Work Experience)</span>
                </h3>
                <p className="text-xs text-neutral-500">আপনার চাকরি ও কাজের অভিজ্ঞতাগুলো যোগ, এডিট বা ডিলিট করুন।</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpIdx(null);
                    setExpForm({
                      role: '',
                      company: '',
                      location: '',
                      period: '',
                      current: false,
                      type: 'Full-Time',
                      achievementsText: '',
                      toolsText: 'Adobe Illustrator, Adobe Photoshop',
                    });
                    setIsExpFormOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] rounded-full cursor-pointer"
                >
                  + নতুন অভিজ্ঞতা যোগ করুন
                </button>
                <button type="button" onClick={resetExperiences} className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer">
                  রিসেট
                </button>
              </div>
            </div>

            {isExpFormOpen && (
              <form onSubmit={handleSaveExp} className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-700 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">পদবী (Role) *</label>
                    <input
                      type="text"
                      required
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      placeholder="Senior Graphic Designer"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">প্রতিষ্ঠানের নাম (Company) *</label>
                    <input
                      type="text"
                      required
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      placeholder="AR Digital Sign"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">সময়কাল (Period)</label>
                    <input
                      type="text"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                      placeholder="2022 — Present"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">লোকেশন (Location)</label>
                    <input
                      type="text"
                      value={expForm.location}
                      onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                      placeholder="Abdul Hamid Road, Pabna"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={expForm.current}
                        onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                        className="rounded text-[#FD6F41]"
                      />
                      <span>বর্তমানে এখানে কর্মরত (Current Job)</span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1">দায়িত্ব ও অর্জনসমূহ (প্রতি লাইনে একটি করে পয়েন্ট লিখুন)</label>
                    <textarea
                      rows={4}
                      value={expForm.achievementsText}
                      onChange={(e) => setExpForm({ ...expForm, achievementsText: e.target.value })}
                      placeholder="প্রতি লাইনে একটি করে কাজের বিবরণ লিখুন..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold mb-1">ব্যবহৃত টুলস (কমা দিয়ে লিখুন)</label>
                    <input
                      type="text"
                      value={expForm.toolsText}
                      onChange={(e) => setExpForm({ ...expForm, toolsText: e.target.value })}
                      placeholder="Adobe Illustrator, Adobe Photoshop, CMYK Separation"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsExpFormOpen(false)} className="px-4 py-1.5 text-xs text-neutral-500">
                    বাতিল
                  </button>
                  <button type="submit" className="px-5 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-full">
                    সেভ করুন
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#111827] dark:text-white">{exp.role}</h4>
                      <span className="text-xs text-[#FD6F41] font-bold">({exp.period})</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">{exp.company} · {exp.location}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExpIdx(idx);
                        setExpForm({
                          role: exp.role,
                          company: exp.company,
                          location: exp.location,
                          period: exp.period,
                          current: exp.current,
                          type: exp.type,
                          achievementsText: (exp.achievements || []).join('\n'),
                          toolsText: (exp.toolsUsed || []).join(', '),
                        });
                        setIsExpFormOpen(true);
                      }}
                      className="px-3 py-1 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:text-[#FD6F41] rounded-lg cursor-pointer"
                    >
                      এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() => updateExperiences(experiences.filter((_, i) => i !== idx))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Education */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                  <GraduationCap className="w-5 h-5 text-[#FD6F41]" />
                  <span>শিক্ষাগত যোগ্যতা (Academic Education)</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingEduIdx(null);
                    setEduForm({ degree: '', institute: '', board: 'Rajshahi', group: 'Commerce', result: '', passingYear: '' });
                    setIsEduFormOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] rounded-full cursor-pointer"
                >
                  + নতুন ডিগ্রি যোগ করুন
                </button>
                <button type="button" onClick={resetEducationList} className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer">
                  রিসেট
                </button>
              </div>
            </div>

            {isEduFormOpen && (
              <form onSubmit={handleSaveEdu} className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-200 dark:border-neutral-700 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">ডিগ্রি / পরীক্ষার নাম *</label>
                    <input
                      type="text"
                      required
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      placeholder="Higher Secondary Certificate (HSC)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">শিক্ষা প্রতিষ্ঠান (Institute) *</label>
                    <input
                      type="text"
                      required
                      value={eduForm.institute}
                      onChange={(e) => setEduForm({ ...eduForm, institute: e.target.value })}
                      placeholder="Islamia Digri College Pabna"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">বোর্ড (Board)</label>
                    <input
                      type="text"
                      value={eduForm.board}
                      onChange={(e) => setEduForm({ ...eduForm, board: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">বিভাগ (Group)</label>
                    <input
                      type="text"
                      value={eduForm.group}
                      onChange={(e) => setEduForm({ ...eduForm, group: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">ফলাফল (Result)</label>
                    <input
                      type="text"
                      value={eduForm.result}
                      onChange={(e) => setEduForm({ ...eduForm, result: e.target.value })}
                      placeholder="GPA 3.50 (Out of 5.00)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">পাশের সাল (Passing Year)</label>
                    <input
                      type="text"
                      value={eduForm.passingYear}
                      onChange={(e) => setEduForm({ ...eduForm, passingYear: e.target.value })}
                      placeholder="2009"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsEduFormOpen(false)} className="px-4 py-1.5 text-xs text-neutral-500">
                    বাতিল
                  </button>
                  <button type="submit" className="px-5 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-full">
                    সেভ করুন
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {educationList.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#111827] dark:text-white">{edu.degree}</h4>
                    <p className="text-xs text-neutral-500">{edu.institute} · {edu.result} · {edu.passingYear}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEduIdx(idx);
                        setEduForm(edu);
                        setIsEduFormOpen(true);
                      }}
                      className="px-3 py-1 text-xs font-bold bg-neutral-100 dark:bg-neutral-800 hover:text-[#FD6F41] rounded-lg cursor-pointer"
                    >
                      এডিট
                    </button>
                    <button
                      type="button"
                      onClick={() => updateEducationList(educationList.filter((_, i) => i !== idx))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
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

      {/* ================= TAB: ABOUT, PERSONAL DETAILS, LANGUAGES, HOBBIES, REFERENCE ================= */}
      {activeTab === 'about' && (
        <div className="space-y-8">
          {/* 1. Personal Details from CV */}
          <form onSubmit={handleSaveDetails} className="p-5 rounded-2xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                <User className="w-5 h-5 text-[#FD6F41]" />
                <span>সিভির ব্যক্তিগত তথ্য ও বিবরণ (Personal Details)</span>
              </h3>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>সেভ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">পিতার নাম (Father's Name)</label>
                <input
                  type="text"
                  value={detailsForm.fatherName}
                  onChange={(e) => setDetailsForm({ ...detailsForm, fatherName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">মাতার নাম (Mother's Name)</label>
                <input
                  type="text"
                  value={detailsForm.motherName}
                  onChange={(e) => setDetailsForm({ ...detailsForm, motherName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">জন্ম তারিখ (Date of Birth)</label>
                <input
                  type="text"
                  value={detailsForm.dob}
                  onChange={(e) => setDetailsForm({ ...detailsForm, dob: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">রক্তের গ্রুপ (Blood Group)</label>
                <input
                  type="text"
                  value={detailsForm.bloodGroup}
                  onChange={(e) => setDetailsForm({ ...detailsForm, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">ধর্ম (Religion)</label>
                <input
                  type="text"
                  value={detailsForm.religion}
                  onChange={(e) => setDetailsForm({ ...detailsForm, religion: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">বৈবাহিক অবস্থা (Marital Status)</label>
                <input
                  type="text"
                  value={detailsForm.maritalStatus}
                  onChange={(e) => setDetailsForm({ ...detailsForm, maritalStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">জাতীয়তা (Nationality)</label>
                <input
                  type="text"
                  value={detailsForm.nationality}
                  onChange={(e) => setDetailsForm({ ...detailsForm, nationality: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">স্থায়ী ঠিকানা (Permanent Address)</label>
                <input
                  type="text"
                  value={detailsForm.permanentAddress}
                  onChange={(e) => setDetailsForm({ ...detailsForm, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">অ্যাবাউট সেকশন অতিরিক্ত বিবরণ (About Biography Text)</label>
                <textarea
                  rows={2}
                  value={detailsForm.aboutStory}
                  onChange={(e) => setDetailsForm({ ...detailsForm, aboutStory: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1">সিভি অঙ্গীকারনামা (Official CV Declaration)</label>
                <textarea
                  rows={2}
                  value={detailsForm.declarationText}
                  onChange={(e) => setDetailsForm({ ...detailsForm, declarationText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                />
              </div>
            </div>
          </form>

          {/* 2. Professional Qualifications */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                <Award className="w-4 h-4 text-[#FD6F41]" />
                <span>পেশাগত যোগ্যতা (Professional Qualifications)</span>
              </h4>
              <button type="button" onClick={resetQualifications} className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer">
                রিসেট
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="নতুন পেশাগত যোগ্যতা পয়েন্ট লিখুন..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
              <button
                type="button"
                onClick={handleAddQualification}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FD6F41] rounded-xl cursor-pointer"
              >
                + যোগ করুন
              </button>
            </div>
            <ul className="space-y-2">
              {professionalQualifications.map((q, idx) => (
                <li key={idx} className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-2 text-xs">
                  <span>• {q}</span>
                  <button
                    type="button"
                    onClick={() => updateQualifications(professionalQualifications.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:underline shrink-0 cursor-pointer"
                  >
                    মুছুন
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Languages & Hobbies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h4 className="text-sm font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                <Globe className="w-4 h-4 text-[#FD6F41]" />
                <span>ভাষা দক্ষতা (Languages)</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="ভাষা (e.g. Arabic)"
                  value={newLang.name}
                  onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
                <input
                  type="text"
                  placeholder="লেভেল (Fluent)"
                  value={newLang.level}
                  onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-lg cursor-pointer"
                >
                  + যোগ
                </button>
              </div>
              <div className="space-y-2">
                {personalInfo.languages.map((l, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between text-xs">
                    <span><strong>{l.name}</strong> — {l.level} ({l.proficiency}%)</span>
                    <button type="button" onClick={() => handleRemoveLanguage(idx)} className="text-rose-500 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 space-y-3">
              <h4 className="text-sm font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>শখ ও আগ্রহ (Hobbies)</span>
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="শখের নাম (যেমন: Reading)"
                  value={newHobby.name}
                  onChange={(e) => setNewHobby({ ...newHobby, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="সংক্ষিপ্ত বিবরণ..."
                    value={newHobby.description}
                    onChange={(e) => setNewHobby({ ...newHobby, description: e.target.value })}
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddHobby}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-lg cursor-pointer"
                  >
                    + যোগ
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {personalInfo.hobbies.map((h, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between text-xs">
                    <span className="truncate"><strong>{h.name}:</strong> {h.description}</span>
                    <button type="button" onClick={() => handleRemoveHobby(idx)} className="text-rose-500 shrink-0 ml-2 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Official Reference Person */}
          <form onSubmit={handleSaveReference} className="p-5 rounded-2xl bg-white dark:bg-[#1E1B18] border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#111827] dark:text-white flex items-center gap-2 font-['Archivo',sans-serif]">
                <UserCheck className="w-4 h-4 text-[#FD6F41]" />
                <span>সিভি রেফারেন্স ব্যক্তি (Official Reference)</span>
              </h4>
              <div className="flex items-center gap-2">
                <button type="button" onClick={resetReferencePerson} className="text-xs text-neutral-400 hover:text-rose-500 cursor-pointer">
                  রিসেট
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-[#FD6F41] rounded-full cursor-pointer">
                  রেফারেন্স সেভ করুন
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="নাম (Name)"
                value={refForm.name}
                onChange={(e) => setRefForm({ ...refForm, name: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
              <input
                type="text"
                placeholder="পদবী (Role)"
                value={refForm.role}
                onChange={(e) => setRefForm({ ...refForm, role: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
              <input
                type="text"
                placeholder="মোবাইল (Phone)"
                value={refForm.phone}
                onChange={(e) => setRefForm({ ...refForm, phone: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
              <input
                type="text"
                placeholder="ঠিকানা (Location)"
                value={refForm.location}
                onChange={(e) => setRefForm({ ...refForm, location: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
