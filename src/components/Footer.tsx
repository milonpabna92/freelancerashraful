import React from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ArrowUp, FileDown, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenResume: () => void;
  onOpenDeployGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume, onOpenDeployGuide, onOpenAdmin }) => {
  const { personalInfo, downloadCv, isDownloading } = usePortfolioData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#121110] border-t border-orange-100/80 dark:border-neutral-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200/60 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">Ashraful</span>
              <span className="text-[#FD6F41] text-2xl leading-none">.</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {personalInfo.role} · Pre-Press & Offset Printing Specialist
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Guaranteed Direct CV Download */}
            <button
              onClick={downloadCv}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full transition-colors shadow-sm cursor-pointer font-['Archivo',sans-serif]"
              title="Download official 2-page CV PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download CV (PDF)'}</span>
            </button>

            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-[#FD6F41] dark:hover:text-[#FD6F41] transition-colors cursor-pointer font-['Archivo',sans-serif]"
            >
              <span>View Full CV</span>
            </button>

            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer font-['Archivo',sans-serif]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Deploy Guide</span>
            </button>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-orange-100/70 hover:text-[#FD6F41] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            {/* Secret double-click on copyright triggers admin panel */}
            <span
              onDoubleClick={onOpenAdmin}
              className="select-none cursor-default"
              title=""
            >
              © {new Date().getFullYear()} {personalInfo.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>Pabna, Bangladesh</span>
            <span aria-hidden="true">·</span>
            <a
              href={personalInfo.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FD6F41] transition-colors"
            >
              Behance
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={personalInfo.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FD6F41] transition-colors"
            >
              Facebook
            </a>
          </div>

          <div className="text-right">
            <span>Senior Graphic Designer Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
