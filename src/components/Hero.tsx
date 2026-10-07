import React from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  FileDown,
  Eye,
  Send,
  Award,
  CheckCircle,
  Headphones,
} from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
  onOpenAdmin?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const {
    personalInfo,
    customPhoto,
    isPhotoReady,
    downloadCv,
    isDownloading,
  } = usePortfolioData();

  const activePhoto = customPhoto || (isPhotoReady ? '/user-photo.png' : null);
  const heroStats = personalInfo.heroStats && personalInfo.heroStats.length >= 3
    ? personalInfo.heroStats
    : [
        { title: '8 Years Job', subtitle: 'Experience' },
        { title: '650+ Projects', subtitle: 'Completed' },
        { title: 'Online 24/7', subtitle: 'Client Support' },
      ];

  return (
    <section className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-20 bg-[#FFF9F6] dark:bg-[#121110] transition-colors">
      {/* Decorative ambient background rings matching reference */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-950/20 blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-amber-200/20 dark:bg-amber-950/15 blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-12">
          {/* Left Column: Greeting, Name, Role, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* "Hi, I'm" tag in signature warm orange */}
            <div className="mb-2">
              <span className="text-[#FD6F41] font-bold text-lg sm:text-xl font-['Archivo',sans-serif] tracking-normal">
                {personalInfo.greeting || "Hi, I'm"}
              </span>
            </div>

            {/* Massive Name - Clear text in Archivo */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight leading-[1.1] mb-3">
              {personalInfo.name}
            </h1>

            {/* Role / Subtitle - Clear text in Archivo */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-neutral-100 mb-5 font-['Archivo',sans-serif] tracking-tight">
              {personalInfo.role}
            </h2>

            {/* Career Objective Text */}
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl mb-8">
              {personalInfo.careerObjective}
            </p>

            {/* Primary Action Buttons (Pristine visitor layout) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Guaranteed Direct CV Download Button */}
              <button
                onClick={downloadCv}
                disabled={isDownloading}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6F41] cursor-pointer font-['Archivo',sans-serif]"
                title="Download official CV PDF directly"
              >
                <FileDown className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading PDF...' : 'Download CV (PDF)'}</span>
              </button>

              {/* View CV in Modal */}
              <button
                onClick={onOpenResume}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#111827] dark:text-neutral-200 bg-white dark:bg-[#1C1A18] border border-neutral-300/80 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 shadow-xs cursor-pointer font-['Archivo',sans-serif]"
                title="Preview full 2-page CV"
              >
                <Eye className="w-4 h-4 text-[#FD6F41]" />
                <span>View Full CV</span>
              </button>

              {/* Contact Button */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-[#FD6F41] border-2 border-[#FD6F41] hover:bg-[#FD6F41] hover:text-white rounded-full transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6F41] font-['Archivo',sans-serif]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          {/* Right Column: Orange Arch Backdrop with User Photo */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md flex justify-center">
              {/* Layered concentric ambient background ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[410px] h-[340px] sm:h-[410px] rounded-full border-2 border-orange-200/50 dark:border-orange-900/30 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] rounded-full border border-orange-100 dark:border-orange-950/20 pointer-events-none"></div>

              {/* Signature Orange Arch (Half-circle / Arch shape matching reference) */}
              <div
                className="relative w-[280px] sm:w-[340px] h-[350px] sm:h-[420px] rounded-t-full bg-gradient-to-t from-[#FD6F41] via-[#FD7E54] to-[#FFA07A] shadow-2xl shadow-orange-500/30 overflow-hidden flex items-end justify-center select-none"
                title=""
              >
                {activePhoto && (
                  <img
                    src={activePhoto}
                    alt={`${personalInfo.name} - ${personalInfo.role}`}
                    className="relative z-10 w-full h-[105%] object-cover object-top hover:scale-105 transition-transform duration-500 ease-out"
                  />
                )}
              </div>

              {/* Quick floating trust badge */}
              <div className="absolute -bottom-3 right-4 sm:right-6 bg-white dark:bg-[#1E1B18] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FD6F41] flex items-center justify-center font-bold text-xs font-['Archivo',sans-serif]">
                  {personalInfo.badgeValue || '7+'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#111827] dark:text-white leading-tight font-['Archivo',sans-serif]">
                    {personalInfo.badgeTitle || 'Years Active'}
                  </p>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {personalInfo.badgeSubtitle || 'AR Digital Sign'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Horizontal Stat Bar */}
        <div className="mt-8 pt-4">
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1C1A18] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-full p-4 sm:py-4 sm:px-8 shadow-xl shadow-orange-500/5 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-center justify-between">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 sm:justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FD6F41] flex items-center justify-center shrink-0 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white font-['Archivo',sans-serif] leading-tight">
                  {heroStats[0]?.title || '8 Years Job'}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{heroStats[0]?.subtitle || 'Experience'}</p>
              </div>
            </div>

            {/* Divider for desktop */}
            <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-neutral-800 mx-auto"></div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 sm:justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FD6F41] flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white font-['Archivo',sans-serif] leading-tight">
                  {heroStats[1]?.title || '650+ Projects'}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{heroStats[1]?.subtitle || 'Completed'}</p>
              </div>
            </div>

            {/* Divider for desktop */}
            <div className="hidden sm:block w-px h-8 bg-neutral-200 dark:bg-neutral-800 mx-auto"></div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 sm:justify-center">
              <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FD6F41] flex items-center justify-center shrink-0 shadow-xs">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-white font-['Archivo',sans-serif] leading-tight">
                  {heroStats[2]?.title || 'Online 24/7'}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{heroStats[2]?.subtitle || 'Client Support'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
