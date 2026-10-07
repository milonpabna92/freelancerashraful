import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Edit3,
  Save,
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const {
    personalInfo,
    customPhoto,
    isPhotoReady,
    cvFileInfo,
    experiences,
    educationList,
    skillBars,
    professionalQualifications,
    referencePerson,
    downloadCv,
    isDownloading,
    updatePersonalInfo,
  } = usePortfolioData();

  const [driveUrl, setDriveUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('ashraful_cv_drive_url') || personalInfo.googleDriveCvUrl;
    } catch {
      return personalInfo.googleDriveCvUrl;
    }
  });

  useEffect(() => {
    if (personalInfo.googleDriveCvUrl) {
      setDriveUrl(personalInfo.googleDriveCvUrl);
    }
  }, [personalInfo.googleDriveCvUrl]);

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(driveUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(driveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUrl = async () => {
    const trimmed = tempUrl.trim();
    if (trimmed) {
      setDriveUrl(trimmed);
      try {
        localStorage.setItem('ashraful_cv_drive_url', trimmed);
      } catch (e) {}
      await updatePersonalInfo({ googleDriveCvUrl: trimmed });
    }
    setIsEditingUrl(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const activePhoto = customPhoto || (isPhotoReady ? '/user-photo.png' : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1C1A18] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col my-auto max-h-[94vh]">
        {/* Modal Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#FFF9F6] dark:bg-[#121110]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
              Official Curriculum Vitae (CV)
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {cvFileInfo ? `${cvFileInfo.name}` : `${personalInfo.name} · ${personalInfo.role}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Guaranteed Download PDF Button */}
            <button
              onClick={downloadCv}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full transition-colors shadow-sm font-['Archivo',sans-serif] cursor-pointer"
              title="Download official CV PDF directly"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors font-['Archivo',sans-serif] cursor-pointer"
              title="Print CV or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Google Drive Link Config Bar */}
        <div className="px-6 py-2.5 bg-orange-50/60 dark:bg-orange-950/20 border-b border-orange-200/50 dark:border-orange-900/30 flex flex-wrap items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 gap-2">
          <div className="flex items-center gap-2 truncate max-w-xl">
            <span className="font-bold text-[#FD6F41] shrink-0 font-['Archivo',sans-serif]">Google Drive Link:</span>
            {isEditingUrl ? (
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="Paste your Google Drive share link here..."
                className="w-full sm:w-96 px-2.5 py-1 text-xs border border-orange-300 dark:border-orange-800 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#FD6F41]"
              />
            ) : (
              <span className="truncate text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                {driveUrl}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isEditingUrl ? (
              <button
                onClick={handleSaveUrl}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FD6F41] hover:underline font-['Archivo',sans-serif] cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Link</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-[#FD6F41] font-['Archivo',sans-serif] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <button
                  onClick={() => {
                    setTempUrl(driveUrl);
                    setIsEditingUrl(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-['Archivo',sans-serif] cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Printable CV Document Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-12 bg-white text-neutral-900">
          {/* PAGE 1 REPRODUCTION */}
          <div className="border border-neutral-300 rounded-lg p-6 sm:p-10 shadow-xs max-w-3xl mx-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-neutral-200">
              {/* Left Column of Page 1 */}
              <div className="md:col-span-5 border-r md:border-neutral-200 pr-0 md:pr-6 space-y-6">
                {/* Photo & Name */}
                <div className="text-center md:text-left">
                  <div
                    className="relative w-32 h-32 mx-auto md:mx-0 rounded-lg overflow-hidden border-2 border-neutral-300 mb-4 bg-neutral-100 select-none"
                    title=""
                  >
                    {activePhoto && (
                      <img
                        src={activePhoto}
                        alt={personalInfo.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase font-['Archivo',sans-serif]">
                    {personalInfo.name}
                  </h1>
                  <p className="text-sm font-bold text-[#1E88B5] mt-0.5 font-['Archivo',sans-serif]">
                    {personalInfo.role}
                  </p>
                </div>

                {/* Contact List */}
                <div className="text-xs space-y-2 text-neutral-700 pt-2 border-t border-neutral-200">
                  <p className="flex items-center gap-2">
                    <span className="font-bold w-16 text-neutral-500">Phone:</span>
                    <span>{personalInfo.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold w-16 text-neutral-500">Email:</span>
                    <span className="truncate">{personalInfo.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold w-16 text-neutral-500">Facebook:</span>
                    <span>{personalInfo.facebookHandle}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-bold w-16 text-neutral-500">Behance:</span>
                    <span>{personalInfo.behanceHandle}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold w-16 text-neutral-500 shrink-0">Address:</span>
                    <span>{personalInfo.presentAddress}</span>
                  </p>
                </div>

                {/* Career Objective */}
                <div className="pt-2 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] mb-2 font-['Archivo',sans-serif]">
                    Career Objective
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed text-justify">
                    {personalInfo.careerObjective}
                  </p>
                </div>

                {/* Languages */}
                <div className="pt-2 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] mb-2 font-['Archivo',sans-serif]">
                    Languages
                  </h3>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-700">
                    {personalInfo.languages.map((lang, i) => (
                      <span key={i}>{lang.name}</span>
                    ))}
                  </div>
                </div>

                {/* Hobbies */}
                <div className="pt-2 border-t border-neutral-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] mb-2 font-['Archivo',sans-serif]">
                    Hobbies
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-600">
                    {personalInfo.hobbies.map((hobby, i) => (
                      <span key={i}>• {hobby.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column of Page 1 */}
              <div className="md:col-span-7 space-y-6">
                {/* Work Experience */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] pb-1.5 border-b border-[#1E88B5] mb-3 flex items-center justify-between font-['Archivo',sans-serif]">
                    <span>Work Experience</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Page 1 of 2</span>
                  </h3>

                  <div className="space-y-4">
                    {experiences.map((exp, idx) => (
                      <div key={exp.id || idx}>
                        <h4 className="text-sm font-bold text-neutral-900 font-['Archivo',sans-serif]">
                          {exp.role}
                        </h4>
                        <p className="text-xs font-semibold text-neutral-700">Company Name : {exp.company}</p>
                        <p className="text-xs text-neutral-500">
                          {exp.location} · {exp.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] pb-1.5 border-b border-[#1E88B5] mb-3 font-['Archivo',sans-serif]">
                    Education
                  </h3>

                  <div className="space-y-3 text-xs">
                    {educationList.map((edu, idx) => (
                      <div key={edu.id || idx}>
                        <h4 className="font-bold text-neutral-900 font-['Archivo',sans-serif]">
                          {edu.degree}
                        </h4>
                        <p className="text-neutral-700">Institute: {edu.institute}</p>
                        <p className="text-neutral-500">
                          Board: {edu.board} · Group: {edu.group} · Result: {edu.result} · Passing Year: {edu.passingYear}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Computer Skills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] pb-1.5 border-b border-[#1E88B5] mb-3 font-['Archivo',sans-serif]">
                    Computer Skills
                  </h3>

                  <ul className="grid grid-cols-1 gap-1.5 text-xs text-neutral-700 list-disc list-inside">
                    {skillBars.map((sk, idx) => (
                      <li key={sk.id || idx}>{sk.name}</li>
                    ))}
                  </ul>
                </div>

                {/* References */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E88B5] pb-1.5 border-b border-[#1E88B5] mb-2 font-['Archivo',sans-serif]">
                    References
                  </h3>
                  <div className="text-xs text-neutral-700">
                    <p className="font-bold text-neutral-900 font-['Archivo',sans-serif]">{referencePerson.name}</p>
                    <p className="text-neutral-600 font-semibold">{referencePerson.role}</p>
                    <p className="text-neutral-500">{referencePerson.phone}</p>
                    <p className="text-neutral-500">{referencePerson.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2 REPRODUCTION */}
          <div className="border border-neutral-300 rounded-lg p-6 sm:p-10 shadow-xs max-w-3xl mx-auto bg-white space-y-8">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-['Archivo',sans-serif]">
                Curriculum Vitae — Page 2
              </span>
              <span className="text-xs text-neutral-400 font-bold font-['Archivo',sans-serif]">{personalInfo.name}</span>
            </div>

            {/* Professional Qualification */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1.5 border-b border-neutral-300 mb-3 font-['Archivo',sans-serif]">
                Professional Qualification
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700 list-disc list-inside">
                {professionalQualifications.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1.5 border-b border-neutral-300 mb-3 font-['Archivo',sans-serif]">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-neutral-700">
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Name:</span> {personalInfo.name}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Father's Name:</span> {personalInfo.personalDetails.fatherName}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Mother's Name:</span> {personalInfo.personalDetails.motherName}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Date of Birth:</span> {personalInfo.personalDetails.dob}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Religion:</span> {personalInfo.personalDetails.religion}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Marital Status:</span> {personalInfo.personalDetails.maritalStatus}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Nationality:</span> {personalInfo.personalDetails.nationality}</p>
                <p><span className="font-bold text-neutral-900 w-28 inline-block font-['Archivo',sans-serif]">Blood Group:</span> {personalInfo.personalDetails.bloodGroup}</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-700">
              <div>
                <h4 className="font-bold text-neutral-900 uppercase pb-1 border-b border-neutral-200 mb-2 font-['Archivo',sans-serif]">
                  Present Address
                </h4>
                <p>{personalInfo.presentAddress}</p>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 uppercase pb-1 border-b border-neutral-200 mb-2 font-['Archivo',sans-serif]">
                  Permanent Address
                </h4>
                <p>{personalInfo.permanentAddress}</p>
              </div>
            </div>

            {/* Declaration */}
            <div className="pt-4 border-t border-neutral-200">
              <h4 className="font-bold text-neutral-900 uppercase pb-1 border-b border-neutral-200 mb-2 text-xs font-['Archivo',sans-serif]">
                Declaration
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed text-justify">
                {personalInfo.declarationText || 'I hereby declare that all the information provided in this CV is true, accurate, and complete to the best of my knowledge and belief. I take full responsibility for the authenticity of the information mentioned above and assure that I will perform my duties with sincerity, dedication, and professionalism.'}
              </p>

              <div className="mt-12 text-right">
                <div className="inline-block text-center border-t border-neutral-400 pt-2 px-6">
                  <p className="text-xs text-neutral-500 italic">(Signature)</p>
                  <p className="text-xs font-bold text-neutral-900 font-['Archivo',sans-serif]">{personalInfo.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
